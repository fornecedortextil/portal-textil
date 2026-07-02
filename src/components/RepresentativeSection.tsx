import React, { useMemo, useState, useEffect, useRef } from "react";
import { Users, MapPin, Search, Star, ChevronRight, MessageCircle, X, CheckCircle2, Loader2, Send } from "lucide-react";
import { useRepresentatives } from "../context/RepresentativesContext";

const UF_LABELS: Record<string, string> = {
  AC: "Acre", AL: "Alagoas", AM: "Amazonas", AP: "Amapá", BA: "Bahia",
  CE: "Ceará", DF: "Distrito Federal", ES: "Espírito Santo", GO: "Goiás",
  MA: "Maranhão", MG: "Minas Gerais", MS: "Mato Grosso do Sul", MT: "Mato Grosso",
  PA: "Pará", PB: "Paraíba", PE: "Pernambuco", PI: "Piauí", PR: "Paraná",
  RJ: "Rio de Janeiro", RN: "Rio G. do Norte", RO: "Rondônia", RR: "Roraima",
  RS: "Rio G. do Sul", SC: "Santa Catarina", SE: "Sergipe", SP: "São Paulo", TO: "Tocantins",
};

const inputBase: React.CSSProperties = {
  height: 42, border: "1.5px solid var(--line)", borderRadius: 10,
  fontSize: 13, color: "var(--ink)", background: "white",
  outline: "none", transition: "border-color .15s",
};

export function RepresentativesSection() {
  const { applications } = useRepresentatives();
  const [uf, setUf] = useState("");
  const [espec, setEspec] = useState("");

  const approved = useMemo(
    () => applications.filter((a) => a.status === "aprovado" && a.perfilPublico),
    [applications],
  );

  const availableUfs = useMemo(
    () => Array.from(new Set(approved.map((a) => a.uf))).sort(),
    [approved],
  );

  const filtered = useMemo(() => {
    return approved.filter((a) => {
      const matchUf = !uf || a.uf === uf;
      const matchEsp = !espec || a.especialidades.toLowerCase().includes(espec.toLowerCase());
      return matchUf && matchEsp;
    });
  }, [approved, uf, espec]);

  if (approved.length === 0) return null;

  const hasFilters = uf !== "" || espec !== "";

  return (
    <section
      id="representantes"
      style={{ background: "var(--gold-soft)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 24px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 36 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg, var(--gold), var(--gold-dark))",
                display: "grid", placeItems: "center",
              }}>
                <Users size={16} color="white" />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold-dark)" }}>
                Rede Verificada
              </span>
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: "var(--navy)", margin: 0, lineHeight: 1.2 }}>
              Representantes Comerciais
            </h2>
            <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: "8px 0 0", lineHeight: 1.6 }}>
              Profissionais aprovados pela equipe FornecedorTêxtil. Filtre por especialidade ou estado.
            </p>
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px",
            borderRadius: 20, background: "white", border: "1px solid var(--line)",
            fontSize: 12, fontWeight: 700, color: "var(--ink-soft)",
          }}>
            <Star size={12} fill="var(--gold)" color="var(--gold)" />
            {approved.length} aprovados
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32, alignItems: "center" }}>
          {/* Specialty search */}
          <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180 }}>
            <Search size={14} color="var(--ink-soft)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              type="text"
              placeholder="Filtrar por especialidade…"
              value={espec}
              onChange={(e) => setEspec(e.target.value)}
              style={{ ...inputBase, width: "100%", paddingLeft: 36, paddingRight: 12, boxSizing: "border-box" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--line)"; }}
            />
          </div>

          {/* UF select */}
          <select
            value={uf}
            onChange={(e) => setUf(e.target.value)}
            style={{ ...inputBase, flex: "0 0 auto", minWidth: 160, padding: "0 12px", cursor: "pointer" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--line)"; }}
          >
            <option value="">Todos os estados</option>
            {availableUfs.map((u) => (
              <option key={u} value={u}>{UF_LABELS[u] ?? u} ({u})</option>
            ))}
          </select>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={() => { setUf(""); setEspec(""); }}
              style={{
                height: 42, padding: "0 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                color: "var(--ink-soft)", background: "white", border: "1.5px solid var(--line)",
                cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              Limpar filtros
            </button>
          )}

          {/* Count badge */}
          <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--ink-soft)", whiteSpace: "nowrap" }}>
            {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}
          </span>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {filtered.map((rep) => (
              <RepCard key={rep.id} rep={rep} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center", padding: "48px 24px",
            background: "white", borderRadius: 16, border: "1.5px dashed var(--line)",
          }}>
            <Users size={28} color="var(--line)" style={{ marginBottom: 12 }} />
            <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: 0 }}>
              Nenhum representante encontrado para os filtros selecionados.
            </p>
            <button
              onClick={() => { setUf(""); setEspec(""); }}
              style={{
                marginTop: 14, fontSize: 13, fontWeight: 600, color: "var(--gold-dark)",
                background: "none", border: "none", cursor: "pointer", textDecoration: "underline",
              }}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Types ─── */
interface ContactForm { nome: string; email: string; mensagem: string; }
const EMPTY_FORM: ContactForm = { nome: "", email: "", mensagem: "" };

const fieldStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  border: "1.5px solid var(--line)", borderRadius: 8,
  fontSize: 12, color: "var(--ink)", background: "white",
  outline: "none", transition: "border-color .15s", fontFamily: "inherit",
};

/* ─── Rep Card ─── */
function RepCard({ rep }: { rep: ReturnType<typeof useRepresentatives>["applications"][number] }) {
  const initials = rep.nome.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const excerpt = rep.historico.length > 120 ? rep.historico.slice(0, 120).trimEnd() + "…" : rep.historico;
  const tags = rep.especialidades.split(/[,—–\n]/).map((t) => t.trim()).filter(Boolean).slice(0, 3);

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<ContactForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Auto-close success state after 4s */
  useEffect(() => {
    if (sent) {
      timerRef.current = setTimeout(() => {
        setSent(false);
        setFormOpen(false);
        setForm(EMPTY_FORM);
      }, 4000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [sent]);

  const set = (field: keyof ContactForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = (): boolean => {
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
    /* Simulated send — data is discarded and never stored or exposed */
    await new Promise((r) => setTimeout(r, 1300));
    setLoading(false);
    setSent(true);
    setErrors({});
  };

  const closeForm = () => {
    setFormOpen(false);
    setSent(false);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  return (
    <div style={{
      background: "white", borderRadius: 14,
      border: `1.5px solid ${formOpen ? "var(--gold)" : "var(--line)"}`,
      display: "flex", flexDirection: "column",
      transition: "box-shadow .15s, border-color .15s",
      overflow: "hidden",
    }}
      onMouseEnter={(e) => { if (!formOpen) { e.currentTarget.style.boxShadow = "0 4px 20px rgba(13,31,60,0.08)"; e.currentTarget.style.borderColor = "var(--gold)"; } }}
      onMouseLeave={(e) => { if (!formOpen) { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "var(--line)"; } }}
    >
      {/* ── Card body ── */}
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Top row */}
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: "linear-gradient(135deg, var(--navy), var(--navy-mid))",
            display: "grid", placeItems: "center",
          }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: "var(--gold)" }}>{initials}</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 14, color: "var(--navy)", lineHeight: 1.3 }}>
              {rep.nome}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
              <MapPin size={11} color="var(--ink-soft)" />
              <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{rep.cidade}, {rep.uf}</span>
            </div>
          </div>
          <div style={{
            marginLeft: "auto", flexShrink: 0,
            display: "flex", alignItems: "center", gap: 4,
            padding: "3px 8px", borderRadius: 6,
            background: "#ECFDF5", border: "1px solid #A7F3D0",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: "#059669", letterSpacing: "0.04em" }}>APROVADO</span>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {tags.map((tag, i) => (
              <span key={i} style={{
                fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 6,
                background: "var(--gold-soft)", color: "var(--gold-dark)",
                border: "1px solid rgba(200,160,48,0.25)",
              }}>{tag}</span>
            ))}
          </div>
        )}

        {/* Excerpt */}
        <p style={{ margin: 0, fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.65 }}>{excerpt}</p>

        {/* CTA row */}
        <div style={{
          paddingTop: 12, borderTop: "1px solid var(--line)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 11, color: "var(--ink-soft)" }}>Representante verificado</span>
          <button
            onClick={() => { setFormOpen((v) => !v); setSent(false); setErrors({}); }}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              fontSize: 12, fontWeight: 700,
              color: formOpen ? "var(--ink-soft)" : "var(--navy)",
              background: "none", border: "none", cursor: "pointer", padding: 0,
              transition: "color .15s",
            }}
          >
            {formOpen ? <><X size={13} /> Fechar</> : <><MessageCircle size={13} /> Entrar em contato</>}
          </button>
        </div>
      </div>

      {/* ── Inline contact form (accordion) ── */}
      {formOpen && (
        <div style={{
          borderTop: "1px solid var(--line)",
          background: "var(--gold-soft)",
          padding: "18px 20px 20px",
          display: "flex", flexDirection: "column", gap: 12,
        }}>
          {sent ? (
            /* ── Success state ── */
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 10, textAlign: "center", padding: "8px 0",
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "#ECFDF5", border: "2px solid #A7F3D0",
                display: "grid", placeItems: "center",
              }}>
                <CheckCircle2 size={24} color="#10B981" />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 14, color: "var(--navy)" }}>
                  Mensagem enviada!
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.5 }}>
                  Sua mensagem foi encaminhada ao representante.<br />Aguarde o retorno em até 2 dias úteis.
                </p>
              </div>
              <button
                onClick={closeForm}
                style={{
                  marginTop: 4, fontSize: 12, fontWeight: 600,
                  color: "var(--ink-soft)", background: "none",
                  border: "none", cursor: "pointer", textDecoration: "underline",
                }}
              >
                Fechar
              </button>
            </div>
          ) : (
            /* ── Form fields ── */
            <>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "var(--navy)" }}>
                Enviar mensagem para {rep.nome.split(" ")[0]}
              </p>

              {/* Nome */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={form.nome}
                  onChange={set("nome")}
                  style={{ ...fieldStyle, padding: "9px 11px" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = errors.nome ? "#EF4444" : "var(--line)"; }}
                />
                {errors.nome && <span style={{ fontSize: 11, color: "#EF4444" }}>{errors.nome}</span>}
              </div>

              {/* Email */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  value={form.email}
                  onChange={set("email")}
                  style={{ ...fieldStyle, padding: "9px 11px" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = errors.email ? "#EF4444" : "var(--line)"; }}
                />
                {errors.email && <span style={{ fontSize: 11, color: "#EF4444" }}>{errors.email}</span>}
              </div>

              {/* Mensagem */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <textarea
                  placeholder="Descreva brevemente sua necessidade…"
                  value={form.mensagem}
                  onChange={set("mensagem")}
                  rows={3}
                  style={{ ...fieldStyle, padding: "9px 11px", resize: "vertical", minHeight: 72, lineHeight: 1.55 }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = errors.mensagem ? "#EF4444" : "var(--line)"; }}
                />
                {errors.mensagem && <span style={{ fontSize: 11, color: "#EF4444" }}>{errors.mensagem}</span>}
              </div>

              {/* Privacy note */}
              <p style={{ margin: 0, fontSize: 10, color: "var(--ink-soft)", lineHeight: 1.5 }}>
                🔒 Sua mensagem é enviada de forma privada. Seus dados não são exibidos publicamente.
              </p>

              {/* Submit */}
              <button
                onClick={handleSend}
                disabled={loading}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  padding: "10px 16px", borderRadius: 9, fontSize: 13, fontWeight: 700,
                  color: "white", background: loading ? "var(--ink-soft)" : "var(--navy)",
                  border: "none", cursor: loading ? "not-allowed" : "pointer",
                  transition: "background .15s",
                }}
              >
                {loading
                  ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Enviando…</>
                  : <><Send size={13} /> Enviar mensagem</>}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
