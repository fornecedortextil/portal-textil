import React from "react";
import { createRoot } from "react-dom/client";
import { useMemo, useState } from "react";
import {
  Search, SlidersHorizontal, Plus, Building2, MapPin,
  TrendingUp, ShieldCheck, Truck, X, Globe, Star,
  Factory, Package, ChevronRight, LogIn, LayoutDashboard, Users,
} from "lucide-react";
import {
  PRODUCTS, CHINA_PRODUCTS, CATEGORIES, UFS, CATEGORY_META,
  type Category,
} from "./data";
import { ProductCard } from "./components/ProductCard";
import { CategoryIcon } from "./components/CategoryIcon";
import { AdvertiseModal } from "./components/AdvertiseModal";
import { RegisterModal } from "./components/RegisterModal";
import { LoginModal } from "./components/LoginModal";
import { Dashboard } from "./components/Dashboard";
import { CompanyProfile } from "./components/CompanyProfile";
import { RepresentativeModal } from "./components/RepresentativeModal";
import { NotificationToast } from "./components/Toast";
import { AuthProvider, useAuth, isFeatureActive, type PlanType } from "./context/AuthContext";
import { NotificationProvider, useNotifications } from "./context/NotificationContext";
import { RepresentativesProvider, ADMIN_EMAIL } from "./context/RepresentativesContext";
import { AdminPanel } from "./components/AdminPanel";
import { RepresentativesSection } from "./components/RepresentativesSection";
import type { FeaturedLevel } from "./components/ProductCard";

type CatFilter = Category | "Todas";
type View = "home" | "dashboard" | "profile" | "admin";

function AppInner() {
  const { user, logout } = useAuth();
  const { latestToast, dismissToast } = useNotifications();
  const [cat, setCat] = useState<CatFilter>("Todas");
  const [uf, setUf] = useState<string>("");
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [advOpen, setAdvOpen] = useState(false);
  const [regOpen, setRegOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [repOpen, setRepOpen] = useState(false);
  const [view, setView] = useState<View>("home");
  const [profileSeller, setProfileSeller] = useState<string>("");

  const goToProfile = (seller: string) => {
    setProfileSeller(seller);
    setView("profile");
    window.scrollTo({ top: 0 });
  };

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (cat !== "Todas" && p.category !== cat) return false;
      if (uf && p.uf !== uf) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = `${p.title} ${p.seller} ${p.city} ${p.description}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [cat, uf, query]);

  const activeCount = (cat !== "Todas" ? 1 : 0) + (uf ? 1 : 0) + (query ? 1 : 0);
  const clearAll = () => { setCat("Todas"); setUf(""); setQuery(""); };

  /* Global toast — rendered outside the dashboard view too */
  const toast = (
    <NotificationToast
      notification={latestToast}
      onDismiss={dismissToast}
      onGoToDashboard={() => setView("dashboard")}
    />
  );

  const isAdmin = user?.email === ADMIN_EMAIL;

  if (view === "admin" && isAdmin) {
    return <AdminPanel onBack={() => setView("home")} />;
  }

  if (view === "profile") {
    return (
      <>
        <CompanyProfile
          sellerName={profileSeller}
          onBack={() => setView("home")}
        />
        {toast}
      </>
    );
  }

  if (view === "dashboard") {
    return (
      <>
        <Dashboard
          onBack={() => setView("home")}
          onNewAd={() => { setView("home"); setAdvOpen(true); }}
          onViewProfile={() => { if (user) goToProfile(user.companyName.replace(" Ltda.", "").replace(" S.A.", "").trim()); }}
        />
        {toast}
      </>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)" }}>

      {/* ===== HEADER ===== */}
      <header style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "rgba(13,31,60,0.97)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(200,160,48,0.2)",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, gap: 16 }}>

            {/* Logo */}
            <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: "linear-gradient(135deg, var(--gold), var(--gold-dark))",
                display: "grid", placeItems: "center",
              }}>
                <Factory size={19} color="white" />
              </div>
              <div style={{ lineHeight: 1 }}>
                <div style={{ fontWeight: 900, fontSize: 17, color: "white", letterSpacing: "-0.4px" }}>
                  Fornecedor<span style={{ color: "var(--gold)" }}>Têxtil</span>
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(200,160,48,0.7)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2 }}>
                  Portal B2B Nacional
                </div>
              </div>
            </a>

            {/* Nav */}
            <nav style={{ display: "flex", alignItems: "center", gap: 4 }} className="hide-mobile">
              {["Anúncios#anuncios","Categorias#categorias","Indústria Mundial#china","Como Funciona#como-funciona"].map((item) => {
                const [label, hash] = item.split("#");
                return (
                  <a key={hash} href={`#${hash}`} style={{
                    padding: "8px 12px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                    color: "rgba(255,255,255,0.7)", textDecoration: "none", transition: "color .15s",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                  >
                    {label}
                  </a>
                );
              })}
            </nav>

            {/* Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {user ? (
                /* Logged in state */
                <>
                  {isAdmin && (
                    <button
                      onClick={() => setView("admin")}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                        color: "rgba(255,255,255,0.65)", background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer",
                        transition: "all .15s",
                      }}
                      className="hide-mobile"
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.13)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                    >
                      <ShieldCheck size={14} />
                      Admin
                    </button>
                  )}
                  <button
                    onClick={() => setView("dashboard")}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                      color: "var(--gold)", background: "rgba(200,160,48,0.12)",
                      border: "1px solid rgba(200,160,48,0.3)", cursor: "pointer",
                      transition: "all .15s",
                    }}
                    className="hide-mobile"
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(200,160,48,0.2)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(200,160,48,0.12)"; }}
                  >
                    <LayoutDashboard size={15} />
                    Minha área
                  </button>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "6px 12px", borderRadius: 8,
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  }} className="hide-mobile">
                    <div style={{
                      width: 26, height: 26, borderRadius: 7,
                      background: "linear-gradient(135deg, var(--gold), var(--gold-dark))",
                      display: "grid", placeItems: "center", flexShrink: 0,
                    }}>
                      <span style={{ fontSize: 11, fontWeight: 900, color: "white" }}>
                        {user.companyName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.companyName}
                    </span>
                  </div>
                </>
              ) : (
                /* Logged out state */
                <button
                  onClick={() => setLoginOpen(true)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                    color: "rgba(255,255,255,0.85)", background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer",
                  }}
                  className="hide-mobile"
                >
                  <LogIn size={15} />
                  Entrar
                </button>
              )}
              <button
                onClick={() => setAdvOpen(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "9px 16px", borderRadius: 9, fontSize: 13, fontWeight: 700,
                  background: "linear-gradient(135deg, var(--gold), var(--gold-dark))",
                  color: "white", border: "none", cursor: "pointer",
                }}
              >
                <Plus size={15} />
                <span>Anunciar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #0A1628 0%, #0D1F3C 55%, #102240 100%)",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(200,160,48,1) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />
        <div style={{
          position: "absolute", top: -80, right: -60,
          width: 420, height: 420, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,160,48,0.15) 0%, transparent 70%)",
        }} />

        <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "72px 24px 80px" }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "7px 14px", borderRadius: 999,
              background: "rgba(200,160,48,0.12)", border: "1px solid rgba(200,160,48,0.3)", marginBottom: 20,
            }}>
              <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--gold)", display: "block" }} />
              <span style={{ color: "var(--gold)", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em" }}>
                +12.000 empresas conectadas
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 900, color: "white", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 20 }}>
              O marketplace têxtil<br />
              <span style={{ color: "var(--gold)" }}>que abastece o Brasil</span>
            </h1>

            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, maxWidth: 520, marginBottom: 32 }}>
              Encontre tecidos, malhas, fios, aviamentos, saldos e maquinário de confecções e
              indústrias em todo o território nacional — incluindo fornecedores diretos da China.
            </p>

            <div style={{ display: "flex", gap: 8, background: "white", padding: 8, borderRadius: 16, maxWidth: 560 }} className="elev-3">
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, paddingLeft: 12 }}>
                <Search size={17} color="var(--ink-soft)" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar tecido, malha, fio, máquina…"
                  style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "var(--ink)", background: "transparent", padding: "8px 0" }}
                />
              </div>
              <button
                onClick={() => document.getElementById("anuncios")?.scrollIntoView({ behavior: "smooth" })}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700, background: "var(--navy)", color: "white", border: "none", cursor: "pointer", flexShrink: 0 }}
              >
                <Search size={15} /> Buscar
              </button>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 36px", marginTop: 36 }}>
              <Stat icon={TrendingUp} label="Anúncios ativos" value="8.400+" />
              <Stat icon={MapPin} label="Estados atendidos" value="27 UFs" />
              <Stat icon={ShieldCheck} label="Empresas verificadas" value="100%" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== USER DASHBOARD SHORTCUT (when logged in) ===== */}
      {user && (
        <div style={{ background: "linear-gradient(90deg, #0D1F3C, #162D5A)", borderBottom: "1px solid rgba(200,160,48,0.2)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--gold)" }} className="pulse-dot" />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
                Bem-vindo, <strong style={{ color: "white" }}>{user.companyName}</strong> —
                <span style={{ color: "rgba(255,255,255,0.6)", marginLeft: 4 }}>
                  {user.ads.filter((a) => a.status === "active").length} anúncio(s) ativo(s)
                  {user.ads.filter((a) => a.status === "expired").length > 0 && (
                    <span style={{ color: "#FCA5A5", marginLeft: 6 }}>
                      · {user.ads.filter((a) => a.status === "expired").length} expirado(s)
                    </span>
                  )}
                </span>
              </span>
            </div>
            <button
              onClick={() => setView("dashboard")}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                background: "rgba(200,160,48,0.15)", border: "1px solid rgba(200,160,48,0.35)",
                color: "var(--gold)", cursor: "pointer",
              }}
            >
              <LayoutDashboard size={13} /> Ir para minha área <ChevronRight size={12} />
            </button>
          </div>
        </div>
      )}

      {/* ===== CATEGORIES STRIP ===== */}
      <section id="categorias" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginTop: -32, position: "relative", zIndex: 10 }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => { setCat(c); document.getElementById("anuncios")?.scrollIntoView({ behavior: "smooth" }); }}
              style={{ textAlign: "left", padding: 16, borderRadius: 16, background: "white", border: "1px solid var(--line)", cursor: "pointer", transition: "all .18s" }}
              className="elev-1 card-lift"
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--navy-soft)", color: "var(--navy)", display: "grid", placeItems: "center", marginBottom: 12 }}>
                <CategoryIcon name={c} className="w-5 h-5" />
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "var(--ink)", lineHeight: 1.3 }}>{c}</div>
              <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 3 }}>{CATEGORY_META[c].blurb}</div>
            </button>
          ))}
        </div>
      </section>

      {/* ===== WORLD INDUSTRY SECTION ===== */}
      <section id="china" style={{ margin: "48px auto 0", maxWidth: 1280, padding: "0 24px" }}>
        <div style={{ borderRadius: 24, overflow: "hidden", background: "linear-gradient(135deg, #0A1628 0%, #1a2a50 100%)", border: "1px solid rgba(200,160,48,0.25)", position: "relative" }} className="elev-2">
          <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle at 1px 1px, var(--gold) 1px, transparent 0)", backgroundSize: "24px 24px" }} />
          <div style={{ position: "absolute", top: -60, right: 60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,160,48,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", padding: "40px 40px 32px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
              <div style={{ maxWidth: 520 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, var(--gold), var(--gold-dark))", display: "grid", placeItems: "center" }}>
                    <Globe size={18} color="white" />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: "var(--gold)", textTransform: "uppercase" }}>
                    Indústria Mundial — Conexão Direta B2B
                  </span>
                </div>
                <h2 style={{ fontSize: "clamp(22px, 3.5vw, 34px)", fontWeight: 900, color: "white", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 12 }}>
                  Fornecedores internacionais<br /><span style={{ color: "var(--gold)" }}>conectados diretamente a você</span>
                </h2>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 460 }}>
                  Acesse fabricantes internacionais de tecidos, malhas e maquinário. O portal divulga os contatos — a negociação, logística e condições comerciais são definidas diretamente entre comprador e fornecedor.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
                  {["China · Seda & Malhas", "Índia · Algodão & Renda", "Portugal · Tecidos Técnicos", "Turquia · Malharia"].map((tag) => (
                    <span key={tag} style={{ padding: "6px 12px", borderRadius: 999, background: "rgba(200,160,48,0.12)", border: "1px solid rgba(200,160,48,0.25)", fontSize: 11, fontWeight: 600, color: "rgba(200,160,48,0.9)" }}>{tag}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 200 }}>
                {[
                  { v: "400+", l: "Fábricas cadastradas" },
                  { v: "B2B Direto", l: "Modelo de conexão" },
                  { v: "15+ países", l: "Fornecedores internacionais" },
                ].map(({ v, l }) => (
                  <div key={l} style={{ padding: "14px 18px", borderRadius: 14, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(200,160,48,0.2)" }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: "var(--gold)", lineHeight: 1 }}>{v}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
            {CHINA_PRODUCTS.map((p, i) => <ProductCard key={p.id} product={p} index={i} onSellerClick={goToProfile} />)}
          </div>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "11px 24px", borderRadius: 12, border: "1.5px solid var(--gold)", background: "transparent", color: "var(--gold-dark)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold-soft)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              Ver todos os fornecedores internacionais <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ===== LISTINGS SECTION ===== */}
      <section id="anuncios" style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 900, color: "var(--ink)", letterSpacing: "-0.02em" }}>Anúncios disponíveis</h2>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4 }}>
              {filtered.length} {filtered.length === 1 ? "resultado encontrado" : "resultados encontrados"}
              {cat !== "Todas" && ` em ${cat}`}{uf && ` · ${uf}`}
            </p>
          </div>
          <button onClick={() => setShowFilters((s) => !s)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "1.5px solid var(--line)", background: "white", fontSize: 13, fontWeight: 600, color: "var(--ink)", cursor: "pointer" }}>
            <SlidersHorizontal size={15} />
            {showFilters ? "Fechar filtros" : "Filtros"}
            {activeCount > 0 && (
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: "50%", background: "var(--navy)", color: "white", fontSize: 10, fontWeight: 700 }}>{activeCount}</span>
            )}
          </button>
        </div>

        {showFilters && (
          <div style={{ padding: 20, borderRadius: 16, background: "white", border: "1px solid var(--line)", marginBottom: 24 }} className="elev-1">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Categoria</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  <Chip active={cat === "Todas"} onClick={() => setCat("Todas")}>Todas</Chip>
                  {CATEGORIES.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}
                </div>
              </div>
              <div style={{ minWidth: 160 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Estado</div>
                <div style={{ position: "relative" }}>
                  <MapPin size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--ink-soft)", pointerEvents: "none" }} />
                  <select value={uf} onChange={(e) => setUf(e.target.value)} style={{ width: "100%", appearance: "none", padding: "9px 12px 9px 28px", border: "1.5px solid var(--line)", borderRadius: 10, fontSize: 13, color: "var(--ink)", background: "white", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
                    <option value="">Todos os estados</option>
                    {UFS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            </div>
            {activeCount > 0 && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{activeCount} filtro{activeCount > 1 ? "s" : ""} ativo{activeCount > 1 ? "s" : ""}</span>
                <button onClick={clearAll} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: "var(--gold-dark)", background: "none", border: "none", cursor: "pointer" }}>
                  <X size={12} /> Limpar filtros
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Featured ads from logged-in user ── */}
        {user && (() => {
          const featuredUserAds = user.ads.filter(
            (a) => a.status === "active" && isFeatureActive(a.featuredPlan)
          );
          if (featuredUserAds.length === 0) return null;
          return (
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "10px 16px", borderRadius: 14, background: "linear-gradient(90deg, var(--gold-soft), white)", border: "1.5px solid rgba(200,160,48,0.35)" }}>
                <Star size={16} color="var(--gold-dark)" fill="var(--gold-dark)" />
                <span style={{ fontWeight: 800, fontSize: 14, color: "var(--gold-dark)" }}>Anúncios em Destaque</span>
                <span style={{ padding: "2px 8px", borderRadius: 999, background: "var(--gold)", color: "white", fontSize: 11, fontWeight: 800 }}>{featuredUserAds.length}</span>
                <span style={{ fontSize: 12, color: "var(--ink-soft)", marginLeft: 4 }}>· Posição prioritária no portal</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
                {featuredUserAds.map((ad, i) => {
                  const featLevel: FeaturedLevel = ad.featuredPlan?.plan === "premium" ? "premium" : "destaque";
                  const prod = {
                    id: ad.id,
                    title: ad.title,
                    category: ad.category as any,
                    price: ad.price,
                    unit: ad.unit,
                    minOrder: "sob consulta",
                    seller: user.companyName,
                    city: ad.city,
                    uf: ad.uf,
                    description: `Anúncio em destaque — ${user.companyName}`,
                    origin: "brasil" as const,
                  };
                  return <ProductCard key={ad.id} product={prod} index={i} featured={featLevel} onSellerClick={goToProfile} />;
                })}
              </div>
              <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--line), transparent)", margin: "24px 0 0" }} />
            </div>
          );
        })()}

        {filtered.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} onSellerClick={goToProfile} />)}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--navy-soft)", display: "grid", placeItems: "center", margin: "0 auto 16px", color: "var(--navy)" }}>
              <Search size={28} />
            </div>
            <h3 style={{ fontWeight: 800, fontSize: 18, color: "var(--ink)" }}>Nenhum anúncio encontrado</h3>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 6 }}>Ajuste os filtros ou limpe a busca.</p>
            <button onClick={clearAll} style={{ marginTop: 16, padding: "10px 24px", borderRadius: 10, background: "var(--navy)", color: "white", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>Limpar filtros</button>
          </div>
        )}
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="como-funciona" style={{ background: "white", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 24px" }}>
          <div style={{ textAlign: "center", maxWidth: 580, margin: "0 auto 40px" }}>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 900, color: "var(--ink)", letterSpacing: "-0.02em" }}>Como funciona o Fornecedor Têxtil</h2>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 8, lineHeight: 1.6 }}>Um diretório B2B estruturado para Fábricas, Compradores e Representantes Comerciais. O portal conecta — a negociação fica entre as partes.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
            <Step n="01" icon={Building2} title="Cadastre sua empresa" desc="Fábricas e distribuidoras informam CNPJ e dados. Ambiente 100% B2B verificado e auditado." cta="Cadastrar agora" action={() => setRegOpen(true)} />
            <Step n="02" icon={Package} title="Publique seus produtos" desc="Anuncie tecidos, malhas ou máquinas com fotos e especificações técnicas completas." cta="Anunciar produto" action={() => setAdvOpen(true)} />
            <Step n="03" icon={Truck} title="Conexão direta B2B" desc="Compradores acessam contatos e negociam diretamente. O portal não intermedia preços, prazos ou logística." />
            <Step n="04" icon={Users} title="Representantes Comerciais" desc="Profissionais autônomos podem se cadastrar como Representantes e conectar fábricas a compradores em sua região." cta="Cadastrar como Representante" action={() => setRepOpen(true)} highlight />
          </div>
          {/* Monetization note */}
          <div style={{ padding: "20px 24px", borderRadius: 16, background: "var(--gold-soft)", border: "1.5px solid rgba(200,160,48,0.35)", display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, var(--gold), var(--gold-dark))", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Star size={20} color="white" fill="white" />
            </div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "var(--gold-dark)", marginBottom: 4 }}>Modelo de receita do portal</div>
              <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.65 }}>
                Compradores acessam o portal <strong>gratuitamente</strong>. Fábricas e Representantes Comerciais impulsionam sua visibilidade com <strong>Planos de Destaque</strong> (posição prioritária na listagem) e <strong>taxas de divulgação</strong>. O portal atua exclusivamente como diretório — sem comissão sobre vendas e sem participação nas negociações.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ borderRadius: 24, overflow: "hidden", position: "relative", background: "linear-gradient(135deg, var(--navy) 0%, #0f2d5a 100%)", padding: "48px 40px" }} className="elev-2">
          <div style={{ position: "absolute", top: -80, right: 40, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,160,48,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
            <div style={{ maxWidth: 520 }}>
              <h2 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 900, color: "white", letterSpacing: "-0.02em" }}>Divulgue seus produtos para todo o Brasil e o mundo</h2>
              <p style={{ color: "rgba(255,255,255,0.65)", marginTop: 10, fontSize: 14, lineHeight: 1.6 }}>Fábricas e Representantes: cadastre-se e amplie sua visibilidade com Planos de Destaque. Compradores acessam gratuitamente e negociam direto com você.</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {user ? (
                <button onClick={() => setView("dashboard")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 22px", borderRadius: 12, fontSize: 14, fontWeight: 700, background: "linear-gradient(135deg, var(--gold), var(--gold-dark))", color: "white", border: "none", cursor: "pointer" }}>
                  <LayoutDashboard size={17} /> Minha área
                </button>
              ) : (
                <>
                  <button onClick={() => setLoginOpen(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 22px", borderRadius: 12, fontSize: 14, fontWeight: 700, background: "white", color: "var(--navy)", border: "none", cursor: "pointer" }}>
                    <LogIn size={17} /> Entrar na conta
                  </button>
                  <button onClick={() => setAdvOpen(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 22px", borderRadius: 12, fontSize: 14, fontWeight: 700, background: "linear-gradient(135deg, var(--gold), var(--gold-dark))", color: "white", border: "none", cursor: "pointer" }}>
                    <Plus size={17} /> Anunciar produto
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== REPRESENTANTES ===== */}
      <RepresentativesSection />

      {/* ===== FOOTER ===== */}
      <footer style={{ background: "var(--navy)", color: "rgba(255,255,255,0.6)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, var(--gold), var(--gold-dark))", display: "grid", placeItems: "center" }}>
                  <Factory size={18} color="white" />
                </div>
                <span style={{ fontWeight: 900, fontSize: 16, color: "white" }}>Fornecedor<span style={{ color: "var(--gold)" }}>Têxtil</span></span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7 }}>O maior marketplace B2B de insumos têxteis do Brasil. Conectando confecções e indústrias.</p>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                {[Star, Globe, ShieldCheck].map((Icon, i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.07)", display: "grid", placeItems: "center", cursor: "pointer" }}>
                    <Icon size={15} color="rgba(255,255,255,0.5)" />
                  </div>
                ))}
              </div>
            </div>
            <FooterCol title="Categorias" items={CATEGORIES} />
            <FooterCol title="Portal" items={["Anúncios", "Cadastrar empresa", "Anunciar produto", "Indústria Mundial", "Representantes Comerciais", "Como funciona"]} />
            <FooterCol title="Contato" items={["contato@fornecedortextil.com.br", "São Paulo — Brasil", "Seg-Sex, 9h às 18h"]} />
          </div>
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>
              <strong style={{ color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 4 }}>Isenção de Responsabilidade</strong>
              Este portal atua exclusivamente como diretório de divulgação e não participa das negociações, logística ou prazos entre compradores e fornecedores. Toda tratativa comercial, condições de pagamento, entrega e responsabilidade contratual são definidas diretamente entre as partes. O modelo de receita do portal é baseado em planos de destaque e taxas de divulgação para Fábricas e Representantes Comerciais.
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
              <span>© 2026 Fornecedor Têxtil. Portal B2B Nacional — Diretório de Divulgação.</span>
              <span>Dados fictícios para demonstração de interface.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ===== MODALS ===== */}
      <AdvertiseModal open={advOpen} onClose={() => setAdvOpen(false)} />
      <RegisterModal open={regOpen} onClose={() => setRegOpen(false)} />
      <RepresentativeModal open={repOpen} onClose={() => setRepOpen(false)} />
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={() => setView("dashboard")}
      />

      <style>{`
        @media (max-width: 640px) { .hide-mobile { display: none !important; } }
      `}</style>

      {toast}
    </div>
  );
}

/* ─── Sub-components ─── */

function Stat({ icon: Icon, label, value }: { icon: typeof TrendingUp; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(200,160,48,0.12)", border: "1px solid rgba(200,160,48,0.25)", display: "grid", placeItems: "center" }}>
        <Icon size={16} color="var(--gold)" />
      </div>
      <div>
        <div style={{ fontWeight: 900, fontSize: 18, color: "white", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>{label}</div>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ padding: "7px 14px", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .15s", border: "1.5px solid", borderColor: active ? "var(--navy)" : "var(--line)", background: active ? "var(--navy)" : "white", color: active ? "white" : "var(--ink-soft)" }}>
      {children}
    </button>
  );
}

function Step({ n, icon: Icon, title, desc, action, cta, highlight }: {
  n: string; icon: typeof Building2; title: string; desc: string;
  action?: () => void; cta?: string; highlight?: boolean;
}) {
  return (
    <div style={{
      position: "relative", padding: 24, borderRadius: 18,
      background: highlight ? "var(--gold-soft)" : "var(--canvas)",
      border: `1.5px solid ${highlight ? "rgba(200,160,48,0.4)" : "var(--line)"}`,
    }}>
      {highlight && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--gold), var(--gold-dark))", borderRadius: "18px 18px 0 0" }} />}
      <span style={{ position: "absolute", top: 16, right: 20, fontSize: 36, fontWeight: 900, color: highlight ? "rgba(200,160,48,0.15)" : "rgba(13,31,60,0.06)", lineHeight: 1 }}>{n}</span>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: highlight ? "linear-gradient(135deg, var(--gold), var(--gold-dark))" : "linear-gradient(135deg, var(--navy), var(--navy-mid))", display: "grid", placeItems: "center", marginBottom: 16 }} className="elev-1">
        <Icon size={22} color="white" />
      </div>
      <h3 style={{ fontWeight: 800, fontSize: 16, color: "var(--ink)", marginBottom: 6 }}>{title}</h3>
      <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.6 }}>{desc}</p>
      {action && cta && (
        <button onClick={action} style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 700, color: highlight ? "var(--gold-dark)" : "var(--gold-dark)", background: "none", border: "none", cursor: "pointer" }}>
          {cta} <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

function FooterCol({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div>
      <h4 style={{ fontWeight: 800, fontSize: 13, color: "white", marginBottom: 14 }}>{title}</h4>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item) => (
          <li key={item}>
            <a href="#" style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
            >{item}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Root ─── */
function AppWithNotifications() {
  const { user } = useAuth();
  return (
    <NotificationProvider user={user}>
      <AppInner />
    </NotificationProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <RepresentativesProvider>
        <AppWithNotifications />
      </RepresentativesProvider>
    </AuthProvider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
