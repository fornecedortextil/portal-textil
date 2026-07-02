import { X, Building2 } from "lucide-react";
import { useState } from "react";

interface Props { open: boolean; onClose: () => void; }

export function RegisterModal({ open, onClose }: Props) {
  const [sent, setSent] = useState(false);
  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[var(--ink)]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl elev-3 overflow-hidden fade-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)]">
          <div>
            <h2 className="font-extrabold text-lg text-[var(--ink)]">Cadastrar empresa</h2>
            <p className="text-xs text-[var(--ink-soft)]">Acesso 100% gratuito ao portal B2B</p>
          </div>
          <button onClick={onClose} className="grid place-items-center w-9 h-9 rounded-xl hover:bg-slate-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {sent ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto grid place-items-center w-16 h-16 rounded-full bg-[var(--navy-soft)] text-[var(--navy)] mb-4">
              <Building2 size={28} />
            </div>
            <h3 className="font-bold text-xl text-[var(--ink)]">Cadastro enviado!</h3>
            <p className="text-sm text-[var(--ink-soft)] mt-1">Verificaremos o CNPJ e enviaremos o acesso em até 1 dia útil.</p>
            <button onClick={() => { setSent(false); onClose(); }} className="mt-6 px-6 py-2.5 rounded-xl bg-[var(--navy)] text-white font-semibold text-sm">
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <Field label="Razão Social" required>
              <input required placeholder="Nome da empresa" className="input-base" />
            </Field>
            <Field label="CNPJ" required>
              <input required placeholder="00.000.000/0001-00" maxLength={18} className="input-base" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Cidade" required>
                <input required placeholder="São Paulo" className="input-base" />
              </Field>
              <Field label="Estado" required>
                <input required placeholder="SP" maxLength={2} className="input-base" />
              </Field>
            </div>
            <Field label="E-mail corporativo" required>
              <input required type="email" placeholder="contato@empresa.com.br" className="input-base" />
            </Field>
            <Field label="Telefone / WhatsApp" required>
              <input required type="tel" placeholder="(11) 99999-9999" className="input-base" />
            </Field>
            <button type="submit" className="w-full py-3 rounded-xl bg-[var(--navy)] hover:bg-[var(--navy-mid)] text-white font-bold text-sm transition-colors">
              Enviar cadastro
            </button>
            <p className="text-[11px] text-center text-[var(--ink-soft)]">
              Ao cadastrar, você concorda com os termos de uso do portal.
            </p>
          </form>
        )}
      </div>

      <style>{`
        .input-base {
          width: 100%;
          padding: 10px 13px;
          border: 1.5px solid var(--line);
          border-radius: 10px;
          font-size: 14px;
          color: var(--ink);
          background: white;
          outline: none;
          transition: border-color .15s;
          font-family: inherit;
        }
        .input-base:focus { border-color: var(--gold); }
        .input-base::placeholder { color: var(--ink-soft); }
      `}</style>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[var(--ink)] mb-1.5">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
