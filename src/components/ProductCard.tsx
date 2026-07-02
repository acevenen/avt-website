"use client";
import { useId, useState } from "react";
import type { Product } from "@/data/products";
import { checkoutUrl } from "@/lib/checkout";

function priceLabel(p: Product): string {
  if (p.price === null) return "Free";
  const amount = `$${p.price.toLocaleString()}`;
  if (p.cadence === "monthly") return `${amount}/mo`;
  if (p.cadence === "one-time") return `${amount} once`;
  return amount;
}

function destination(p: Product): string {
  return p.href ?? checkoutUrl(p.id);
}

export default function ProductCard({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div
      className="overflow-hidden rounded-lg bg-[var(--card)]"
      style={{ borderLeft: `4px solid ${product.beltColor}` }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--gold)]"
      >
        <div>
          <span className="block font-mono text-xs uppercase tracking-widest text-[var(--gold)]">
            {product.belt}
          </span>
          <span className="mt-1 block font-display text-2xl font-bold text-[var(--paper)]">
            {product.name}
          </span>
          <span className="mt-1 block text-sm text-[var(--muted)]">
            {product.tagline}
          </span>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="font-mono text-lg text-[var(--paper)]">
            {priceLabel(product)}
          </span>
          <span
            aria-hidden
            className="text-2xl leading-none text-[var(--gold)] transition-transform duration-300 motion-reduce:transition-none"
            style={{ transform: open ? "rotate(45deg)" : "none" }}
          >
            +
          </span>
        </div>
      </button>

      <div
        id={panelId}
        inert={!open}
        className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`border-t border-white/10 px-6 py-5 transition-opacity duration-300 motion-reduce:transition-none ${
              open ? "opacity-100" : "opacity-0"
            }`}
          >
            <ul className="grid gap-2">
              {product.includes.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-[var(--muted)]">
                  <span
                    aria-hidden
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: product.beltColor }}
                  />
                  {item}
                </li>
              ))}
            </ul>
            {product.spotsCap && (
              <p className="mt-4 font-mono text-xs uppercase tracking-widest text-[var(--gold)]">
                {product.spotsCap} seats only
              </p>
            )}
            <a
              href={destination(product)}
              className="mt-5 inline-flex w-fit items-center rounded-md bg-[var(--gold)] px-5 py-2.5 font-medium text-black transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--paper)]"
            >
              {product.ctaLabel}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
