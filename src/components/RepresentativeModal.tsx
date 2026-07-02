import React, { useState } from "react";
import {
  X, Users, Briefcase, CheckCircle2, Loader2,
  MapPin, Mail, Phone, FileText, Star, ChevronRight,
} from "lucide-react";
import { useRepresentatives } from "../context/RepresentativesContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  cidade: string;
  uf: string;
  especialidades: string;
  historico: string;
  referencias: string;
}

const EMPTY: FormData = {
  nome: "", cpfCnpj: "", email: "", telefone: "",
  cidade: "", uf: "", especialidades: "", historico: "", referencias: "",
};

const UFS_LIST = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA",
  "MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN",
  "RO","RR","RS","SC","SE","SP","TO",
];

function Field({
  label, required, children, hint,
}: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 5 }}>
        {label} {required && <span style={{ color: "#DC2626" }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 4, lineHeight: 1.4 }}>{hint}</p>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 13px", borderRadius: 10, fontSize: 13,
  border: "1.5px solid var(--line)", color: "var(--ink)", background: "white",
  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
  transition: "border-color .15s",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle, resize: "vertical", minHeight: 100, lineHeight: 1.6,
};

export function RepresentativeModal({ open, onClose }: Props) {
  const { addApplication } = useRepresentatives();
  const [step, setStep] = useState<"form" | "success">("form");
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = (): boolean => {
    const errs: Partial<FormData> = {};
    if (!form.nome.trim()) errs.nome = "Nome obrigatório";
    if (!form.cpfCnpj.trim()) errs.cpfCnpj = "CPF/CNPJ obrigatório";
    if (!form.email.trim() || !form.email.includes("@")) errs.email = "E-mail inválido";
    if (!form.telefone.trim()) errs.telefone = "Telefone obrigatório";
    if (!form.cidade.trim()) errs.cidade = "Cidade obrigatória";
    if (!form.uf) errs.uf = "Estado obrigatório";
    if (!form.historico.trim() || form.historico.trim().length < 80)
      errs.historico = "Descreva seu histórico profissional com pelo menos 80 caracteres";
    if (!form.referencias.trim() || form.referencias.trim().length < 40)
      errs.referencias = "Informe pelo menos uma referência com detalhes (mín. 40 caracteres)";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    addApplication({
      nome: form.nome.trim(),
      email: form.email.trim(),
      telefone: form.telefone.trim(),
      cpfCnpj: form.cpfCnpj.trim(),
      cidade: form.cidade.trim(),
      uf: form.uf,
      especialidades: form.especialidades.trim(),
      historico: form.historico.trim(),
      referencias: form.referencias.trim(),
    });
    setLoading(false);
    setStep("success");
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => { setStep("form"); setForm(EMPTY); setErrors({}); }, 300);
  };

  const errStyle: React.CSSProperties = {
    fontSize: 11, color: "#DC2626", marginTop: 4, display: "flex", alignItems: "center", gap: 4,
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(13,31,60,0.72)", backdropFilter: "blur(6px)" }} onClick={handleClose} />

      <div style={{
        position: "relative", width: "100%", maxWidth: step === "success" ? 440 : 620,
        background: "white", borderRadius: 24, overflow: "hidden",
        boxShadow: "0 24px 80px rgba(13,31,60,0.3)", maxHeight: "92vh", display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, var(--navy) 0%, #1a2f6e 100%)", padding: "22px 26px 18px", flexShrink: 0, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -20, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,160,48,0.18) 0%, transparent 70%)" }} />
          <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Users size={15} color="var(--gold)" />
                <span style={{ fontSize: 11, fontWeight: 800, color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Representantes Comerciais
                </span>
              </div>
              <h2 style={{ fontWeight: 900, fontSize: 20, color: "white", lineHeight: 1.15 }}>
                Cadastro de Representante
              </h2>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 4, maxWidth: 400 }}>
                Conecte fábricas e compradores na sua região. Amplie sua carteira de clientes com visibilidade no portal.
              </p>
            </div>
            <button onClick={handleClose} style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <X size={15} color="rgba(255,255,255,0.7)" />
            </button>
          </div>
        </div>

        {/* Success */}
        {step === "success" && (
          <div style={{ padding: "40px 32px", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #059669, #047857)", display: "grid", placeItems: "center", margin: "0 auto 18px", boxShadow: "0 8px 24px rgba(5,150,105,0.3)" }}>
              <CheckCircle2 size={34} color="white" />
            </div>
            <h3 style={{ fontWeight: 900, fontSize: 22, color: "var(--ink)", marginBottom: 8 }}>Candidatura enviada!</h3>
            <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65, maxWidth: 320, margin: "0 auto 24px" }}>
              Recebemos seu cadastro. Nossa equipe analisará seu histórico profissional e referências em até <strong>3 dias úteis</strong>.
            </p>
            <div style={{ padding: "14px 16px", borderRadius: 12, background: "var(--navy-soft)", border: "1px solid var(--line)", marginBottom: 22, textAlign: "left", fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.6 }}>
              Você receberá um e-mail em <strong style={{ color: "var(--navy)" }}>{form.email}</strong> com o resultado da avaliação e as próximas etapas de ativação.
            </div>
            <button onClick={handleClose} style={{ width: "100%", padding: "13px", borderRadius: 12, fontSize: 14, fontWeight: 700, background: "linear-gradient(135deg, var(--navy), var(--navy-mid))", color: "white", border: "none", cursor: "pointer" }}>
              Fechar
            </button>
          </div>
        )}

        {/* Form */}
        {step === "form" && (
          <div style={{ padding: "24px 26px 26px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Info box */}
            <div style={{ padding: "12px 16px", borderRadius: 12, background: "var(--gold-soft)", border: "1px solid rgba(200,160,48,0.35)", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Star size={14} color="var(--gold-dark)" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: "var(--gold-dark)", lineHeight: 1.55, margin: 0 }}>
                <strong>Representantes verificados</strong> recebem visibilidade nos perfis das fábricas que representam e acesso a planos de divulgação com taxa diferenciada.
              </p>
            </div>

            {/* Row: nome */}
            <Field label="Nome completo" required hint="Seu nome como constará no perfil público">
              <input
                value={form.nome} onChange={set("nome")} placeholder="Ex.: Carlos Alberto Ferreira"
                style={{ ...inputStyle, borderColor: errors.nome ? "#FCA5A5" : "var(--line)" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--navy)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = errors.nome ? "#FCA5A5" : "var(--line)"; }}
              />
              {errors.nome && <p style={errStyle}>⚠ {errors.nome}</p>}
            </Field>

            {/* Row: cpf + email */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="CPF / CNPJ" required>
                <input
                  value={form.cpfCnpj} onChange={set("cpfCnpj")} placeholder="000.000.000-00"
                  style={{ ...inputStyle, borderColor: errors.cpfCnpj ? "#FCA5A5" : "var(--line)" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--navy)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = errors.cpfCnpj ? "#FCA5A5" : "var(--line)"; }}
                />
                {errors.cpfCnpj && <p style={errStyle}>⚠ {errors.cpfCnpj}</p>}
              </Field>
              <Field label="Telefone / WhatsApp" required>
                <input
                  value={form.telefone} onChange={set("telefone")} placeholder="(11) 99999-0000"
                  style={{ ...inputStyle, borderColor: errors.telefone ? "#FCA5A5" : "var(--line)" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--navy)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = errors.telefone ? "#FCA5A5" : "var(--line)"; }}
                />
                {errors.telefone && <p style={errStyle}>⚠ {errors.telefone}</p>}
              </Field>
            </div>

            <Field label="E-mail profissional" required>
              <input
                type="email" value={form.email} onChange={set("email")} placeholder="seu@email.com.br"
                style={{ ...inputStyle, borderColor: errors.email ? "#FCA5A5" : "var(--line)" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--navy)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = errors.email ? "#FCA5A5" : "var(--line)"; }}
              />
              {errors.email && <p style={errStyle}>⚠ {errors.email}</p>}
            </Field>

            {/* Row: cidade + uf */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12 }}>
              <Field label="Cidade de atuação principal" required>
                <input
                  value={form.cidade} onChange={set("cidade")} placeholder="Ex.: Campinas"
                  style={{ ...inputStyle, borderColor: errors.cidade ? "#FCA5A5" : "var(--line)" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--navy)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = errors.cidade ? "#FCA5A5" : "var(--line)"; }}
                />
                {errors.cidade && <p style={errStyle}>⚠ {errors.cidade}</p>}
              </Field>
              <Field label="UF" required>
                <select
                  value={form.uf} onChange={set("uf")}
                  style={{ ...inputStyle, width: 80, borderColor: errors.uf ? "#FCA5A5" : "var(--line)", cursor: "pointer" }}
                >
                  <option value="">—</option>
                  {UFS_LIST.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
                {errors.uf && <p style={errStyle}>⚠ {errors.uf}</p>}
              </Field>
            </div>

            <Field label="Especialidades / segmentos de atuação" hint="Ex.: Malhas, Tecidos Planos, Maquinário — Região: Interior SP">
              <input
                value={form.especialidades} onChange={set("especialidades")}
                placeholder="Ex.: Tecidos técnicos, uniformes, zona sul de SP"
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--navy)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--line)"; }}
              />
            </Field>

            {/* Histórico profissional */}
            <Field
              label="Histórico profissional"
              required
              hint="Descreva sua trajetória na área têxtil: empresas em que trabalhou, produtos com os quais atuou, tempo de experiência e regiões atendidas. Mínimo 80 caracteres."
            >
              <textarea
                value={form.historico} onChange={set("historico")}
                placeholder="Ex.: Atuei por 8 anos como representante comercial da Indústria X, cobrindo o interior de SP e MG. Trabalhei com tecidos planos, malhas e aviamentos para confecções de médio porte. Tenho carteira ativa com 40+ clientes..."
                style={{ ...textareaStyle, minHeight: 120, borderColor: errors.historico ? "#FCA5A5" : "var(--line)" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--navy)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = errors.historico ? "#FCA5A5" : "var(--line)"; }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                {errors.historico
                  ? <p style={errStyle}>⚠ {errors.historico}</p>
                  : <span />}
                <span style={{ fontSize: 11, color: form.historico.length >= 80 ? "#059669" : "var(--ink-soft)" }}>
                  {form.historico.length} / 80 mín.
                </span>
              </div>
            </Field>

            {/* Referências */}
            <Field
              label="Referências profissionais"
              required
              hint="Informe nome da empresa ou pessoa, cargo do contato e telefone ou e-mail. O portal pode contatá-los para verificação. Mínimo 40 caracteres."
            >
              <textarea
                value={form.referencias} onChange={set("referencias")}
                placeholder={"Ex.:\n1. João Silva — Gerente Comercial, Textilaria ABC — (11) 98888-0001\n2. Maria Costa — Diretora, Confecções XYZ — maria@xyzltda.com.br"}
                style={{ ...textareaStyle, borderColor: errors.referencias ? "#FCA5A5" : "var(--line)" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--navy)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = errors.referencias ? "#FCA5A5" : "var(--line)"; }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                {errors.referencias
                  ? <p style={errStyle}>⚠ {errors.referencias}</p>
                  : <span />}
                <span style={{ fontSize: 11, color: form.referencias.length >= 40 ? "#059669" : "var(--ink-soft)" }}>
                  {form.referencias.length} / 40 mín.
                </span>
              </div>
            </Field>

            {/* Terms note */}
            <div style={{ padding: "10px 14px", borderRadius: 10, background: "#F8FAFC", border: "1px solid var(--line)", fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.55 }}>
              Ao enviar, você declara que as informações são verdadeiras e concorda com a análise de suas referências profissionais pela equipe do Fornecedor Têxtil. O portal atua como diretório de divulgação — a negociação comercial é realizada diretamente entre as partes.
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: "13px", borderRadius: 12, fontSize: 14, fontWeight: 700,
                background: loading ? "#94A3B8" : "linear-gradient(135deg, var(--navy), var(--navy-mid))",
                color: "white", border: "none", cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {loading
                ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Enviando candidatura…</>
                : <><CheckCircle2 size={16} /> Enviar candidatura <ChevronRight size={14} /></>}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
      </div>
    </div>
  );
}
