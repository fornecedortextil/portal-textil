import React, { useEffect } from "react";
import { Mail, X, RefreshCcw, AlertTriangle } from "lucide-react";
import type { EmailNotification } from "../context/NotificationContext";

interface Props {
  notification: EmailNotification | null;
  onDismiss: () => void;
  onGoToDashboard: () => void;
}

export function NotificationToast({ notification, onDismiss, onGoToDashboard }: Props) {
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(onDismiss, 7000);
    return () => clearTimeout(t);
  }, [notification, onDismiss]);

  if (!notification) return null;

  const isExpiring = notification.type === "expiring_soon";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        width: 360,
        background: "white",
        borderRadius: 16,
        border: "1px solid var(--line)",
        boxShadow: "0 20px 50px rgba(13,31,60,0.18), 0 4px 12px rgba(13,31,60,0.1)",
        overflow: "hidden",
        animation: "slideInRight .35s cubic-bezier(0.34,1.56,0.64,1) both",
      }}
    >
      {/* Top accent */}
      <div style={{
        height: 3,
        background: isExpiring
          ? "linear-gradient(90deg, #F59E0B, #D97706)"
          : "linear-gradient(90deg, #EF4444, #DC2626)",
      }} />

      <div style={{ padding: "14px 16px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: isExpiring ? "#FFFBEB" : "#FEF2F2",
              display: "grid", placeItems: "center", flexShrink: 0,
            }}>
              {isExpiring
                ? <AlertTriangle size={15} color="#D97706" />
                : <Mail size={15} color="#DC2626" />}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Fornecedor Têxtil · E-mail automático
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)", marginTop: 1 }}>
                {isExpiring ? `Anúncio expira em ${notification.daysLeft} dias` : "Anúncio expirado"}
              </div>
            </div>
          </div>
          <button onClick={onDismiss} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-soft)", display: "grid", placeItems: "center", flexShrink: 0 }}>
            <X size={15} />
          </button>
        </div>

        {/* Email preview */}
        <div style={{
          padding: "10px 12px", borderRadius: 10,
          background: isExpiring ? "#FFFBEB" : "#FFF5F5",
          border: `1px solid ${isExpiring ? "#FDE68A" : "#FECACA"}`,
          marginBottom: 10,
        }}>
          <div style={{ fontSize: 11, color: "var(--ink-soft)", marginBottom: 4 }}>
            <strong>Para:</strong> {localStorage.getItem("ft_session") ?? "empresa@email.com"}
          </div>
          <div style={{ fontSize: 11, color: "var(--ink-soft)", marginBottom: 6 }}>
            <strong>Assunto:</strong>{" "}
            {isExpiring
              ? `⚠️ Seu anúncio "${notification.adTitle.slice(0, 30)}..." expira em ${notification.daysLeft} dias`
              : `❌ Anúncio expirado: "${notification.adTitle.slice(0, 30)}..."`}
          </div>
          <div style={{ fontSize: 12, color: "var(--ink)", lineHeight: 1.5 }}>
            {isExpiring
              ? `Seu anúncio na categoria ${notification.adCategory} está próximo do vencimento. Renove agora para continuar recebendo contatos.`
              : `Seu anúncio foi removido do portal por expiração. Acesse o painel para renovar por mais 60 dias.`}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => { onGoToDashboard(); onDismiss(); }}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "9px 12px", borderRadius: 9, fontSize: 12, fontWeight: 700,
              background: "linear-gradient(135deg, var(--gold), var(--gold-dark))",
              color: "white", border: "none", cursor: "pointer",
            }}
          >
            <RefreshCcw size={12} /> Renovar agora
          </button>
          <button
            onClick={onDismiss}
            style={{
              padding: "9px 12px", borderRadius: 9, fontSize: 12, fontWeight: 600,
              background: "white", border: "1.5px solid var(--line)",
              color: "var(--ink-soft)", cursor: "pointer",
            }}
          >
            Fechar
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(24px) scale(0.96); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
