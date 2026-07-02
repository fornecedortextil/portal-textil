import React, { useState, useMemo } from "react";
import {
  Users, CheckCircle2, XCircle, Clock, Search,
  Eye, EyeOff, Trash2, ArrowLeft, ChevronDown, ChevronUp,
  ShieldCheck, Globe, AlertCircle, FileText, Star,
} from "lucide-react";
import {
  useRepresentatives,
  type RepresentativeApplication,
  type RepStatus,
} from "../context/RepresentativesContext";

/* ─── Helpers ─── */
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}
function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  return `${local.slice(0, 2)}${"•".repeat(Math.max(3, local.length - 2))}@${domain}`;
}
function maskPhone(p: string) {
  return p.replace(/(\d{2})\s?(\d{4,5})-?(\d{4})/, "($1) •••••-$3");
}
function maskDoc(doc: string) {
  return doc.replace(/\d(?=\d{4})/g, "•");
}

const STATUS_META: Record<RepStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  pendente:  { label: "Pendente",  color: "#92400E", bg: "#FEF3C7", icon: Clock },
  aprovado:  { label: "Aprovado",  color: "#065F46", bg: "#D1FAE5", icon: CheckCircle2 },
  reprovado: { label: "Reprovado", color: "#7F1D1D", bg: "#FEE2E2", icon: XCircle },
};

/* ─── Sub-components ─── */
function StatusBadge({ status }: { status: RepStatus }) {
  const m = STATUS_META[status];
  const Icon = m.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
      color: m.color, background: m.bg,
    }}>
      <Icon size={11} /> {m.label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: typeof Users; label: string; value: number; color: string;
}) {
  return (
    <div style={{
      padding: "16px 20px", borderRadius: 14, background: "white",
      border: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 14,
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 11, background: `${color}18`, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <Icon size={18} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "var(--ink)", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 3 }}>{label}</div>
      </div>
    </div>
  );
}

/* ─── Detail Panel ─── */
function DetailPanel({
  rep, onClose, onApprove, onReject, onTogglePublic,
}: {
  rep: RepresentativeApplication;
  onClose: () => void;
  onApprove: () => void;
  onReject: (note: string) => void;
  onTogglePublic: () => void;
}) {
  const [rejectNote, setRejectNote] = useState(rep.reviewNote || "");
  const [showReject, setShowReject] = useState(false);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 40, display: "flex" }}>
      <div style={{ flex: 1, background: "rgba(13,31,60,0.5)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div style={{
        width: "min(520px, 100vw)", height: "100%", background: "white", overflowY: "auto",
        display: "flex", flexDirection: "column", boxShadow: "-8px 0 40px rgba(13,31,60,0.18)",
      }}>
        {/* Panel header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, background: "white", zIndex: 2 }}>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid var(--line)", background: "white", display: "grid", placeItems: "center", cursor: "pointer" }}>
            <ArrowLeft size={15} color="var(--ink)" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: "var(--ink)" }}>{rep.nome}</div>
            <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{rep.cidade}/{rep.uf} · Candidatura {fmtDate(rep.submittedAt)}</div>
          </div>
          <StatusBadge status={rep.status} />
        </div>

        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Contact (masked) */}
          <section>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Dados de Contato</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "CPF / CNPJ", value: maskDoc(rep.cpfCnpj) },
                { label: "Telefone", value: maskPhone(rep.telefone) },
                { label: "E-mail", value: maskEmail(rep.email) },
                { label: "Localização", value: `${rep.cidade} / ${rep.uf}` },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: "10px 13px", borderRadius: 10, background: "var(--canvas)", border: "1px solid var(--line)" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", fontFamily: "monospace" }}>{value}</div>
                </div>
              ))}
            </div>
            {rep.especialidades && (
              <div style={{ marginTop: 10, padding: "10px 13px", borderRadius: 10, background: "var(--gold-soft)", border: "1px solid rgba(200,160,48,0.3)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--gold-dark)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Especialidades</div>
                <div style={{ fontSize: 13, color: "var(--ink)" }}>{rep.especialidades}</div>
              </div>
            )}
          </section>

          {/* Histórico */}
          <section>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Histórico Profissional</div>
            <div style={{ padding: "14px 16px", borderRadius: 12, background: "#F8FAFC", border: "1px solid var(--line)", fontSize: 13, color: "var(--ink)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
              {rep.historico}
            </div>
          </section>

          {/* Referências */}
          <section>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Referências Profissionais</div>
            <div style={{ padding: "14px 16px", borderRadius: 12, background: "#F8FAFC", border: "1px solid var(--line)", fontSize: 13, color: "var(--ink)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
              {rep.referencias}
            </div>
          </section>

          {/* Review note (if rejected) */}
          {rep.status === "reprovado" && rep.reviewNote && (
            <div style={{ padding: "12px 14px", borderRadius: 10, background: "#FEF2F2", border: "1px solid #FECACA" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#991B1B", marginBottom: 4 }}>Motivo da reprovação</div>
              <div style={{ fontSize: 13, color: "#7F1D1D", lineHeight: 1.6 }}>{rep.reviewNote}</div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 4 }}>
            {/* Perfil público toggle (only for approved) */}
            {rep.status === "aprovado" && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 12, background: rep.perfilPublico ? "#D1FAE5" : "var(--canvas)", border: `1px solid ${rep.perfilPublico ? "#6EE7B7" : "var(--line)"}` }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "var(--ink)" }}>Perfil público</div>
                  <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                    {rep.perfilPublico ? "Visível no portal para compradores" : "Não aparece no portal"}
                  </div>
                </div>
                <button onClick={onTogglePublic} style={{
                  display: "flex", alignItems: "center", gap: 5, padding: "7px 13px", borderRadius: 8,
                  fontSize: 12, fontWeight: 700, cursor: "pointer", border: "none",
                  background: rep.perfilPublico ? "#059669" : "var(--navy)", color: "white",
                }}>
                  {rep.perfilPublico ? <><Eye size={13} /> Visível</> : <><EyeOff size={13} /> Oculto</>}
                </button>
              </div>
            )}

            {/* Approve button */}
            {rep.status !== "aprovado" && (
              <button onClick={onApprove} style={{
                padding: "11px", borderRadius: 11, fontSize: 13, fontWeight: 700,
                background: "linear-gradient(135deg, #059669, #047857)",
                color: "white", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <CheckCircle2 size={15} /> Aprovar candidatura
              </button>
            )}

            {/* Reject section */}
            {rep.status !== "reprovado" && (
              <div>
                <button onClick={() => setShowReject((v) => !v)} style={{
                  width: "100%", padding: "10px", borderRadius: 11, fontSize: 13, fontWeight: 700,
                  background: "white", color: "#DC2626", border: "1.5px solid #FCA5A5", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  <XCircle size={15} /> {showReject ? "Cancelar" : "Reprovar candidatura"}
                  {showReject ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
                {showReject && (
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                    <textarea
                      value={rejectNote}
                      onChange={(e) => setRejectNote(e.target.value)}
                      placeholder="Motivo da reprovação (opcional — ficará visível internamente)"
                      style={{
                        width: "100%", padding: "10px 13px", borderRadius: 10, fontSize: 13,
                        border: "1.5px solid #FCA5A5", fontFamily: "inherit",
                        resize: "vertical", minHeight: 72, color: "var(--ink)", boxSizing: "border-box",
                        outline: "none",
                      }}
                    />
                    <button onClick={() => { onReject(rejectNote); setShowReject(false); }} style={{
                      padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                      background: "#DC2626", color: "white", border: "none", cursor: "pointer",
                    }}>
                      Confirmar reprovação
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Row card ─── */
function RepRow({
  rep, onSelect, onApprove, onReject, onTogglePublic, onDelete,
}: {
  rep: RepresentativeApplication;
  onSelect: () => void;
  onApprove: () => void;
  onReject: () => void;
  onTogglePublic: () => void;
  onDelete: () => void;
}) {
  const [confirmDel, setConfirmDel] = useState(false);

  return (
    <div style={{
      background: "white", border: "1px solid var(--line)", borderRadius: 14,
      padding: "14px 16px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12,
    }}>
      {/* Avatar */}
      <div style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0, display: "grid", placeItems: "center",
        background: `linear-gradient(135deg, var(--navy), var(--navy-mid))`,
        fontWeight: 800, fontSize: 16, color: "white",
      }}>
        {rep.nome.charAt(0)}
      </div>

      {/* Main info */}
      <div style={{ flex: 1, minWidth: 180 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{rep.nome}</div>
        <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 2 }}>
          {rep.cidade}/{rep.uf}
          {rep.especialidades && ` · ${rep.especialidades.split(",")[0].trim()}`}
        </div>
        <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 1 }}>
          Candidatura: {fmtDate(rep.submittedAt)}
        </div>
      </div>

      {/* Status */}
      <StatusBadge status={rep.status} />

      {/* Public badge */}
      {rep.status === "aprovado" && (
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px",
          borderRadius: 999, fontSize: 11, fontWeight: 600,
          color: rep.perfilPublico ? "#065F46" : "var(--ink-soft)",
          background: rep.perfilPublico ? "#D1FAE5" : "var(--canvas)",
          border: `1px solid ${rep.perfilPublico ? "#6EE7B7" : "var(--line)"}`,
        }}>
          {rep.perfilPublico ? <Globe size={10} /> : <EyeOff size={10} />}
          {rep.perfilPublico ? "Público" : "Oculto"}
        </span>
      )}

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <button onClick={onSelect} title="Ver detalhes" style={{
          padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
          background: "var(--navy-soft)", color: "var(--navy)", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <FileText size={12} /> Detalhes
        </button>

        {rep.status === "pendente" && (
          <>
            <button onClick={onApprove} title="Aprovar" style={{
              width: 30, height: 30, borderRadius: 8, border: "none", cursor: "pointer",
              background: "#D1FAE5", display: "grid", placeItems: "center",
            }}>
              <CheckCircle2 size={15} color="#059669" />
            </button>
            <button onClick={onReject} title="Reprovar" style={{
              width: 30, height: 30, borderRadius: 8, border: "none", cursor: "pointer",
              background: "#FEE2E2", display: "grid", placeItems: "center",
            }}>
              <XCircle size={15} color="#DC2626" />
            </button>
          </>
        )}

        {rep.status === "aprovado" && (
          <button onClick={onTogglePublic} title="Alternar visibilidade" style={{
            width: 30, height: 30, borderRadius: 8, border: "none", cursor: "pointer",
            background: rep.perfilPublico ? "#D1FAE5" : "var(--canvas)", display: "grid", placeItems: "center",
          }}>
            {rep.perfilPublico ? <Eye size={15} color="#059669" /> : <EyeOff size={15} color="var(--ink-soft)" />}
          </button>
        )}

        {confirmDel ? (
          <>
            <button onClick={onDelete} style={{
              padding: "4px 9px", borderRadius: 7, fontSize: 11, fontWeight: 700,
              background: "#DC2626", color: "white", border: "none", cursor: "pointer",
            }}>Confirmar</button>
            <button onClick={() => setConfirmDel(false)} style={{
              padding: "4px 9px", borderRadius: 7, fontSize: 11, fontWeight: 600,
              background: "var(--canvas)", color: "var(--ink)", border: "1px solid var(--line)", cursor: "pointer",
            }}>Cancelar</button>
          </>
        ) : (
          <button onClick={() => setConfirmDel(true)} title="Excluir" style={{
            width: 30, height: 30, borderRadius: 8, border: "none", cursor: "pointer",
            background: "var(--canvas)", display: "grid", placeItems: "center",
          }}>
            <Trash2 size={14} color="var(--ink-soft)" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Main Panel ─── */
export function AdminPanel({ onBack }: { onBack: () => void }) {
  const { applications, updateStatus, togglePublic, deleteApplication } = useRepresentatives();
  const [filter, setFilter] = useState<RepStatus | "todos">("todos");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<RepresentativeApplication | null>(null);

  const stats = useMemo(() => ({
    total: applications.length,
    pendente: applications.filter((r) => r.status === "pendente").length,
    aprovado: applications.filter((r) => r.status === "aprovado").length,
    reprovado: applications.filter((r) => r.status === "reprovado").length,
  }), [applications]);

  const filtered = useMemo(() => {
    return applications.filter((r) => {
      if (filter !== "todos" && r.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          r.nome.toLowerCase().includes(q) ||
          r.cidade.toLowerCase().includes(q) ||
          r.uf.toLowerCase().includes(q) ||
          r.especialidades.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [applications, filter, search]);

  const chips: { label: string; value: RepStatus | "todos" }[] = [
    { label: `Todos (${stats.total})`, value: "todos" },
    { label: `Pendentes (${stats.pendente})`, value: "pendente" },
    { label: `Aprovados (${stats.aprovado})`, value: "aprovado" },
    { label: `Reprovados (${stats.reprovado})`, value: "reprovado" },
  ];

  const syncSelected = (id: string) => {
    const updated = applications.find((r) => r.id === id);
    if (updated) setSelected(updated);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)" }}>
      {/* Top bar */}
      <div style={{ background: "var(--navy)", position: "sticky", top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={onBack} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "7px 13px",
            borderRadius: 9, border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.75)",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            <ArrowLeft size={14} /> Portal
          </button>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.12)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldCheck size={16} color="var(--gold)" />
            <span style={{ fontWeight: 800, fontSize: 15, color: "white" }}>Painel Administrativo</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>/ Representantes Comerciais</span>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
            Acesso restrito · admin
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
          <StatCard icon={Users} label="Candidaturas totais" value={stats.total} color="var(--navy)" />
          <StatCard icon={Clock} label="Pendentes" value={stats.pendente} color="#D97706" />
          <StatCard icon={CheckCircle2} label="Aprovados" value={stats.aprovado} color="#059669" />
          <StatCard icon={XCircle} label="Reprovados" value={stats.reprovado} color="#DC2626" />
        </div>

        {/* Storage notice */}
        <div style={{
          padding: "10px 16px", borderRadius: 10, background: "rgba(200,160,48,0.08)",
          border: "1px solid rgba(200,160,48,0.2)", marginBottom: 20,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <AlertCircle size={14} color="var(--gold-dark)" />
          <span style={{ fontSize: 12, color: "var(--gold-dark)" }}>
            <strong>Modo demonstração:</strong> dados armazenados no localStorage deste navegador. Em produção, conectar a uma API com banco de dados seguro.
          </span>
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 16 }}>
          <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--ink-soft)" }} />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, cidade, UF ou especialidade…"
              style={{
                width: "100%", padding: "9px 13px 9px 34px", borderRadius: 10,
                border: "1.5px solid var(--line)", fontSize: 13, color: "var(--ink)",
                background: "white", outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {chips.map(({ label, value }) => (
              <button key={value} onClick={() => setFilter(value)} style={{
                padding: "7px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer",
                border: "1.5px solid", transition: "all .15s",
                borderColor: filter === value ? "var(--navy)" : "var(--line)",
                background: filter === value ? "var(--navy)" : "white",
                color: filter === value ? "white" : "var(--ink-soft)",
              }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--ink-soft)" }}>
            <Users size={36} style={{ opacity: 0.25, marginBottom: 12 }} />
            <div style={{ fontWeight: 700, fontSize: 15 }}>Nenhuma candidatura encontrada</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((rep) => (
              <RepRow
                key={rep.id}
                rep={rep}
                onSelect={() => setSelected(rep)}
                onApprove={() => { updateStatus(rep.id, "aprovado"); if (selected?.id === rep.id) syncSelected(rep.id); }}
                onReject={() => { updateStatus(rep.id, "reprovado"); if (selected?.id === rep.id) syncSelected(rep.id); }}
                onTogglePublic={() => { togglePublic(rep.id); if (selected?.id === rep.id) syncSelected(rep.id); }}
                onDelete={() => { deleteApplication(rep.id); if (selected?.id === rep.id) setSelected(null); }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail slide-over */}
      {selected && (
        <DetailPanel
          rep={applications.find((r) => r.id === selected.id) || selected}
          onClose={() => setSelected(null)}
          onApprove={() => { updateStatus(selected.id, "aprovado"); syncSelected(selected.id); }}
          onReject={(note) => { updateStatus(selected.id, "reprovado", note); syncSelected(selected.id); }}
          onTogglePublic={() => { togglePublic(selected.id); syncSelected(selected.id); }}
        />
      )}
    </div>
  );
}
