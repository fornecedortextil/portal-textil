import { MapPin, MessageCircle, Globe, Star, Crown, ShieldCheck } from "lucide-react";
import type { Product } from "../data";

const BADGE_STYLES: Record<string, string> = {
  "Destaque":          "bg-[var(--gold)] text-white",
  "Seminova":          "bg-[var(--navy-soft)] text-[var(--navy)]",
  "Liquidação":        "bg-rose-100 text-rose-700",
  "Novo":              "bg-emerald-100 text-emerald-700",
  "Importado":         "bg-amber-100 text-amber-700",
  "Importação direta": "bg-amber-100 text-amber-800",
  "Fábrica direta":    "bg-orange-100 text-orange-700",
};

const CATEGORY_BG: Record<string, string> = {
  "Tecidos":           "bg-blue-50 text-blue-700",
  "Malhas":            "bg-violet-50 text-violet-700",
  "Fios & Aviamentos": "bg-teal-50 text-teal-700",
  "Maquinário":        "bg-slate-100 text-slate-700",
  "Saldos":            "bg-rose-50 text-rose-700",
};

export type FeaturedLevel = "destaque" | "premium" | null;

interface Props {
  product: Product;
  index: number;
  featured?: FeaturedLevel;
  onSellerClick?: (seller: string) => void;
}

export function ProductCard({ product: p, index, featured = null, onSellerClick }: Props) {
  const isDestaque = featured === "destaque";
  const isPremium = featured === "premium";
  const isAnyFeatured = isDestaque || isPremium;

  const borderColor = isPremium ? "#7C3AED" : isDestaque ? "var(--gold)" : "var(--line)";
  const accentColor = isPremium ? "#7C3AED" : "var(--gold)";
  const topBarBg = isPremium
    ? "linear-gradient(90deg, #7C3AED, #6D28D9)"
    : isDestaque
    ? "linear-gradient(90deg, var(--gold), var(--gold-light))"
    : p.origin === "china"
    ? "linear-gradient(90deg, var(--gold), var(--gold-light))"
    : "linear-gradient(90deg, var(--navy), var(--navy-mid))";

  return (
    <div
      className="fade-up"
      style={{
        display: "flex",
        flexDirection: "column",
        background: "white",
        borderRadius: 18,
        border: `1.5px solid ${borderColor}`,
        overflow: "hidden",
        transition: "transform .18s ease, box-shadow .18s ease",
        animationDelay: `${index * 40}ms`,
        boxShadow: isAnyFeatured
          ? isPremium
            ? "0 4px 20px rgba(124,58,237,0.18), 0 2px 6px rgba(124,58,237,0.1)"
            : "0 4px 20px rgba(200,160,48,0.2), 0 2px 6px rgba(200,160,48,0.12)"
          : "0 1px 3px rgba(13,31,60,0.08)",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-3px)";
        el.style.boxShadow = isAnyFeatured
          ? isPremium
            ? "0 8px 32px rgba(124,58,237,0.25)"
            : "0 8px 32px rgba(200,160,48,0.28)"
          : "0 4px 14px rgba(13,31,60,0.12)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = isAnyFeatured
          ? isPremium
            ? "0 4px 20px rgba(124,58,237,0.18)"
            : "0 4px 20px rgba(200,160,48,0.2)"
          : "0 1px 3px rgba(13,31,60,0.08)";
      }}
    >
      {/* Featured ribbon */}
      {isAnyFeatured && (
        <div style={{
          position: "absolute", top: 12, right: -22,
          background: isPremium ? "#7C3AED" : "var(--gold)",
          color: "white", fontSize: 9, fontWeight: 900,
          padding: "3px 28px 3px 10px",
          transform: "rotate(0deg)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          display: "flex", alignItems: "center", gap: 3,
          zIndex: 1,
          borderRadius: "4px 0 0 4px",
        }}>
          {isPremium ? <Crown size={9} /> : <Star size={9} fill="white" />}
          {isPremium ? "Premium" : "Destaque"}
        </div>
      )}

      {/* Color bar top */}
      <div style={{ height: isAnyFeatured ? 3 : 1.5, width: "100%", background: topBarBg }} />

      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: 18 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6, marginBottom: 10 }}>
          <span style={{
            padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "0.06em",
            background: "var(--navy-soft)", color: "var(--navy)",
          }}>
            {p.category}
          </span>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {isAnyFeatured && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                padding: "2px 7px", borderRadius: 6, fontSize: 10, fontWeight: 800,
                background: isPremium ? "#F5F3FF" : "var(--gold-soft)",
                color: isPremium ? "#6D28D9" : "var(--gold-dark)",
                border: `1px solid ${isPremium ? "#DDD6FE" : "rgba(200,160,48,0.35)"}`,
              }}>
                {isPremium ? <Crown size={9} /> : <Star size={9} fill="var(--gold-dark)" />}
                {isPremium ? "Premium" : "Destaque"}
              </span>
            )}
            {isPremium && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                padding: "2px 7px", borderRadius: 6, fontSize: 10, fontWeight: 800,
                background: "#F0FDF4", color: "#166534",
                border: "1px solid #BBF7D0",
              }}>
                <ShieldCheck size={9} /> Verificado
              </span>
            )}
            {p.badge && !isAnyFeatured && (
              <span style={{
                padding: "2px 7px", borderRadius: 6, fontSize: 10, fontWeight: 800,
                textTransform: "uppercase", letterSpacing: "0.04em",
                background: p.badge === "Liquidação" ? "#FFF5F5" : p.badge === "Novo" ? "#F0FDF4" : "var(--gold-soft)",
                color: p.badge === "Liquidação" ? "#DC2626" : p.badge === "Novo" ? "#166534" : "var(--gold-dark)",
              }}>
                {p.badge}
              </span>
            )}
          </div>
        </div>

        <h3 style={{
          fontWeight: 800, fontSize: 14, color: "var(--ink)", lineHeight: 1.35,
          marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {p.title}
        </h3>
        <p style={{
          fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.5, flex: 1,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {p.description}
        </p>

        {/* Price */}
        <div style={{ marginTop: 14, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: isAnyFeatured ? accentColor : "var(--navy)", lineHeight: 1 }}>
                {p.price}
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-soft)" }}>/{p.unit}</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 3 }}>Pedido mín.: {p.minOrder}</div>
          </div>
          {p.origin === "china" && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 800, color: "var(--gold-dark)", background: "var(--gold-soft)", border: "1px solid rgba(200,160,48,0.3)", padding: "4px 8px", borderRadius: 999 }}>
              <Globe size={10} /> China
            </span>
          )}
        </div>

        {/* Seller + WhatsApp */}
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${isAnyFeatured ? (isPremium ? "#EDE9FE" : "rgba(200,160,48,0.2)") : "var(--line)"}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
            <MapPin size={11} color="var(--ink-soft)" style={{ flexShrink: 0 }} />
            {onSellerClick ? (
              <button
                onClick={() => onSellerClick(p.seller)}
                style={{ fontSize: 11, color: isAnyFeatured ? accentColor : "var(--navy)", fontWeight: 700, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline", textDecorationStyle: "dotted", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                {p.seller}
              </button>
            ) : (
              <span style={{ fontSize: 11, color: "var(--ink-soft)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {p.seller}
              </span>
            )}
            <span style={{ fontSize: 11, color: "var(--ink-soft)", flexShrink: 0 }}>· {p.city}/{p.uf}</span>
          </div>
          <a
            href={`https://wa.me/?text=Olá, tenho interesse no produto: ${encodeURIComponent(p.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 11px", borderRadius: 8, background: "#22C55E", color: "white", fontSize: 11, fontWeight: 800, textDecoration: "none", flexShrink: 0 }}
          >
            <MessageCircle size={11} /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
