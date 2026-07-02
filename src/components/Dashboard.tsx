import React, { useState } from "react";
import {
  Eye, MessageCircle, TrendingUp, Package,
  AlertTriangle, CheckCircle2, PauseCircle,
  RefreshCcw, Play, Pause, Plus, LogOut,
  Calendar, Clock, ChevronRight, BarChart2,
  Factory, Bell, Star, Crown, Zap, Building2,
} from "lucide-react";
import { useAuth, isFeatureActive, PLAN_CONFIG, type UserAd, type PlanType } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { NotificationInbox } from "./NotificationInbox";
import { UpgradePlanModal } from "./UpgradePlanModal";

interface Props { onBack: () => void; onNewAd: () => void; onViewProfile: () => void; }
type DashTab = "ads" | "notifications";

function daysUntil(iso: string) { return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000); }
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function PlanBadge({ plan }: { plan: PlanType }) {
  if (plan === "premium") return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 999, background: "#F5F3FF", border: "1px solid #DDD6FE", fontSize: 11, fontWeight: 800, color: "#6D28D9" }}>
      <Crown size={10} /> Premium
    </span>
  );
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 999, background: "var(--gold-soft)", border: "1px solid rgba(200,160,48,0.4)", fontSize: 11, fontWeight: 800, color: "var(--gold-dark)" }}>
      <Star size={10} fill="var(--gold-dark)" /> Destaque
    </span>
  );
}

function ExpirationBar({ publishedAt, expiresAt, status }: { publishedAt: string; expiresAt: string; status: UserAd["status"] }) {
  const total = new Date(expiresAt).getTime() - new Date(publishedAt).getTime();
  const elapsed = Date.now() - new Date(publishedAt).getTime();
  const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
  const days = daysUntil(expiresAt);
  let barColor = "var(--navy)";
  let bgColor = "var(--line)";
  if (status === "expired") { barColor = "#EF4444"; bgColor = "#FEE2E2"; }
  else if (days <= 7) { barColor = "#F59E0B"; bgColor = "#FEF3C7"; }
  else if (status === "paused") barColor = "#94A3B8";
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: "var(--ink-soft)" }}><Calendar size={9} style={{ display: "inline" }} /> {fmtDate(publishedAt)}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: status === "expired" ? "#DC2626" : days <= 7 ? "#D97706" : "var(--ink-soft)" }}>
          <Clock size={9} style={{ display: "inline" }} /> {status === "expired" ? "Expirado" : `Expira ${fmtDate(expiresAt)}`}
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: bgColor, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 999, width: `${pct}%`, background: barColor }}>
          {days <= 7 && status === "active" && (
            <div style={{ float: "right", width: 10, height: 10, marginTop: -2, marginRight: -2, borderRadius: "50%", background: barColor, opacity: 0.6, animation: "pulse-dot 1.5s ease infinite" }} />
          )}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <span style={{ fontSize: 10, color: "var(--ink-soft)" }}>Publicado há {Math.round((Date.now() - new Date(publishedAt).getTime()) / 86400000)}d</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: barColor }}>
          {status === "expired" ? "0 / 60 dias" : `${Math.max(0, 60 - Math.round((Date.now() - new Date(publishedAt).getTime()) / 86400000))} / 60 dias restantes`}
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ status, daysLeft }: { status: UserAd["status"]; daysLeft: number }) {
  if (status === "expired") return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 999, background: "#FEF2F2", border: "1px solid #FECACA", fontSize: 11, fontWeight: 700, color: "#991B1B" }}>
      <AlertTriangle size={11} /> Expirado
    </span>
  );
  if (status === "paused") return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 999, background: "#F8FAFC", border: "1px solid var(--line)", fontSize: 11, fontWeight: 700, color: "#64748B" }}>
      <PauseCircle size={11} /> Pausado
    </span>
  );
  if (daysLeft <= 7) return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 999, background: "#FFFBEB", border: "1px solid #FDE68A", fontSize: 11, fontWeight: 700, color: "#92400E" }}>
      <Clock size={11} /> ⚠️ {daysLeft}d restantes
    </span>
  );
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 999, background: "#F0FDF4", border: "1px solid #BBF7D0", fontSize: 11, fontWeight: 700, color: "#166534" }}>
      <CheckCircle2 size={11} /> Ativo · {daysLeft}d
    </span>
  );
}

export function Dashboard({ onBack, onNewAd, onViewProfile }: Props) {
  const { user, logout, renewAd, pauseAd, resumeAd } = useAuth();
  const { unreadCount } = useNotifications();
  const [confirmRenew, setConfirmRenew] = useState<string | null>(null);
  const [tab, setTab] = useState<DashTab>("ads");
  const [upgradeAd, setUpgradeAd] = useState<UserAd | null>(null);

  if (!user) return null;

  const totalViews = user.ads.reduce((s, a) => s + a.views, 0);
  const totalContacts = user.ads.reduce((s, a) => s + a.contacts, 0);
  const activeAds = user.ads.filter((a) => a.status === "active").length;
  const expiredAds = user.ads.filter((a) => a.status === "expired").length;
  const expiringSoon = user.ads.filter((a) => a.status === "active" && daysUntil(a.expiresAt) <= 7).length;
  const featuredAds = user.ads.filter((a) => isFeatureActive(a.featuredPlan)).length;

  const handleRenew = (id: string) => {
    renewAd(id);
    setConfirmRenew(id);
    setTimeout(() => setConfirmRenew(null), 2500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)" }}>

      {/* Header */}
      <div style={{ background: "var(--navy)", borderBottom: "1px solid rgba(200,160,48,0.2)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                ← Portal
              </button>
              <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, var(--gold), var(--gold-dark))", display: "grid", placeItems: "center" }}>
                  <Factory size={17} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: "white" }}>{user.companyName}</div>
                  <div style={{ fontSize: 11, color: "rgba(200,160,48,0.75)", marginTop: 2 }}>{user.city} · {user.uf} · {user.cnpj}</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={onNewAd} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 9, fontSize: 13, fontWeight: 700, background: "linear-gradient(135deg, var(--gold), var(--gold-dark))", color: "white", border: "none", cursor: "pointer" }}>
                <Plus size={15} /> Novo anúncio
              </button>
              <button onClick={onViewProfile} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 9, fontSize: 13, fontWeight: 600, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.75)", cursor: "pointer" }}>
                <Building2 size={14} /> Ver perfil público
              </button>
              <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 9, fontSize: 13, fontWeight: 600, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.65)", cursor: "pointer" }}>
                <LogOut size={14} /> Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--ink)", letterSpacing: "-0.02em" }}>Painel de controle</h1>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4 }}>Gerencie seus anúncios, planos de destaque e notificações.</p>
        </div>

        {/* Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 12, marginBottom: 28 }}>
          <MetricCard icon={Package} label="Anúncios ativos" value={String(activeAds)} color="var(--navy)" soft="var(--navy-soft)" />
          <MetricCard icon={Star} label="Em destaque" value={String(featuredAds)} color="var(--gold-dark)" soft="var(--gold-soft)" highlight={featuredAds > 0} goldHighlight />
          <MetricCard icon={AlertTriangle} label="Expirados" value={String(expiredAds)} color="#DC2626" soft="#FEF2F2" />
          <MetricCard icon={Clock} label="Expirando em breve" value={String(expiringSoon)} color="#D97706" soft="#FFFBEB" highlight={expiringSoon > 0} />
          <MetricCard icon={Eye} label="Visualizações" value={totalViews.toLocaleString("pt-BR")} color="var(--gold-dark)" soft="var(--gold-soft)" />
          <MetricCard icon={MessageCircle} label="Contatos" value={String(totalContacts)} color="#059669" soft="#F0FDF4" />
          <MetricCard icon={TrendingUp} label="Taxa de contato" value={totalViews > 0 ? `${((totalContacts / totalViews) * 100).toFixed(1)}%` : "—"} color="#7C3AED" soft="#F5F3FF" />
        </div>

        {/* Alert */}
        {(expiredAds > 0 || expiringSoon > 0) && (
          <div style={{ padding: "13px 18px", borderRadius: 14, marginBottom: 20, background: "#FFFBEB", border: "1px solid #FDE68A", display: "flex", alignItems: "flex-start", gap: 10 }}>
            <AlertTriangle size={17} color="#D97706" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#92400E" }}>
                {[expiredAds > 0 && `${expiredAds} expirado${expiredAds > 1 ? "s" : ""}`, expiringSoon > 0 && `${expiringSoon} expirando em breve`].filter(Boolean).join(" · ")}
              </div>
              <div style={{ fontSize: 12, color: "#B45309", marginTop: 2 }}>Renove agora para continuar recebendo contatos.</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "white", padding: 5, borderRadius: 14, border: "1px solid var(--line)", width: "fit-content" }} className="elev-1">
          {([
            { id: "ads", label: "Meus anúncios", icon: BarChart2 },
            { id: "notifications", label: "Notificações", icon: Bell, badge: unreadCount },
          ] as { id: DashTab; label: string; icon: typeof Bell; badge?: number }[]).map(({ id, label, icon: Icon, badge }) => (
            <button key={id} onClick={() => setTab(id)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", background: tab === id ? "var(--navy)" : "transparent", color: tab === id ? "white" : "var(--ink-soft)", transition: "all .18s" }}>
              <Icon size={15} />
              {label}
              {badge ? <span style={{ padding: "1px 6px", borderRadius: 999, background: tab === id ? "rgba(255,255,255,0.25)" : "#EF4444", color: "white", fontSize: 10, fontWeight: 900, minWidth: 18, textAlign: "center" }}>{badge}</span> : null}
            </button>
          ))}
        </div>

        {/* Ads tab */}
        {tab === "ads" && (
          <div style={{ background: "white", borderRadius: 20, border: "1px solid var(--line)", overflow: "hidden" }} className="elev-1">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid var(--line)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <BarChart2 size={17} color="var(--navy)" />
                <h2 style={{ fontWeight: 800, fontSize: 15, color: "var(--ink)" }}>Anúncios publicados</h2>
                <span style={{ padding: "2px 10px", borderRadius: 999, background: "var(--navy-soft)", color: "var(--navy)", fontSize: 12, fontWeight: 700 }}>{user.ads.length}</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-soft)", display: "flex", alignItems: "center", gap: 4 }}>
                <Calendar size={11} /> Validade: 60 dias por publicação
              </div>
            </div>

            {user.ads.length === 0 ? (
              <div style={{ padding: "64px 24px", textAlign: "center" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--navy-soft)", display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
                  <Package size={26} color="var(--navy)" />
                </div>
                <div style={{ fontWeight: 800, fontSize: 16, color: "var(--ink)" }}>Nenhum anúncio publicado</div>
                <button onClick={onNewAd} style={{ marginTop: 16, padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700, background: "var(--navy)", color: "white", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Plus size={15} /> Anunciar produto
                </button>
              </div>
            ) : (
              user.ads.map((ad, idx) => {
                const daysLeft = daysUntil(ad.expiresAt);
                const isExpired = ad.status === "expired";
                const justRenewed = confirmRenew === ad.id;
                const fp = ad.featuredPlan;
                const fpActive = isFeatureActive(fp);
                const fpDaysLeft = fp ? daysUntil(fp.expiresAt) : 0;

                return (
                  <div key={ad.id} style={{
                    padding: "20px 22px",
                    borderBottom: idx < user.ads.length - 1 ? "1px solid var(--line)" : "none",
                    background: fpActive
                      ? fp?.plan === "premium" ? "#FDFBFF" : "#FFFDF5"
                      : isExpired ? "#FFFAF9" : "white",
                    borderLeft: fpActive ? `3px solid ${fp?.plan === "premium" ? "#7C3AED" : "var(--gold)"}` : "none",
                  }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>

                      {/* Left */}
                      <div style={{ flex: 1, minWidth: 240 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                          <span style={{ padding: "2px 8px", borderRadius: 6, background: "var(--navy-soft)", color: "var(--navy)", fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>
                            {ad.category}
                          </span>
                          <StatusBadge status={ad.status} daysLeft={daysLeft} />
                          {fpActive && fp && <PlanBadge plan={fp.plan as PlanType} />}
                          {(daysLeft <= 7 || isExpired) && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 7px", borderRadius: 999, background: "#FFF7ED", border: "1px solid #FED7AA", fontSize: 10, fontWeight: 700, color: "#9A3412" }}>
                              <Bell size={9} /> E-mail enviado
                            </span>
                          )}
                        </div>
                        <h3 style={{ fontWeight: 800, fontSize: 15, color: "var(--ink)", marginBottom: 2, lineHeight: 1.3 }}>{ad.title}</h3>
                        <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{ad.price} · {ad.city}/{ad.uf}</div>
                        <ExpirationBar publishedAt={ad.publishedAt} expiresAt={ad.expiresAt} status={ad.status} />

                        {/* Featured plan status bar */}
                        {fpActive && fp && (
                          <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 10, background: fp.plan === "premium" ? "#F5F3FF" : "var(--gold-soft)", border: `1px solid ${fp.plan === "premium" ? "#DDD6FE" : "rgba(200,160,48,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              {fp.plan === "premium" ? <Crown size={13} color="#6D28D9" /> : <Star size={13} color="var(--gold-dark)" fill="var(--gold-dark)" />}
                              <span style={{ fontSize: 12, fontWeight: 700, color: fp.plan === "premium" ? "#6D28D9" : "var(--gold-dark)" }}>
                                Plano {PLAN_CONFIG[fp.plan as Exclude<PlanType, "basic">]?.label} ativo
                              </span>
                            </div>
                            <span style={{ fontSize: 11, color: "var(--ink-soft)" }}>
                              Expira em {fpDaysLeft}d · {fmtDate(fp.expiresAt)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Middle metrics */}
                      <div style={{ display: "flex", gap: 20, alignItems: "center", flexShrink: 0 }}>
                        <Metric icon={Eye} label="Views" value={ad.views} />
                        <Metric icon={MessageCircle} label="Contatos" value={ad.contacts} />
                        <Metric icon={Calendar} label="Dias restantes" value={isExpired ? "—" : String(Math.max(0, daysLeft))} />
                      </div>

                      {/* Right actions */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 152, flexShrink: 0 }}>
                        {/* Featured plan button */}
                        {!isExpired && (
                          <button
                            onClick={() => setUpgradeAd(ad)}
                            style={{
                              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                              padding: "9px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                              border: `1.5px solid ${fpActive ? (fp?.plan === "premium" ? "#7C3AED" : "var(--gold)") : "var(--line)"}`,
                              background: fpActive
                                ? fp?.plan === "premium" ? "#F5F3FF" : "var(--gold-soft)"
                                : "white",
                              color: fpActive
                                ? fp?.plan === "premium" ? "#6D28D9" : "var(--gold-dark)"
                                : "var(--ink-soft)",
                              cursor: "pointer",
                            }}
                          >
                            {fpActive
                              ? <>{fp?.plan === "premium" ? <Crown size={13} /> : <Star size={13} fill="currentColor" />} Gerenciar plano</>
                              : <><Zap size={13} /> Promover anúncio</>}
                          </button>
                        )}

                        {(isExpired || daysLeft <= 7) && (
                          <button onClick={() => handleRenew(ad.id)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700, background: justRenewed ? "linear-gradient(135deg, #059669, #047857)" : "linear-gradient(135deg, var(--gold), var(--gold-dark))", color: "white", border: "none", cursor: "pointer" }}>
                            {justRenewed ? <><CheckCircle2 size={13} /> Renovado!</> : <><RefreshCcw size={13} /> Renovar (60d)</>}
                          </button>
                        )}

                        {ad.status === "active" && !isExpired && (
                          <button onClick={() => pauseAd(ad.id)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, background: "white", border: "1.5px solid var(--line)", color: "var(--ink-soft)", cursor: "pointer" }}>
                            <Pause size={13} /> Pausar
                          </button>
                        )}
                        {ad.status === "paused" && (
                          <button onClick={() => resumeAd(ad.id)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700, background: "linear-gradient(135deg, var(--navy), var(--navy-mid))", color: "white", border: "none", cursor: "pointer" }}>
                            <Play size={13} /> Reativar
                          </button>
                        )}

                        <a href="#anuncios" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "7px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, background: "transparent", border: "1.5px solid var(--line)", color: "var(--ink-soft)", textDecoration: "none" }}>
                          Ver no portal <ChevronRight size={11} />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Notifications tab */}
        {tab === "notifications" && (
          <NotificationInbox onRenew={(adId) => { handleRenew(adId); setTab("ads"); }} />
        )}

        {/* Policy note */}
        <div style={{ marginTop: 18, padding: "13px 18px", borderRadius: 12, background: "var(--navy-soft)", border: "1px solid var(--line)" }}>
          <div style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--navy)" }}>Políticas:</strong> anúncios têm validade de <strong>60 dias</strong>. Planos Destaque e Premium têm duração de <strong>30 dias</strong> e destacam seu anúncio no topo da listagem com visual diferenciado. Alertas por e-mail são enviados <strong>7 dias antes</strong> do vencimento.
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradePlanModal
        ad={upgradeAd}
        open={upgradeAd !== null}
        onClose={() => setUpgradeAd(null)}
      />
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color, soft, highlight, goldHighlight }: {
  icon: typeof Eye; label: string; value: string; color: string; soft: string; highlight?: boolean; goldHighlight?: boolean;
}) {
  return (
    <div style={{ padding: 16, borderRadius: 16, background: "white", border: `1.5px solid ${highlight && goldHighlight ? "rgba(200,160,48,0.4)" : highlight ? "#FDE68A" : "var(--line)"}`, position: "relative", overflow: "hidden" }} className="elev-1">
      {highlight && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: goldHighlight ? "linear-gradient(90deg, var(--gold), var(--gold-dark))" : "linear-gradient(90deg, #F59E0B, #D97706)" }} />}
      <div style={{ width: 36, height: 36, borderRadius: 10, background: soft, display: "grid", placeItems: "center", marginBottom: 10 }}>
        <Icon size={17} color={color} />
      </div>
      <div style={{ fontSize: 22, fontWeight: 900, color: "var(--ink)", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 5 }}>{label}</div>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Eye; label: string; value: number | string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <Icon size={13} color="var(--ink-soft)" style={{ margin: "0 auto 4px", display: "block" }} />
      <div style={{ fontSize: 18, fontWeight: 900, color: "var(--ink)", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: "var(--ink-soft)", marginTop: 3 }}>{label}</div>
    </div>
  );
}
