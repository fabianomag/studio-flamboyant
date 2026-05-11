import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import siteConfig from "@/lib/metadata";

export const runtime = "nodejs";

type Lang = "pt" | "en";

type ContactPayload = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  website?: string;
  lang?: Lang;
  source?: "page" | "panel";
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function trim(value?: string) {
  return value?.trim() ?? "";
}

function getContactCopy(lang: Lang) {
  return lang === "pt"
    ? {
        invalidPayload: "Não foi possível ler os dados enviados.",
        missingMessage: "Escreva uma mensagem antes de enviar.",
        invalidEmail: "Informe um e-mail válido para receber a cópia da mensagem.",
        unavailable: "O envio direto por e-mail ainda não está configurado neste ambiente.",
        success: "Mensagem enviada para Julia. Uma cópia também foi encaminhada para o seu e-mail.",
        successNoCopy: "Mensagem enviada para Julia.",
        failure: "Não foi possível enviar o e-mail agora. Tente novamente em instantes.",
        subject: "Novo contato pelo site",
        replySubject: "Recebemos sua mensagem",
      }
    : {
        invalidPayload: "We could not read the submitted data.",
        missingMessage: "Write a message before sending.",
        invalidEmail: "Enter a valid e-mail to receive a copy of the message.",
        unavailable: "Direct e-mail sending is not configured in this environment yet.",
        success: "Message sent to Julia. A copy was also sent to your e-mail.",
        successNoCopy: "Message sent to Julia.",
        failure: "We could not send the e-mail right now. Please try again shortly.",
        subject: "New website contact",
        replySubject: "We received your message",
      };
}

function buildStudioMessage(payload: {
  lang: Lang;
  name: string;
  phone: string;
  email: string;
  message: string;
  source: string;
}) {
  const labels =
    payload.lang === "pt"
      ? {
          intro: "Novo contato recebido pelo site da Julia Fonseca Arquitetura.",
          name: "Nome",
          phone: "Telefone",
          email: "E-mail",
          source: "Origem",
          message: "Mensagem",
        }
      : {
          intro: "New contact received through Julia Fonseca Arquitetura website.",
          name: "Name",
          phone: "Phone",
          email: "E-mail",
          source: "Source",
          message: "Message",
        };

  const lines = [
    labels.intro,
    "",
    `${labels.name}: ${payload.name || "-"}`,
    `${labels.phone}: ${payload.phone || "-"}`,
    `${labels.email}: ${payload.email || "-"}`,
    `${labels.source}: ${payload.source}`,
    "",
    `${labels.message}:`,
    payload.message,
  ];

  return lines.join("\n");
}

function buildSenderCopy(payload: {
  lang: Lang;
  name: string;
  phone: string;
  email: string;
  message: string;
}) {
  const copy =
    payload.lang === "pt"
      ? {
          intro: "Recebemos sua mensagem e ela já foi encaminhada para Julia Fonseca Arquitetura.",
          summary: "Resumo do que você enviou:",
          name: "Nome",
          phone: "Telefone",
          email: "E-mail",
          message: "Mensagem",
        }
      : {
          intro: "We received your message and it has already been forwarded to Julia Fonseca Arquitetura.",
          summary: "Here is a summary of what you sent:",
          name: "Name",
          phone: "Phone",
          email: "E-mail",
          message: "Message",
        };

  return [
    copy.intro,
    "",
    copy.summary,
    `${copy.name}: ${payload.name || "-"}`,
    `${copy.phone}: ${payload.phone || "-"}`,
    `${copy.email}: ${payload.email || "-"}`,
    "",
    `${copy.message}:`,
    payload.message,
  ].join("\n");
}

function getTransportConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number.parseInt(process.env.SMTP_PORT ?? "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? user ?? siteConfig.email;
  const to = process.env.CONTACT_EMAIL_TO ?? siteConfig.email;

  if (!host || Number.isNaN(port)) {
    return null;
  }

  return {
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: user && pass ? { user, pass } : undefined,
    from,
    to,
  };
}

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { message: getContactCopy("pt").invalidPayload },
      { status: 400 },
    );
  }

  if (trim(payload.website)) {
    return NextResponse.json({ ok: true });
  }

  const lang = payload.lang === "en" ? "en" : "pt";
  const copy = getContactCopy(lang);
  const name = trim(payload.name);
  const phone = trim(payload.phone);
  const email = trim(payload.email);
  const message = trim(payload.message);
  const source = payload.source === "panel" ? "panel" : "page";

  if (!message) {
    return NextResponse.json({ message: copy.missingMessage }, { status: 400 });
  }

  if (email && !isValidEmail(email)) {
    return NextResponse.json({ message: copy.invalidEmail }, { status: 400 });
  }

  const transportConfig = getTransportConfig();

  if (!transportConfig) {
    return NextResponse.json({ message: copy.unavailable }, { status: 503 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: transportConfig.host,
      port: transportConfig.port,
      secure: transportConfig.secure,
      auth: transportConfig.auth,
    });

    await transporter.sendMail({
      from: transportConfig.from,
      to: transportConfig.to,
      replyTo: email || undefined,
      subject: `${copy.subject}${name ? ` — ${name}` : ""}`,
      text: buildStudioMessage({
        lang,
        name,
        phone,
        email,
        message,
        source,
      }),
    });

    if (email) {
      await transporter.sendMail({
        from: transportConfig.from,
        to: email,
        replyTo: transportConfig.to,
        subject: copy.replySubject,
        text: buildSenderCopy({
          lang,
          name,
          phone,
          email,
          message,
        }),
      });
    }

    return NextResponse.json({
      ok: true,
      message: email ? copy.success : copy.successNoCopy,
    });
  } catch (error) {
    console.error("Contact form e-mail send failed", error);

    return NextResponse.json({ message: copy.failure }, { status: 500 });
  }
}
