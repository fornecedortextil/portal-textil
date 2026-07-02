import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, MapPin, ShieldCheck, CheckCircle2,
  Briefcase, FileText, Users, MessageCircle,
  Loader2, Send, X, Star,
} from "lucide-react";
import { type RepresentativeApplication } from "../context/RepresentativesContext";

interface Props {
  rep: RepresentativeApplication;
  onBack: () => void;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

interface ContactForm { nome: string; email: string; mensagem: string; }
const EMPTY: ContactForm = { nome: "", email: "", mensagem: "" };

const field: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", padding: "10px 13px",
  border: "1.5px solid var(--line)", borderRadius: 9,
  fontSize: 13, color: "var(--ink)", background: "white",
  outline: "none", transition: "border-color .15s", fontFamily: "inherit",
};

export function RepresentativeProfile({ rep, onBack }: Props) {
  const initials = rep.nome.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const tags = rep.especialidades.split(/[,—–\n]/).map((t) => t.trim()).filter(Boolean);
  const refs = rep.referencias.split(/\n/).map((r) => r.trim()).filter(Boolean);

  const [form, setForm] = useState<ContactForm>(EMPTY);
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  useEffect(() => {
    if (sent) {
      timerRef.current = setTimeout(() => { setSent(false); setForm(EMPTY); }, 5000);
    }
  }, [sent]);

  const set = (f: keyof ContactForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((v) => ({ ...v, [f]: e.target.value }));

  const validate = () => {
    const errs: Partial<ContactForm> = {};
    if (!form.nome.trim()) errs.nome = "Informe seu nome";
    if (!form.email.trim() || !form.email.includes("@")) errs.email = "E-mail inválido";
    if (form.mensagem.trim().length < 20) errs.mensagem = "Mínimo 20 caracteres";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSend = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1300));
    /* Data is discarded — never stored or exposed publicly */
    setLoading(false);
    setSent(true);
    setErrors({});
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)" }}>

      {/* ── Nav bar ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--navy)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={onBack}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8, padding: "6px 12px", fontSize: 13, fontWeight: 600,
              color: "rgba(255,255,255,0.75)", cursor: "pointer",
            }}
          >
            <ArrowLeft size={14} /> Voltar
          </button>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.12)" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.55)" }}>
            Representantes Comerciais
          </span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>›</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {rep.nome}
          </span>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 24px 64px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: 24, alignItems: "start" }}>

          {/* ── LEFT column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Hero card */}
            <div style={{ background: "white", borderRadius: 16, border: "1.5px solid var(--line)", padding: "28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16, flexShrink: 0,
                background: "linear-gradient(135deg, var(--navy), var(--navy-mid))",
                display: "grid", placeItems: "center",
              }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: "var(--gold)" }}>{initials}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                  <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "var(--navy)", lineHeight: 1.2 }}>
                    {rep.nome}
                  </h1>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "3px 9px", borderRadius: 6,
                    background: "#ECFDF5", border: "1px solid #A7F3D0", flexShrink: 0,
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#059669", letterSpacing: "0.05em" }}>APROVADO</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <MapPin size={13} color="var(--ink-soft)" />
                  <span style={{ fontSize: 14, color: "var(--ink-soft)" }}>{rep.cidade}, {rep.uf}</span>
                </div>
                {rep.reviewedAt && (
                  <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--ink-soft)" }}>
                    Aprovado em {fmtDate(rep.reviewedAt)}
                  </p>
                )}
              </div>
            </div>

            {/* Trust bar */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {[
                { icon: ShieldCheck, label: "Verificado", sub: "Pela equipe FT" },
                { icon: Star, label: "Perfil Público", sub: "Visível no portal" },
                { icon: Users, label: "Rede B2B", sub: "Fornecedor Têxtil" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} style={{ background: "white", borderRadius: 12, border: "1.5px solid var(--line)", padding: "14px 12px", textAlign: "center" }}>
                  <Icon size={18} color="var(--gold-dark)" style={{ marginBottom: 6 }} />
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: "var(--navy)" }}>{label}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--ink-soft)" }}>{sub}</p>
                </div>
              ))}
            </div>

            {/* Especialidades */}
            <div style={{ background: "white", borderRadius: 16, border: "1.5px solid var(--line)", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Briefcase size={16} color="var(--gold-dark)" />
                <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "var(--navy)" }}>Especialidades</h2>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {tags.map((tag, i) => (
                  <span key={i} style={{
                    fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 8,
                    background: "var(--gold-soft)", color: "var(--gold-dark)",
                    border: "1px solid rgba(200,160,48,0.3)",
                  }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Histórico */}
            <div style={{ background: "white", borderRadius: 16, border: "1.5px solid var(--line)", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <FileText size={16} color="var(--gold-dark)" />
                <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "var(--navy)" }}>Histórico Profissional</h2>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
                {rep.historico}
              </p>
            </div>

            {/* Referências */}
            {refs.length > 0 && (
              <div style={{ background: "white", borderRadius: 16, border: "1.5px solid var(--line)", padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <CheckCircle2 size={16} color="var(--gold-dark)" />
                  <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "var(--navy)" }}>Referências</h2>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {refs.map((ref, i) => (
                    <div key={i} style={{
                      padding: "12px 14px", borderRadius: 10,
                      background: "var(--canvas)", border: "1px solid var(--line)",
                      fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.6,
                    }}>
                      {ref}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT column — Contact form ── */}
          <div style={{ position: "sticky", top: 72 }}>
            <div style={{ background: "white", borderRadius: 16, border: "1.5px solid var(--line)", overflow: "hidden" }}>
              {/* Form header */}
              <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--line)", background: "var(--navy)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <MessageCircle size={16} color="var(--gold)" />
                  <span style={{ fontSize: 14, fontWeight: 800, color: "white" }}>Enviar mensagem</span>
                </div>
                <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
                  Fale diretamente com {rep.nome.split(" ")[0]}
                </p>
              </div>

              <div style={{ padding: "20px" }}>
                {sent ? (
                  /* Success */
                  <div style={{ textAlign: "center", padding: "16px 0" }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: "50%", margin: "0 auto 14px",
                      background: "#ECFDF5", border: "2px solid #A7F3D0",
                      display: "grid", placeItems: "center",
                    }}>
                      <CheckCircle2 size={26} color="#10B981" />
                    </div>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: "var(--navy)" }}>
                      Mensagem enviada!
                    </p>
                    <p style={{ margin: "8px 0 16px", fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.6 }}>
                      Sua mensagem foi encaminhada ao representante. Aguarde o retorno em até 2 dias úteis.
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm(EMPTY); }}
                      style={{
                        fontSize: 12, fontWeight: 600, color: "var(--ink-soft)",
                        background: "none", border: "none", cursor: "pointer", textDecoration: "underline",
                      }}
                    >
                      Enviar outra mensagem
                    </button>
                  </div>
                ) : (
                  /* Form */
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* Nome */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)" }}>Seu nome</label>
                      <input
                        type="text" placeholder="Nome completo" value={form.nome} onChange={set("nome")}
                        style={{ ...field, borderColor: errors.nome ? "#EF4444" : "var(--line)" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = errors.nome ? "#EF4444" : "var(--line)"; }}
                      />
                      {errors.nome && <span style={{ fontSize: 11, color: "#EF4444" }}>{errors.nome}</span>}
                    </div>

                    {/* Email */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)" }}>Seu e-mail</label>
                      <input
                        type="email" placeholder="seu@email.com.br" value={form.email} onChange={set("email")}
                        style={{ ...field, borderColor: errors.email ? "#EF4444" : "var(--line)" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = errors.email ? "#EF4444" : "var(--line)"; }}
                      />
                      {errors.email && <span style={{ fontSize: 11, color: "#EF4444" }}>{errors.email}</span>}
                    </div>

                    {/* Mensagem */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)" }}>Mensagem</label>
                      <textarea
                        placeholder="Descreva sua necessidade…" value={form.mensagem} onChange={set("mensagem")}
                        rows={4}
                        style={{ ...field, resize: "vertical", minHeight: 88, lineHeight: 1.6, borderColor: errors.mensagem ? "#EF4444" : "var(--line)" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = errors.mensagem ? "#EF4444" : "var(--line)"; }}
                      />
                      {errors.mensagem && <span style={{ fontSize: 11, color: "#EF4444" }}>{errors.mensagem}</span>}
                    </div>

                    {/* Privacy */}
                    <p style={{ margin: 0, fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.5 }}>
                      🔒 Seus dados são enviados de forma privada e não são exibidos publicamente.
                    </p>

                    {/* Submit */}
                    <button
                      onClick={handleSend}
                      disabled={loading}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        padding: "12px", borderRadius: 10, fontSize: 13, fontWeight: 800,
                        color: "white", background: loading ? "var(--ink-soft)" : "var(--navy)",
                        border: "none", cursor: loading ? "not-allowed" : "pointer",
                        transition: "background .15s",
                      }}
                    >
                      {loading
                        ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Enviando…</>
                        : <><Send size={14} /> Enviar mensagem</>}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom note */}
            <p style={{ margin: "12px 0 0", fontSize: 11, color: "var(--ink-soft)", textAlign: "center", lineHeight: 1.5 }}>
              Representante verificado pelo portal<br />
              <strong>Fornecedor Têxtil</strong>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
