import React, { useState } from "react";
import {
  X, Star, Zap, CheckCircle2, Loader2, Crown,
  TrendingUp, Calendar, ShieldCheck,
} from "lucide-react";
import { useAuth, PLAN_CONFIG, isFeatureActive, type UserAd, type PlanType } from "../context/AuthContext";

interface Props {
  ad: UserAd | null;
  open: boolean;
  onClose: () => void;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

const PLAN_ICONS: Record<Exclude<PlanType, "basic">, typeof Star> = {
  destaque: Star,
  premium: Crown,
};

export function UpgradePlanModal({ ad, open, onClose }: Props) {
  const { upgradePlan, cancelPlan } = useAuth();
  const [selected, setSelected] = useState<Exclude<PlanType, "basic">>("destaque");
  const [step, setStep] = useState<"select" | "confirm" | "success">("select");
  const [loading, setLoading] = useState(false);

  if (!open || !ad) return null;

  const currentPlan = ad.featuredPlan;
  const hasActivePlan = isFeatureActive(currentPlan);

  const handlePurchase = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    upgradePlan(ad.id, selected);
    setLoading(false);
    setStep("success");
  };

  const handleCancel = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    cancelPlan(ad.id);
    setLoading(false);
    onClose();
    setStep("select");
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setStep("select"), 300);
  };

  const cfg = PLAN_CONFIG[selected];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(13,31,60,0.7)", backdropFilter: "blur(6px)" }} onClick={handleClose} />

      <div style={{
        position: "relative", width: "100%", maxWidth: step === "select" ? 600 : 440,
        background: "white", borderRadius: 24, overflow: "hidden",
        boxShadow: "0 24px 80px rgba(13,31,60,0.3)",
      }} className="fade-up">

        {/* ── Header ── */}
        <div style={{ background: "linear-gradient(135deg, var(--navy) 0%, #1a2f6e 100%)", padding: "22px 26px 18px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -20, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,160,48,0.2) 0%, transparent 70%)" }} />
          <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Star size={16} color="var(--gold)" fill="var(--gold)" />
                <span style={{ fontSize: 11, fontWeight: 800, color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Promover anúncio
                </span>
              </div>
              <h2 style={{ fontWeight: 900, fontSize: 18, color: "white", lineHeight: 1.2, maxWidth: 340 }}>
                {ad.title}
              </h2>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>
                {ad.category} · {ad.city}/{ad.uf}
              </div>
            </div>
            <button onClick={handleClose} style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <X size={15} color="rgba(255,255,255,0.7)" />
            </button>
          </div>

          {hasActivePlan && currentPlan && (
            <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 10, background: "rgba(200,160,48,0.15)", border: "1px solid rgba(200,160,48,0.3)", display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 size={14} color="var(--gold)" />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
                Plano <strong style={{ color: "var(--gold)" }}>{PLAN_CONFIG[currentPlan.plan as Exclude<PlanType, "basic">]?.label}</strong> ativo até {fmtDate(currentPlan.expiresAt)}
              </span>
            </div>
          )}
        </div>

        {/* ── Success state ── */}
        {step === "success" && (
          <div style={{ padding: "40px 32px", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, var(--gold), var(--gold-dark))", display: "grid", placeItems: "center", margin: "0 auto 18px", boxShadow: "0 8px 24px rgba(200,160,48,0.35)" }}>
              <Star size={32} color="white" fill="white" />
            </div>
            <h3 style={{ fontWeight: 900, fontSize: 22, color: "var(--ink)", marginBottom: 8 }}>Plano ativado!</h3>
            <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6, maxWidth: 300, margin: "0 auto 24px" }}>
              Seu anúncio agora aparece em destaque no portal por 30 dias. Aproveite o aumento de visibilidade!
            </p>
            <div style={{ padding: "14px 16px", borderRadius: 12, background: "var(--gold-soft)", border: "1px solid rgba(200,160,48,0.3)", marginBottom: 24, textAlign: "left" }}>
              <div style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 4 }}>Período de destaque</div>
              <div style={{ fontWeight: 800, fontSize: 14, color: "var(--gold-dark)" }}>
                {fmtDate(new Date().toISOString())} → {fmtDate(new Date(Date.now() + 30 * 86400000).toISOString())}
              </div>
            </div>
            <button onClick={handleClose} style={{ width: "100%", padding: "13px", borderRadius: 12, fontSize: 14, fontWeight: 700, background: "linear-gradient(135deg, var(--navy), var(--navy-mid))", color: "white", border: "none", cursor: "pointer" }}>
              Ver no painel
            </button>
          </div>
        )}

        {/* ── Plan selection ── */}
        {step === "select" && (
          <div style={{ padding: "22px 26px 26px" }}>
            {hasActivePlan ? (
              <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 18, lineHeight: 1.5 }}>
                Você já possui um plano ativo. Faça upgrade ou cancele abaixo.
              </p>
            ) : (
              <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 18, lineHeight: 1.5 }}>
                Escolha o plano para destacar seu anúncio na listagem principal do portal.
              </p>
            )}

            {/* Plan cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {(["destaque", "premium"] as const).map((plan) => {
                const c = PLAN_CONFIG[plan];
                const Icon = PLAN_ICONS[plan];
                const isSelected = selected === plan;
                const isCurrentPlan = currentPlan?.plan === plan && hasActivePlan;

                return (
                  <button
                    key={plan}
                    onClick={() => setSelected(plan)}
                    style={{
                      textAlign: "left", padding: "16px", borderRadius: 16, cursor: "pointer",
                      border: `2px solid ${isSelected ? c.color : "var(--line)"}`,
                      background: isSelected ? (plan === "destaque" ? "var(--gold-soft)" : "#F5F3FF") : "white",
                      transition: "all .18s", position: "relative", overflow: "hidden",
                    }}
                  >
                    {isCurrentPlan && (
                      <div style={{ position: "absolute", top: 8, right: 8, padding: "2px 7px", borderRadius: 999, background: c.color, color: "white", fontSize: 9, fontWeight: 800 }}>
                        ATUAL
                      </div>
                    )}
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: isSelected ? c.color : "var(--line)", display: "grid", placeItems: "center", marginBottom: 10, transition: "background .18s" }}>
                      <Icon size={18} color={isSelected ? "white" : "#94A3B8"} fill={isSelected && plan === "destaque" ? "white" : "none"} />
                    </div>
                    <div style={{ fontWeight: 900, fontSize: 15, color: "var(--ink)", marginBottom: 2 }}>{c.label}</div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: c.color, marginBottom: 8 }}>
                      {c.price}<span style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-soft)" }}>/mês</span>
                    </div>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
                      {c.benefits.map((b) => (
                        <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 5, fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.3 }}>
                          <CheckCircle2 size={11} color={c.color} style={{ flexShrink: 0, marginTop: 1 }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            {/* Info row */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
              {[
                { icon: Calendar, text: "30 dias de vigência" },
                { icon: TrendingUp, text: "Renovação automática" },
                { icon: ShieldCheck, text: "Cancele quando quiser" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--ink-soft)" }}>
                  <Icon size={12} color="var(--navy)" /> {text}
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => setStep("confirm")}
              style={{
                width: "100%", padding: "13px", borderRadius: 12, fontSize: 14, fontWeight: 700,
                background: `linear-gradient(135deg, ${cfg.color}, ${selected === "destaque" ? "var(--gold-dark)" : "#6D28D9"})`,
                color: "white", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              <Zap size={16} /> Assinar plano {cfg.label} por {cfg.price}/mês
            </button>

            {hasActivePlan && (
              <button
                onClick={handleCancel}
                disabled={loading}
                style={{ width: "100%", marginTop: 10, padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 600, background: "white", border: "1.5px solid #FECACA", color: "#DC2626", cursor: "pointer" }}
              >
                {loading ? "Cancelando…" : "Cancelar plano atual"}
              </button>
            )}
          </div>
        )}

        {/* ── Confirm payment ── */}
        {step === "confirm" && (
          <div style={{ padding: "26px" }}>
            <h3 style={{ fontWeight: 900, fontSize: 16, color: "var(--ink)", marginBottom: 16 }}>
              Confirmar assinatura
            </h3>

            {/* Order summary */}
            <div style={{ padding: "16px", borderRadius: 14, background: "var(--canvas)", border: "1px solid var(--line)", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>Plano</span>
                <span style={{ fontWeight: 700, fontSize: 13, color: "var(--ink)" }}>
                  Plano {cfg.label}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>Duração</span>
                <span style={{ fontWeight: 700, fontSize: 13, color: "var(--ink)" }}>30 dias</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>Anúncio</span>
                <span style={{ fontWeight: 700, fontSize: 13, color: "var(--ink)", maxWidth: 200, textAlign: "right", lineHeight: 1.3 }}>{ad.title}</span>
              </div>
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 800, fontSize: 14, color: "var(--ink)" }}>Total</span>
                <span style={{ fontWeight: 900, fontSize: 20, color: cfg.color }}>{cfg.price}</span>
              </div>
            </div>

            {/* Simulated payment note */}
            <div style={{ padding: "10px 14px", borderRadius: 10, background: "#F0FDF4", border: "1px solid #BBF7D0", marginBottom: 20, fontSize: 12, color: "#166534", display: "flex", alignItems: "flex-start", gap: 7 }}>
              <ShieldCheck size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>Ambiente de demonstração — nenhum valor real será cobrado. Em produção, integra-se com Stripe ou PagSeguro.</span>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep("select")} style={{ flex: 1, padding: "11px", borderRadius: 10, fontSize: 13, fontWeight: 600, background: "white", border: "1.5px solid var(--line)", color: "var(--ink-soft)", cursor: "pointer" }}>
                Voltar
              </button>
              <button
                onClick={handlePurchase}
                disabled={loading}
                style={{
                  flex: 2, padding: "11px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                  background: `linear-gradient(135deg, ${cfg.color}, ${selected === "destaque" ? "var(--gold-dark)" : "#6D28D9"})`,
                  color: "white", border: "none", cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  opacity: loading ? 0.8 : 1,
                }}
              >
                {loading
                  ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Processando…</>
                  : <><CheckCircle2 size={15} /> Confirmar assinatura</>}
              </button>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
      </div>
    </div>
  );
}
