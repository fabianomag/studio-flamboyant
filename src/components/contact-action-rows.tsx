"use client";

import { useState } from "react";
import { Check, Copy, Instagram, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

type Lang = "pt" | "en";

type Row = {
  label: string;
  value: string;
  hint: string;
  icon: "whatsapp" | "email" | "instagram";
  copyValue: string;
};

const iconMap = {
  whatsapp: FaWhatsapp,
  email: Mail,
  instagram: Instagram,
} as const;

export function ContactActionRows({
  lang,
  rows,
}: {
  lang: Lang;
  rows: Row[];
}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey((current) => (current === key ? null : current)), 1800);
    } catch {
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey((current) => (current === key ? null : current)), 1800);
    }
  };

  const copiedHint = lang === "pt" ? "Copiado" : "Copied";

  return (
    <div className="grid flex-1 gap-0 lg:grid-rows-3">
      {rows.map((row) => {
        const Icon = iconMap[row.icon];
        const rowKey = `${row.label}-${row.value}`;
        const isCopied = copiedKey === rowKey;

        return (
          <button
            key={rowKey}
            type="button"
            onClick={() => handleCopy(row.copyValue, rowKey)}
            className="group grid w-full grid-cols-[1.4rem_minmax(0,1fr)] gap-x-4 border-b border-black/12 py-5 text-left transition-colors hover:border-black/30"
          >
            <span className="pt-[0.08rem] text-black/64">
              <Icon size={18} strokeWidth={1.75} />
            </span>

            <span className="min-w-0">
              <span className="block break-words text-[0.92rem] font-medium leading-[1.18] tracking-normal text-black">
                {row.value}
              </span>
              <span className="mt-2 inline-flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.18em] text-black/36 transition-colors group-hover:text-black/56">
                {isCopied ? <Check size={12} /> : <Copy size={12} />}
                {isCopied ? copiedHint : row.hint}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
