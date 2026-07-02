import React, { useState } from "react";
import { X, Building2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth, type RegisterData } from "../context/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Tab = "login" | "register";

const MODAL_STYLE: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 50,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
};

const OVERLAY_STYLE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "rgba(13,31,60,0.65)",
  backdropFilter: "blur(6px)",
};

const CARD_STYLE: React.CSSProperties = {
  position: "relative",
  width: "100%",
  maxWidth: 460,
  background: "white",
  borderRadius: 24,
  overflow: "hidden",
  boxShadow: "0 20px 60px rgba(13,31,60,0.25)",
};

export function LoginModal({ open, onClose, onSuccess }: Props) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState<RegisterData & { confirm: string }>({
    email: "", password: "", confirm: "",
    companyName: "", cnpj: "", city: "", uf: "",
  });

  if (!open) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(loginForm.email, loginForm.password);
    setLoading(false);
    if (res.ok) { onSuccess(); onClose(); }
    else setError(res.error ?? "Erro ao entrar.");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (regForm.password !== regForm.confirm) {
      setError("As senhas não coincidem."); return;
    }
    if (regForm.password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres."); return;
    }
    setLoading(true);
    const { confirm: _, ...data } = regForm;
    const res = await register(data);
    setLoading(false);
    if (res.ok) { onSuccess(); onClose(); }
    else setError(res.error ?? "Erro ao cadastrar.");
  };

  return (
    <div style={MODAL_STYLE}>
      <div style={OVERLAY_STYLE} onClick={onClose} />
      <div style={CARD_STYLE} className="fade-up">

        {/* Navy top bar with tabs */}
        <div style={{ background: "var(--navy)", padding: "24px 28px 0" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: "linear-gradient(135deg, var(--gold), var(--gold-dark))",
                display: "grid", placeItems: "center",
              }}>
                <Building2 size={19} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: 16, color: "white" }}>Área da Empresa</div>
                <div style={{ fontSize: 11, color: "rgba(200,160,48,0.8)", fontWeight: 600 }}>Portal B2B Têxtil</div>
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 8,
              background: "rgba(255,255,255,0.1)", border: "none",
              cursor: "pointer", display: "grid", placeItems: "center",
            }}>
              <X size={16} color="rgba(255,255,255,0.7)" />
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4 }}>
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                style={{
                  flex: 1, padding: "10px 0", fontSize: 13, fontWeight: 700,
                  border: "none", cursor: "pointer", borderRadius: "8px 8px 0 0",
                  background: tab === t ? "white" : "transparent",
                  color: tab === t ? "var(--navy)" : "rgba(255,255,255,0.55)",
                  transition: "all .15s",
                }}
              >
                {t === "login" ? "Entrar" : "Cadastrar empresa"}
              </button>
            ))}
          </div>
        </div>

        {/* Form area */}
        <div style={{ padding: "24px 28px 28px" }}>
          {error && (
            <div style={{
              padding: "10px 14px", borderRadius: 10, marginBottom: 16,
              background: "#FEF2F2", border: "1px solid #FECACA",
              fontSize: 13, color: "#991B1B", fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          {tab === "login" ? (
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="E-mail corporativo">
                <input
                  required type="email" placeholder="contato@empresa.com.br"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                  className="auth-input"
                />
              </Field>
              <Field label="Senha">
                <div style={{ position: "relative" }}>
                  <input
                    required type={showPass ? "text" : "password"} placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                    className="auth-input"
                    style={{ paddingRight: 42 }}
                  />
                  <button type="button" onClick={() => setShowPass((s) => !s)} style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "var(--ink-soft)",
                    display: "grid", placeItems: "center",
                  }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>

              <div style={{ padding: "10px 14px", borderRadius: 10, background: "var(--navy-soft)", border: "1px solid var(--line)", fontSize: 12, color: "var(--ink-soft)" }}>
                <strong style={{ color: "var(--navy)" }}>Conta demo:</strong> demo@fornecedortextil.com.br / demo123
              </div>

              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "13px", borderRadius: 12, fontSize: 14, fontWeight: 700,
                background: "linear-gradient(135deg, var(--navy), var(--navy-mid))",
                color: "white", border: "none", cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                opacity: loading ? 0.75 : 1,
              }}>
                {loading ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Entrando…</> : "Entrar na minha área"}
              </button>

              <p style={{ textAlign: "center", fontSize: 12, color: "var(--ink-soft)" }}>
                Não tem conta?{" "}
                <button type="button" onClick={() => setTab("register")} style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontWeight: 700, color: "var(--gold-dark)", fontSize: 12,
                }}>
                  Cadastre sua empresa
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="Razão Social">
                <input required placeholder="Nome da empresa"
                  value={regForm.companyName}
                  onChange={(e) => setRegForm((p) => ({ ...p, companyName: e.target.value }))}
                  className="auth-input" />
              </Field>
              <Field label="CNPJ">
                <input required placeholder="00.000.000/0001-00" maxLength={18}
                  value={regForm.cnpj}
                  onChange={(e) => setRegForm((p) => ({ ...p, cnpj: e.target.value }))}
                  className="auth-input" />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 72px", gap: 10 }}>
                <Field label="Cidade">
                  <input required placeholder="São Paulo"
                    value={regForm.city}
                    onChange={(e) => setRegForm((p) => ({ ...p, city: e.target.value }))}
                    className="auth-input" />
                </Field>
                <Field label="UF">
                  <input required placeholder="SP" maxLength={2}
                    value={regForm.uf}
                    onChange={(e) => setRegForm((p) => ({ ...p, uf: e.target.value.toUpperCase() }))}
                    className="auth-input" />
                </Field>
              </div>
              <Field label="E-mail corporativo">
                <input required type="email" placeholder="contato@empresa.com.br"
                  value={regForm.email}
                  onChange={(e) => setRegForm((p) => ({ ...p, email: e.target.value }))}
                  className="auth-input" />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Senha">
                  <input required type="password" placeholder="••••••" minLength={6}
                    value={regForm.password}
                    onChange={(e) => setRegForm((p) => ({ ...p, password: e.target.value }))}
                    className="auth-input" />
                </Field>
                <Field label="Confirmar senha">
                  <input required type="password" placeholder="••••••"
                    value={regForm.confirm}
                    onChange={(e) => setRegForm((p) => ({ ...p, confirm: e.target.value }))}
                    className="auth-input" />
                </Field>
              </div>

              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "13px", borderRadius: 12, fontSize: 14, fontWeight: 700,
                background: "linear-gradient(135deg, var(--gold), var(--gold-dark))",
                color: "white", border: "none", cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                marginTop: 4, opacity: loading ? 0.75 : 1,
              }}>
                {loading ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Cadastrando…</> : "Criar conta gratuita"}
              </button>
            </form>
          )}
        </div>
      </div>
      <style>{`
        .auth-input {
          width: 100%; padding: 10px 13px;
          border: 1.5px solid var(--line); border-radius: 10px;
          font-size: 14px; color: var(--ink); background: white;
          outline: none; transition: border-color .15s; font-family: inherit;
        }
        .auth-input:focus { border-color: var(--navy); }
        .auth-input::placeholder { color: var(--ink-soft); }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--ink)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
