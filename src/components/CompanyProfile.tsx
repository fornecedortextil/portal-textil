import React, { useState } from "react";
import {
  ArrowLeft, MapPin, ShieldCheck, MessageCircle,
  Star, Building2, Calendar, Package, Eye,
  Phone, Globe, ChevronRight, TrendingUp,
  Users, CheckCircle2, ZoomIn, X,
} from "lucide-react";
import { PRODUCTS, CHINA_PRODUCTS, SELLERS, type Product, type ProductSpecs } from "../data";
import { useAuth, isFeatureActive } from "../context/AuthContext";

interface Props {
  sellerName: string;
  onBack: () => void;
}

function fmtDate(iso: string) {
  const d = new Date(iso + "-01");
  return d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

const SPEC_LABELS: Record<keyof ProductSpecs, string> = {
  metragem: "Metragem",
  largura: "Largura",
  composicao: "Composição",
  gramatura: "Gramatura",
  cores: "Cores",
  rendimento: "Rendimento",
  potencia: "Potência",
  velocidade: "Velocidade",
  voltagem: "Voltagem",
  titulo: "Título do fio",
  elasticidade: "Elasticidade",
  acabamento: "Acabamento",
};

function PhotoGallery({ photos, title }: { photos: string[]; title: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const safePhotos = (photos && photos.length >= 4 ? photos : [
    `https://picsum.photos/seed/${title}-a/480/360`,
    `https://picsum.photos/seed/${title}-b/480/360`,
    `https://picsum.photos/seed/${title}-c/480/360`,
    `https://picsum.photos/seed/${title}-d/480/360`,
  ]);

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 4, height: 220, borderRadius: 14, overflow: "hidden", flexShrink: 0 }}>
        {safePhotos.map((url, i) => (
          <div
            key={i}
            onClick={() => setLightbox(i)}
            style={{ position: "relative", overflow: "hidden", cursor: "zoom-in", background: "#F1F5F9" }}
          >
            <img
              src={url}
              alt={`${title} — foto ${i + 1}`}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .25s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
            />
            {i === 3 && (
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "rgba(13,31,60,0.35)" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "white" }}>
                  <ZoomIn size={18} />
                  <span style={{ fontSize: 10, fontWeight: 700 }}>Ver fotos</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {lightbox !== null && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            style={{ position: "absolute", top: 20, right: 20, width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", display: "grid", placeItems: "center" }}
          >
            <X size={18} color="white" />
          </button>
          <img
            src={safePhotos[lightbox]}
            alt={`${title} — foto ${lightbox + 1}`}
            style={{ maxWidth: "90vw", maxHeight: "80vh", objectFit: "contain", borderRadius: 14 }}
            onClick={(e) => e.stopPropagation()}
          />
          <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
            {safePhotos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
                style={{ width: i === lightbox ? 22 : 8, height: 8, borderRadius: 999, background: i === lightbox ? "white" : "rgba(255,255,255,0.4)", border: "none", cursor: "pointer", transition: "width .2s, background .2s" }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function SpecsTable({ specs }: { specs: ProductSpecs }) {
  const entries = Object.entries(specs).filter(([, v]) => v) as [keyof ProductSpecs, string][];
  if (entries.length === 0) return null;

  return (
    <div style={{ marginTop: 14, borderRadius: 10, border: "1px solid var(--line)", overflow: "hidden" }}>
      <div style={{ padding: "7px 12px", background: "var(--navy-soft)", borderBottom: "1px solid var(--line)" }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: "var(--navy)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Especificações técnicas
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {entries.map(([key, val], i) => (
          <div
            key={key}
            style={{
              padding: "8px 12px",
              borderBottom: i < entries.length - 2 ? "1px solid var(--line)" : "none",
              borderRight: i % 2 === 0 ? "1px solid var(--line)" : "none",
              background: i % 4 < 2 ? "white" : "#FAFBFC",
            }}
          >
            <div style={{ fontSize: 10, color: "var(--ink-soft)", fontWeight: 600, marginBottom: 2 }}>
              {SPEC_LABELS[key] ?? key}
            </div>
            <div style={{ fontSize: 12, color: "var(--ink)", fontWeight: 700, lineHeight: 1.3 }}>{val}</div>
          </div>
        ))}
        {entries.length % 2 !== 0 && (
          <div style={{ padding: "8px 12px", background: "#FAFBFC" }} />
        )}
      </div>
    </div>
  );
}

function ProductProfileCard({ product, whatsapp }: { product: Product; whatsapp: string }) {
  const waMessage = encodeURIComponent(`Olá! Tenho interesse no produto "${product.title}" anunciado no Fornecedor Têxtil. Poderia me enviar mais informações?`);
  const waLink = `https://wa.me/${whatsapp}?text=${waMessage}`;

  return (
    <div style={{
      background: "white", borderRadius: 20, border: "1px solid var(--line)",
      overflow: "hidden", boxShadow: "0 2px 8px rgba(13,31,60,0.07)",
      transition: "box-shadow .18s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(13,31,60,0.12)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(13,31,60,0.07)"; }}
    >
      {/* Card header accent */}
      <div style={{ height: 3, background: "linear-gradient(90deg, var(--navy), var(--gold))" }} />

      <div style={{ padding: 20 }}>
        {/* Badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
          <span style={{ padding: "2px 9px", borderRadius: 6, background: "var(--navy-soft)", color: "var(--navy)", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {product.category}
          </span>
          {product.badge && (
            <span style={{
              padding: "2px 9px", borderRadius: 6, fontSize: 10, fontWeight: 800, textTransform: "uppercase",
              background: product.badge === "Liquidação" ? "#FFF5F5" : product.badge === "Novo" ? "#F0FDF4" : product.badge === "Seminova" ? "#F8FAFC" : "var(--gold-soft)",
              color: product.badge === "Liquidação" ? "#DC2626" : product.badge === "Novo" ? "#166534" : product.badge === "Seminova" ? "#475569" : "var(--gold-dark)",
            }}>
              {product.badge}
            </span>
          )}
          {product.origin === "china" && (
            <span style={{ padding: "2px 9px", borderRadius: 6, fontSize: 10, fontWeight: 800, background: "#FFF7ED", color: "#C2410C" }}>
              🇨🇳 China
            </span>
          )}
        </div>

        {/* Title & price row */}
        <div style={{ marginBottom: 14 }}>
          <h3 style={{ fontWeight: 900, fontSize: 17, color: "var(--ink)", lineHeight: 1.25, marginBottom: 6 }}>
            {product.title}
          </h3>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: "var(--navy)", lineHeight: 1 }}>{product.price}</span>
            <span style={{ fontSize: 13, color: "var(--ink-soft)", fontWeight: 600 }}>/{product.unit}</span>
            <span style={{ fontSize: 12, color: "var(--ink-soft)", marginLeft: 6 }}>· Pedido mín.: <strong>{product.minOrder}</strong></span>
          </div>
        </div>

        {/* Photo gallery + specs layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, alignItems: "start" }}>
          <PhotoGallery photos={product.photos ?? []} title={product.title} />

          <div>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.65, marginBottom: 12 }}>
              {product.description}
            </p>
            {product.specs && <SpecsTable specs={product.specs} />}
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div style={{ marginTop: 18, display: "flex", gap: 10, alignItems: "center" }}>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "12px 20px", borderRadius: 12, fontSize: 14, fontWeight: 800,
              background: "#22C55E", color: "white", textDecoration: "none",
              boxShadow: "0 3px 12px rgba(34,197,94,0.3)",
              transition: "background .15s, box-shadow .15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#16A34A";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 16px rgba(34,197,94,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#22C55E";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 3px 12px rgba(34,197,94,0.3)";
            }}
          >
            <MessageCircle size={18} /> Solicitar via WhatsApp
          </a>
          <div style={{ padding: "10px 14px", borderRadius: 12, background: "var(--navy-soft)", border: "1px solid var(--line)", fontSize: 12, color: "var(--ink-soft)", fontWeight: 600, textAlign: "center", whiteSpace: "nowrap" }}>
            <MapPin size={11} style={{ display: "inline", marginRight: 4 }} />{product.city}/{product.uf}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompanyProfile({ sellerName, onBack }: Props) {
  const { user } = useAuth();

  const allProducts = [...PRODUCTS, ...CHINA_PRODUCTS];
  const sellerProducts = allProducts.filter((p) => p.seller === sellerName);

  const profile = SELLERS[sellerName];
  const totalViews = sellerProducts.length * 120 + Math.floor(Math.random() * 500);

  const isOwnProfile = user?.companyName.includes(sellerName.split(" ")[0]);
  const phone = profile?.phone ?? "5511999999999";
  const displayName = profile?.name ?? sellerName;
  const initials = displayName.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();

  const hasFeatured = user && isOwnProfile &&
    user.ads.some((a) => a.status === "active" && isFeatureActive(a.featuredPlan));

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)" }}>

      {/* ── Top navbar ── */}
      <div style={{ background: "var(--navy)", borderBottom: "1px solid rgba(200,160,48,0.2)", position: "sticky", top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <button
            onClick={onBack}
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 9, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            <ArrowLeft size={14} /> Voltar ao portal
          </button>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: 5 }}>
            <Building2 size={12} /> Perfil público do fornecedor
          </div>
        </div>
      </div>

      {/* ── Company hero header ── */}
      <div style={{ background: "linear-gradient(135deg, #0A1628 0%, #0D1F3C 60%, #122040 100%)", borderBottom: "1px solid rgba(200,160,48,0.2)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(200,160,48,1) 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div style={{ position: "absolute", top: -80, right: -40, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,160,48,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "40px 24px 44px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "flex-start" }}>

            {/* Logo circle */}
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: 96, height: 96, borderRadius: 24,
                background: "linear-gradient(135deg, var(--gold), var(--gold-dark))",
                display: "grid", placeItems: "center",
                boxShadow: "0 8px 28px rgba(200,160,48,0.35)",
                border: "3px solid rgba(200,160,48,0.4)",
                fontSize: 34, fontWeight: 900, color: "white",
              }}>
                {initials}
              </div>
              {hasFeatured && (
                <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 8, background: "rgba(200,160,48,0.15)", border: "1px solid rgba(200,160,48,0.3)" }}>
                  <Star size={11} color="var(--gold)" fill="var(--gold)" />
                  <span style={{ fontSize: 10, fontWeight: 800, color: "var(--gold)" }}>Em Destaque</span>
                </div>
              )}
            </div>

            {/* Company info */}
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <h1 style={{ fontWeight: 900, fontSize: "clamp(20px, 3vw, 28px)", color: "white", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                  {displayName}
                </h1>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 11px", borderRadius: 8, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.35)", fontSize: 11, fontWeight: 800, color: "#4ADE80" }}>
                  <ShieldCheck size={12} /> CNPJ Verificado
                </span>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", marginBottom: 14 }}>
                {profile?.cnpj && (
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>
                    CNPJ: {profile.cnpj}
                  </span>
                )}
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                  <MapPin size={12} /> {profile?.city ?? sellerProducts[0]?.city}, {profile?.uf ?? sellerProducts[0]?.uf}
                </span>
                {profile?.memberSince && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                    <Calendar size={12} /> Membro desde {fmtDate(profile.memberSince)}
                  </span>
                )}
                {profile?.employees && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                    <Users size={12} /> {profile.employees} funcionários
                  </span>
                )}
              </div>

              {profile?.description && (
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 540, marginBottom: 16 }}>
                  {profile.description}
                </p>
              )}

              {profile?.specialties && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {profile.specialties.map((s) => (
                    <span key={s} style={{ padding: "4px 12px", borderRadius: 999, background: "rgba(200,160,48,0.12)", border: "1px solid rgba(200,160,48,0.25)", fontSize: 11, fontWeight: 600, color: "rgba(200,160,48,0.9)" }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Stats cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 180, flexShrink: 0 }}>
              {[
                { icon: Package, label: "Anúncios ativos", value: String(sellerProducts.length) },
                { icon: Eye, label: "Visualizações", value: totalViews.toLocaleString("pt-BR") },
                { icon: TrendingUp, label: "Avaliação", value: "4.9 / 5.0" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(200,160,48,0.2)", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(200,160,48,0.15)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <Icon size={16} color="var(--gold)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "white", lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>{label}</div>
                  </div>
                </div>
              ))}

              {/* WhatsApp company button */}
              <a
                href={`https://wa.me/${phone}?text=${encodeURIComponent(`Olá, encontrei o perfil da ${displayName} no Fornecedor Têxtil e gostaria de saber mais sobre seus produtos.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px 16px", borderRadius: 12, background: "#22C55E", color: "white", fontSize: 13, fontWeight: 800, textDecoration: "none", boxShadow: "0 4px 14px rgba(34,197,94,0.35)" }}
              >
                <Phone size={15} /> Contato direto
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trust bar ── */}
      <div style={{ background: "white", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 24px", display: "flex", flexWrap: "wrap", gap: "10px 32px" }}>
          {[
            { icon: ShieldCheck, text: "Empresa com CNPJ verificado pela plataforma", color: "#059669" },
            { icon: CheckCircle2, text: "Anúncios auditados e com fotos reais dos produtos", color: "var(--navy)" },
            { icon: MessageCircle, text: "Conexão direta B2B — negociação exclusivamente entre as partes", color: "#22C55E" },
          ].map(({ icon: Icon, text, color }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "var(--ink-soft)" }}>
              <Icon size={14} color={color} /> {text}
            </div>
          ))}
        </div>
      </div>

      {/* ── Products section ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
          <div>
            <h2 style={{ fontWeight: 900, fontSize: 22, color: "var(--ink)", letterSpacing: "-0.02em" }}>
              Produtos disponíveis
            </h2>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4 }}>
              {sellerProducts.length} {sellerProducts.length === 1 ? "anúncio" : "anúncios"} ativos de <strong>{displayName}</strong>
            </p>
          </div>
          <a
            href={`https://wa.me/${phone}?text=${encodeURIComponent(`Olá! Vi o catálogo de ${displayName} no Fornecedor Têxtil e tenho interesse em conhecer mais produtos.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 11, background: "#22C55E", color: "white", fontSize: 13, fontWeight: 800, textDecoration: "none" }}
          >
            <MessageCircle size={15} /> Solicitar catálogo completo <ChevronRight size={14} />
          </a>
        </div>

        {sellerProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--navy-soft)", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
              <Package size={28} color="var(--navy)" />
            </div>
            <h3 style={{ fontWeight: 800, fontSize: 18, color: "var(--ink)" }}>Nenhum anúncio encontrado</h3>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 6 }}>Este fornecedor ainda não possui anúncios publicados.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {sellerProducts.map((product) => (
              <ProductProfileCard key={product.id} product={product} whatsapp={phone} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ marginTop: 40, padding: "28px 32px", borderRadius: 20, background: "linear-gradient(135deg, var(--navy), #162D5A)", border: "1px solid rgba(200,160,48,0.2)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          <div>
            <h3 style={{ fontWeight: 900, fontSize: 18, color: "white", marginBottom: 4 }}>Tem interesse nos produtos desta empresa?</h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Fale diretamente com o fornecedor via WhatsApp. Resposta em até 24 horas.</p>
          </div>
          <a
            href={`https://wa.me/${phone}?text=${encodeURIComponent(`Olá, ${displayName}! Encontrei seu perfil no Fornecedor Têxtil e gostaria de negociar.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 24px", borderRadius: 12, background: "#22C55E", color: "white", fontSize: 14, fontWeight: 800, textDecoration: "none", boxShadow: "0 4px 16px rgba(34,197,94,0.3)", whiteSpace: "nowrap" }}
          >
            <MessageCircle size={17} /> Entrar em contato agora
          </a>
        </div>
      </div>
    </div>
  );
}
