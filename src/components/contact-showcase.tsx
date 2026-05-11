"use client";

import { type ChangeEvent, type ReactNode, useState } from "react";
import { Instagram, LoaderCircle, Mail, MessageCircle } from "lucide-react";
import siteConfig from "@/lib/metadata";
import { type Lang } from "@/lib/i18n";
import { Reveal } from "@/components/reveal";
import { ContactActionRows } from "@/components/contact-action-rows";
import { MontesClarosMap } from "@/components/montes-claros-map";

const copy = {
  pt: {
    eyebrow: "Contato",
    titleTop: "Vamos",
    titleBottom: "conversar",
    intro: "Conte brevemente o projeto.",
    directTitle: "Contato direto",
    directIntro: "Copiar",
    mapLabel: "Montes Claros · MG · Brasil",
    formTag: "Nova conversa",
    name: "Nome",
    phone: "Telefone",
    email: "E-mail",
    message: "Mensagem",
    placeholderName: "Seu nome",
    placeholderPhone: "Seu telefone",
    placeholderEmail: "voce@email.com",
    placeholderMessage: "Projeto, imóvel ou ideia inicial.",
    sendTitle: "Enviar mensagem por",
    whatsappAction: "WhatsApp",
    emailAction: "E-mail",
    instagramAction: "Instagram",
    privacy:
      "Se você enviar por e-mail, usamos seus dados apenas para responder ao contato e encaminhar uma cópia da mensagem para você.",
    instagramHint:
      "O Instagram não aceita mensagem pré-preenchida. Por isso, copiamos o texto antes de abrir o perfil do estúdio.",
    needMessage: "Escreva uma mensagem antes de enviar.",
    needEmail: "Informe um e-mail válido para receber a cópia da mensagem.",
    whatsappReady: "Abrimos o WhatsApp com a mensagem pronta para envio.",
    instagramReady: "Mensagem copiada. O perfil do Instagram foi aberto em seguida.",
    emailSending: "Enviando e-mail...",
    emailSuccess: "Mensagem enviada para Julia. Uma cópia também foi encaminhada para o seu e-mail.",
    emailSuccessNoCopy: "Mensagem enviada para Julia.",
    emailUnavailable: "O envio direto por e-mail ainda não está configurado neste ambiente.",
    emailError: "Não foi possível enviar o e-mail agora. Tente novamente em instantes.",
    copyHint: "Clique para copiar",
    base: "Base",
  },
  en: {
    eyebrow: "Contact",
    titleTop: "Let's",
    titleBottom: "talk",
    intro: "Share a short note about the project.",
    directTitle: "Direct contact",
    directIntro: "Copy",
    mapLabel: "Montes Claros · MG · Brazil",
    formTag: "New conversation",
    name: "Name",
    phone: "Phone",
    email: "E-mail",
    message: "Message",
    placeholderName: "Your name",
    placeholderPhone: "Your phone",
    placeholderEmail: "you@email.com",
    placeholderMessage: "Project, property, or initial idea.",
    sendTitle: "Send message by",
    whatsappAction: "WhatsApp",
    emailAction: "E-mail",
    instagramAction: "Instagram",
    privacy:
      "If you send by e-mail, we only use your data to reply to the contact and send you a copy of the message.",
    instagramHint:
      "Instagram does not support prefilled messages, so we copy the text before opening the studio profile.",
    needMessage: "Write a message before sending.",
    needEmail: "Enter a valid e-mail to receive a copy of the message.",
    whatsappReady: "WhatsApp was opened with your message ready to send.",
    instagramReady: "Message copied. The Instagram profile was opened right after.",
    emailSending: "Sending e-mail...",
    emailSuccess: "Message sent to Julia. A copy was also sent to your e-mail.",
    emailSuccessNoCopy: "Message sent to Julia.",
    emailUnavailable: "Direct e-mail sending is not configured in this environment yet.",
    emailError: "We could not send the e-mail right now. Please try again shortly.",
    copyHint: "Click to copy",
    base: "Base",
  },
} as const;

type ContactFormState = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

type FeedbackTone = "neutral" | "success" | "error";

const initialFormState: ContactFormState = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

function maybeReveal(children: ReactNode, animated: boolean, delay = 0) {
  if (!animated) return <>{children}</>;
  return <Reveal delay={delay}>{children}</Reveal>;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function composeOutboundMessage(lang: Lang, form: ContactFormState) {
  const intro =
    lang === "pt"
      ? "Olá Julia! Vim pelo site e gostaria de conversar sobre um projeto."
      : "Hello Julia! I found your website and would like to talk about a project.";

  const details = [
    form.name.trim() ? `${lang === "pt" ? "Nome" : "Name"}: ${form.name.trim()}` : null,
    form.phone.trim() ? `${lang === "pt" ? "Telefone" : "Phone"}: ${form.phone.trim()}` : null,
    form.email.trim() ? `${lang === "pt" ? "E-mail" : "E-mail"}: ${form.email.trim()}` : null,
    "",
    `${lang === "pt" ? "Mensagem" : "Message"}:`,
    form.message.trim(),
  ].filter(Boolean);

  return [intro, "", ...details].join("\n");
}

function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function ContactField({
  label,
  name,
  value,
  placeholder,
  onChange,
  multiline = false,
}: {
  label: string;
  name: keyof ContactFormState;
  value: string;
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
}) {
  const baseClass =
    "mt-2 w-full bg-transparent text-[0.9rem] leading-relaxed text-black outline-none placeholder:text-black/26";

  return (
    <label className="block border-b border-black/12 pb-3">
      <span className="text-[0.58rem] uppercase tracking-[0.2em] text-black/42">
        {label}
      </span>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          className={`${baseClass} min-h-[5.75rem] resize-y`}
        />
      ) : (
        <input
          type={name === "email" ? "email" : "text"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseClass}
        />
      )}
    </label>
  );
}

function ContactChannelButton({
  icon,
  label,
  onClick,
  loading = false,
  invert = false,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  loading?: boolean;
  invert?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={
        invert
          ? "inline-flex min-h-[2.7rem] items-center justify-center gap-3 bg-black px-4 py-2 text-center text-[0.62rem] uppercase tracking-[0.17em] text-white transition-colors hover:bg-black/86 disabled:cursor-wait disabled:opacity-70"
          : "inline-flex min-h-[2.7rem] items-center justify-center gap-3 border border-black/14 bg-white px-4 py-2 text-center text-[0.62rem] uppercase tracking-[0.17em] text-black transition-colors hover:border-black/32 hover:bg-black/[0.02] disabled:cursor-wait disabled:opacity-70"
      }
    >
      {loading ? <LoaderCircle size={15} className="animate-spin" /> : icon}
      {label}
    </button>
  );
}

export function ContactShowcase({
  lang,
  variant = "page",
  animated = variant === "page",
}: {
  lang: Lang;
  variant?: "page" | "panel";
  animated?: boolean;
}) {
  const t = copy[lang];
  const isPanel = variant === "panel";
  const [form, setForm] = useState<ContactFormState>(initialFormState);
  const [website, setWebsite] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: FeedbackTone; message: string } | null>(null);

  const rows = [
    {
      label: "WhatsApp",
      value: "+55 (38) 99266-5556",
      hint: t.copyHint,
      icon: "whatsapp" as const,
      copyValue: "+55 38 99266-5556",
    },
    {
      label: "Email",
      value: siteConfig.email.replace("@gmail.com", ""),
      hint: t.copyHint,
      icon: "email" as const,
      copyValue: siteConfig.email,
    },
    {
      label: "Instagram",
      value: "@juliafonseca.arq",
      hint: t.copyHint,
      icon: "instagram" as const,
      copyValue: "@juliafonseca.arq",
    },
  ];

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleWhatsApp = () => {
    if (!form.message.trim()) {
      setFeedback({ tone: "error", message: t.needMessage });
      return;
    }

    const message = composeOutboundMessage(lang, form);
    openExternal(`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`);
    setFeedback({ tone: "success", message: t.whatsappReady });
  };

  const handleInstagram = async () => {
    if (!form.message.trim()) {
      setFeedback({ tone: "error", message: t.needMessage });
      return;
    }

    const message = composeOutboundMessage(lang, form);

    try {
      await navigator.clipboard.writeText(message);
      openExternal(siteConfig.instagram);
      setFeedback({ tone: "success", message: t.instagramReady });
    } catch {
      openExternal(siteConfig.instagram);
      setFeedback({ tone: "neutral", message: t.instagramHint });
    }
  };

  const handleEmail = async () => {
    if (!form.message.trim()) {
      setFeedback({ tone: "error", message: t.needMessage });
      return;
    }

    if (!isValidEmail(form.email.trim())) {
      setFeedback({ tone: "error", message: t.needEmail });
      return;
    }

    try {
      setIsSendingEmail(true);
      setFeedback({ tone: "neutral", message: t.emailSending });

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          lang,
          website,
          source: variant,
        }),
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(data?.message ?? t.emailError);
      }

      setFeedback({
        tone: "success",
        message: data?.message ?? t.emailSuccess,
      });
      setForm(initialFormState);
      setWebsite("");
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : t.emailUnavailable;
      setFeedback({ tone: "error", message });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className={isPanel ? "isolate relative h-full overflow-hidden bg-black text-white" : "isolate relative min-h-screen overflow-hidden bg-black text-white"}>
      <MontesClarosMap />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.2)_58%,rgba(0,0,0,0.58)_100%)]" />

      <section
        className={`relative z-20 ${
          isPanel
            ? "flex h-full items-center overflow-y-auto px-5 py-12 sm:px-8 lg:pl-[20rem] lg:pr-10 xl:pl-[24rem]"
            : "flex min-h-screen items-center justify-center px-5 py-24 md:px-12 lg:px-20"
        }`}
      >
        <div className={`mx-auto w-full ${isPanel ? "max-w-[44rem]" : "max-w-[48rem]"}`}>
          {maybeReveal(
            <article className="relative isolate w-full border border-white/20 bg-white text-black shadow-[0_24px_90px_rgba(0,0,0,0.42)] [transform:translateZ(0)]">
              <div className={isPanel ? "p-5 sm:p-6" : "p-5 sm:p-6 lg:p-7"}>
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_13.5rem] lg:items-stretch">
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <ContactField
                        label={t.name}
                        name="name"
                        value={form.name}
                        placeholder={t.placeholderName}
                        onChange={handleFieldChange}
                      />
                      <ContactField
                        label={t.phone}
                        name="phone"
                        value={form.phone}
                        placeholder={t.placeholderPhone}
                        onChange={handleFieldChange}
                      />
                    </div>

                    <ContactField
                      label={t.email}
                      name="email"
                      value={form.email}
                      placeholder={t.placeholderEmail}
                      onChange={handleFieldChange}
                    />

                    <ContactField
                      label={t.message}
                      name="message"
                      value={form.message}
                      placeholder={t.placeholderMessage}
                      onChange={handleFieldChange}
                      multiline
                    />

                    <label className="hidden">
                      Website
                      <input
                        type="text"
                        value={website}
                        onChange={(event) => setWebsite(event.target.value)}
                        autoComplete="off"
                        tabIndex={-1}
                      />
                    </label>

                    <div className="border-t border-black/12 pt-4">
                      <p className="text-[0.58rem] uppercase tracking-[0.2em] text-black/42">
                        {t.sendTitle}
                      </p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        <ContactChannelButton
                          icon={<MessageCircle size={14} />}
                          label={t.whatsappAction}
                          onClick={handleWhatsApp}
                          invert
                        />
                        <ContactChannelButton
                          icon={<Mail size={14} />}
                          label={t.emailAction}
                          onClick={handleEmail}
                          loading={isSendingEmail}
                        />
                        <ContactChannelButton
                          icon={<Instagram size={14} />}
                          label={t.instagramAction}
                          onClick={handleInstagram}
                        />
                      </div>
                    </div>

                    {feedback && (
                      <p
                        className={
                          feedback.tone === "success"
                            ? "text-[0.66rem] uppercase tracking-[0.15em] text-emerald-700"
                            : feedback.tone === "error"
                              ? "text-[0.66rem] uppercase tracking-[0.15em] text-red-700"
                              : "text-[0.66rem] uppercase tracking-[0.15em] text-black/54"
                        }
                      >
                        {feedback.message}
                      </p>
                    )}
                  </div>

                  <aside className="flex flex-col border-t border-black/12 pt-1 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                    <ContactActionRows lang={lang} rows={rows} />
                  </aside>
                </div>
              </div>
            </article>,
            animated,
            0.05,
          )}
        </div>
      </section>
    </div>
  );
}
