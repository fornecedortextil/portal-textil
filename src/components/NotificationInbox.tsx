import React from "react";
import { Mail, RefreshCcw, AlertTriangle, CheckCheck, Clock, Calendar, ChevronRight } from "lucide-react";
import { useNotifications, type EmailNotification } from "../context/NotificationContext";

interface Props {
  onRenew: (adId: string) => void;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function fmtExpiry(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function EmailRow({ notif, onRenew, onMarkRead }: {
  notif: EmailNotification;
  onRenew: (id: string) => void;
  onMarkRead: (id: string) => void;
}) {
  const isExpiring = notif.type === "expiring_soon";
  const accentColor = isExpiring ? "#D97706" : "#DC2626";
  const bgColor = isExpiring ? "#FFFBEB" : "#FEF2F2";
  const borderColor = isExpiring ? "#FDE68A" : "#FECACA";

  return (
    <div
      onClick={() => onMarkRead(notif.id)}
      style={{
        position: "relative",
        padding: "18px 22px",
        borderBottom: "1px solid var(--line)",
        background: notif.read ? "white" : "#FAFBFF",
        cursor: "default",
        transition: "background .15s",
      }}
    >
      {/* Unread dot */}
      {!notif.read && (
        <div style={{
          position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
          width: 6, height: 6, borderRadius: "50%",
          background: isExpiring ? "#F59E0B" : "#EF4444",
        }} />
      )}

      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        {/* Icon */}
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: bgColor, border: `1px solid ${borderColor}`,
          display: "grid", placeItems: "center", marginTop: 2,
        }}>
          {isExpiring ? <AlertTriangle size={17} color={accentColor} /> : <Mail size={17} color={accentColor} />}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Meta */}
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px 10px", marginBottom: 4 }}>
            <span style={{
              fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em",
              padding: "2px 8px", borderRadius: 999,
              background: bgColor, color: accentColor,
              border: `1px solid ${borderColor}`,
            }}>
              {isExpiring ? `Expira em ${notif.daysLeft}d` : "Expirado"}
            </span>
            <span style={{ fontSize: 10, color: "var(--ink-soft)", display: "flex", alignItems: "center", gap: 3 }}>
              <Clock size={10} /> Enviado: {fmtDate(notif.sentAt)}
            </span>
          </div>

          {/* Subject */}
          <div style={{ fontWeight: notif.read ? 600 : 800, fontSize: 14, color: "var(--ink)", marginBottom: 3, lineHeight: 1.3 }}>
            {isExpiring
              ? `⚠️ Anúncio "${notif.adTitle}" expira em ${notif.daysLeft} dia${notif.daysLeft !== 1 ? "s" : ""}`
              : `❌ Anúncio "${notif.adTitle}" foi removido por expiração`}
          </div>

          {/* Email body preview */}
          <div style={{
            padding: "10px 14px", borderRadius: 10, marginTop: 8,
            background: bgColor, border: `1px solid ${borderColor}`,
          }}>
            <div style={{ fontSize: 11, color: "var(--ink-soft)", marginBottom: 6, display: "flex", gap: 16, flexWrap: "wrap" }}>
              <span><strong>De:</strong> noreply@fornecedortextil.com.br</span>
              <span><strong>Categoria:</strong> {notif.adCategory}</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.6 }}>
              {isExpiring ? (
                <>
                  Olá! Seu anúncio na categoria <strong>{notif.adCategory}</strong> está programado para expirar em{" "}
                  <strong>{fmtExpiry(notif.expiresAt)}</strong> ({notif.daysLeft} dia{notif.daysLeft !== 1 ? "s" : ""}).
                  <br />
                  Renove agora para continuar sendo encontrado por compradores em todo o Brasil.
                </>
              ) : (
                <>
                  Seu anúncio na categoria <strong>{notif.adCategory}</strong> foi removido do portal em{" "}
                  <strong>{fmtExpiry(notif.expiresAt)}</strong> após 60 dias de publicação.
                  <br />
                  Renove por mais 60 dias com um clique para voltar a receber contatos.
                </>
              )}
            </div>
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={(e) => { e.stopPropagation(); onRenew(notif.adId); onMarkRead(notif.id); }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                  background: `linear-gradient(135deg, ${accentColor}, ${isExpiring ? "#B45309" : "#B91C1C"})`,
                  color: "white", border: "none", cursor: "pointer",
                }}
              >
                <RefreshCcw size={12} /> Renovar anúncio (+ 60 dias)
              </button>
              <span style={{ fontSize: 11, color: "var(--ink-soft)", display: "flex", alignItems: "center", gap: 4 }}>
                <Calendar size={11} /> Expira: {fmtExpiry(notif.expiresAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotificationInbox({ onRenew }: Props) {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  return (
    <div style={{
      background: "white", borderRadius: 20, border: "1px solid var(--line)", overflow: "hidden",
    }} className="elev-1">
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 22px", borderBottom: "1px solid var(--line)",
        background: notifications.length > 0 && unreadCount > 0
          ? "linear-gradient(90deg, #FFFBEB, white)"
          : "white",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <Mail size={18} color="var(--navy)" />
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: -6, right: -6,
                width: 16, height: 16, borderRadius: "50%",
                background: "#EF4444", color: "white",
                fontSize: 9, fontWeight: 900,
                display: "grid", placeItems: "center",
                border: "2px solid white",
              }}>{unreadCount}</span>
            )}
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 15, color: "var(--ink)" }}>
            Notificações por e-mail
          </h2>
          {unreadCount > 0 && (
            <span style={{
              padding: "2px 10px", borderRadius: 999,
              background: "#FEF3C7", color: "#92400E",
              fontSize: 11, fontWeight: 700, border: "1px solid #FDE68A",
            }}>
              {unreadCount} não lida{unreadCount > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              fontSize: 12, fontWeight: 700, color: "var(--navy)",
              background: "var(--navy-soft)", border: "none",
              padding: "6px 12px", borderRadius: 8, cursor: "pointer",
            }}
          >
            <CheckCheck size={13} /> Marcar todas como lidas
          </button>
        )}
      </div>

      {/* Info banner about email system */}
      <div style={{
        padding: "10px 22px",
        background: "var(--navy-soft)",
        borderBottom: "1px solid var(--line)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <ChevronRight size={13} color="var(--navy)" />
        <span style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.4 }}>
          Alertas automáticos são enviados ao seu e-mail <strong style={{ color: "var(--navy)" }}>{localStorage.getItem("ft_session") ?? ""}</strong> quando um anúncio está a <strong style={{ color: "var(--navy)" }}>7 dias ou menos</strong> do vencimento.
        </span>
      </div>

      {/* Notification list */}
      {notifications.length === 0 ? (
        <div style={{ padding: "48px 24px", textAlign: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--navy-soft)", display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
            <Mail size={22} color="var(--navy)" />
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>Nenhuma notificação</div>
          <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 5 }}>
            Você receberá alertas aqui 7 dias antes de cada anúncio expirar.
          </div>
        </div>
      ) : (
        <div>
          {notifications.map((n) => (
            <EmailRow
              key={n.id}
              notif={n}
              onRenew={onRenew}
              onMarkRead={markRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}
