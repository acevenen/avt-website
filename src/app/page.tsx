import Link from "next/link";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-16">
      <header className="mb-12">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
          Ace Venen Trading
        </p>
        <h1 className="mt-3 font-display text-5xl font-extrabold leading-none text-[var(--paper)]">
          Earn your belts.
        </h1>
        <p className="mt-4 max-w-md text-[var(--muted)]">
          Start free. Rank up when you&apos;re ready. Every belt is here — tap
          one to see what&apos;s inside.
        </p>
      </header>
      <div className="grid gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <footer className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-sm text-[var(--muted)]">
        <Link href="/learn" className="hover:text-[var(--paper)]">
          Free pillars
        </Link>
        <Link href="/paid" className="hover:text-[var(--paper)]">
          Student portal
        </Link>
        <Link href="/apply" className="hover:text-[var(--paper)]">
          Apply
        </Link>
        <span className="ml-auto font-mono text-xs">© 2026 AVT</span>
      </footer>
    </main>
  );
}
