import { cn } from "@/lib/utils";

export function LocationBadge({
  label = "Montes Claros · MG",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex border border-white/12 bg-black/62 px-4 py-2 text-[0.62rem] uppercase tracking-[0.24em] text-white/58 backdrop-blur-md",
        className,
      )}
    >
      {label}
    </div>
  );
}
