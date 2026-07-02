import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

/* ─── Types ─── */
export type RepStatus = "pendente" | "aprovado" | "reprovado";

export interface RepresentativeApplication {
  id: string;
  submittedAt: string;
  nome: string;
  email: string;
  telefone: string;
  cpfCnpj: string;
  cidade: string;
  uf: string;
  especialidades: string;
  historico: string;
  referencias: string;
  status: RepStatus;
  perfilPublico: boolean;
  reviewedAt?: string;
  reviewNote?: string;
}

export type NewApplication = Omit<
  RepresentativeApplication,
  "id" | "submittedAt" | "status" | "perfilPublico" | "reviewedAt" | "reviewNote"
>;

interface RepresentativesContextType {
  applications: RepresentativeApplication[];
  addApplication: (data: NewApplication) => void;
  updateStatus: (id: string, status: RepStatus, note?: string) => void;
  togglePublic: (id: string) => void;
  deleteApplication: (id: string) => void;
}

/* ─── Storage ─── */
export const ADMIN_EMAIL = "demo@fornecedortextil.com.br";
const REPS_KEY = "ft_reps_v2";

function isoOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

/* Seed data — representative candidates (demo only) */
const SEED_REPS: RepresentativeApplication[] = [
  {
    id: "r001",
    submittedAt: isoOffset(14),
    nome: "Carlos Alberto Ferreira",
    email: "carlos.ferreira@email.com",
    telefone: "(11) 98877-3310",
    cpfCnpj: "234.567.890-11",
    cidade: "Campinas",
    uf: "SP",
    especialidades: "Malhas, Tecidos Planos — Interior SP e MG",
    historico:
      "Atuei por 8 anos como representante comercial da Textilaria São Cristóvão, cobrindo o interior de SP e sul de MG. Trabalhei com tecidos planos, malhas circular e aviamentos para confecções de médio porte. Tenho carteira ativa com 38 clientes e experiência em visita técnica e desenvolvimento de fornecedores.",
    referencias:
      "1. João Mendes — Gerente Comercial, Textilaria São Cristóvão — (19) 99123-4567\n2. Renata Lopes — Diretora, Confecções Romi Ltda — renata@romi.com.br",
    status: "aprovado",
    perfilPublico: true,
    reviewedAt: isoOffset(10),
  },
  {
    id: "r002",
    submittedAt: isoOffset(21),
    nome: "Marina Costa Alves",
    email: "marina.alves@repcomercial.com.br",
    telefone: "(51) 98765-4321",
    cpfCnpj: "12.345.678/0001-55",
    cidade: "Porto Alegre",
    uf: "RS",
    especialidades: "Jeans, Brim, Uniformes Profissionais — Rio Grande do Sul",
    historico:
      "Profissional com 12 anos no setor têxtil, especializada em jeans e brim para uniformes corporativos. Fundei minha empresa de representação em 2018 e atendo fabricantes de Caxias do Sul, Farroupilha e Porto Alegre. Carteira com 52 clientes ativos em indústrias e cooperativas do RS.",
    referencias:
      "1. Fábio Schneider — Diretor Industrial, Jeans Sul Ltda — (54) 98888-0001\n2. Ana Beatriz Müller — Supervisora, Textil Gaúcha — abmuller@texgaucha.com.br",
    status: "aprovado",
    perfilPublico: true,
    reviewedAt: isoOffset(18),
  },
  {
    id: "r003",
    submittedAt: isoOffset(7),
    nome: "Roberto Dias Nascimento",
    email: "roberto.dias@gmail.com",
    telefone: "(71) 97654-3210",
    cpfCnpj: "345.678.901-22",
    cidade: "Salvador",
    uf: "BA",
    especialidades: "Algodão, Tecidos Naturais — Nordeste",
    historico:
      "Tenho 5 anos de experiência como autônomo no setor de algodão natural e tecidos de origem nordestina. Conectei tecelagens artesanais da Bahia e Pernambuco a compradores em São Paulo e Rio de Janeiro. Conheço bem as rotas logísticas e as particularidades dos fornecedores regionais.",
    referencias:
      "1. Cecília Moura — Coordenadora, Cooperativa Têxtil BA — (71) 99200-1234\n2. Paulo Rocha — Sócio, Armazém do Tecido — paulo@armazem.com.br",
    status: "pendente",
    perfilPublico: false,
  },
  {
    id: "r004",
    submittedAt: isoOffset(30),
    nome: "Fernanda Ramos Oliveira",
    email: "fernanda.ramos@hotmail.com",
    telefone: "(31) 96543-2100",
    cpfCnpj: "456.789.012-33",
    cidade: "Belo Horizonte",
    uf: "MG",
    especialidades: "Maquinário Industrial, Peças e Acessórios — MG e ES",
    historico:
      "Experiência de 3 anos em representação de maquinário industrial de costura. Trabalhei como assistente de vendas na Jack do Brasil por 2 anos antes de abrir minha carteira própria. Atuo principalmente com pequenas fábricas em expansão que buscam modernizar o parque de máquinas.",
    referencias:
      "1. Lucas Pinto — Gerente Regional, Jack do Brasil — (11) 98001-5555\n2. Sandra Gomes — Proprietária, Costura & Cia — (31) 97800-9900",
    status: "reprovado",
    perfilPublico: false,
    reviewedAt: isoOffset(25),
    reviewNote: "Experiência ainda inicial. Reavaliar em 6 meses com mais referências do setor.",
  },
  {
    id: "r005",
    submittedAt: isoOffset(3),
    nome: "Gustavo Henrique Martins",
    email: "gh.martins@repbrasil.com",
    telefone: "(41) 99887-6655",
    cpfCnpj: "78.901.234/0001-88",
    cidade: "Curitiba",
    uf: "PR",
    especialidades: "Tecidos Técnicos, Outdoor, Impermeáveis — Sul do Brasil",
    historico:
      "Sócio de empresa de representação há 6 anos, especializada em tecidos técnicos (outdoor, impermeável, refletivo) para uniformes, tendas e EPIs. Atendo marcas de vestuário técnico em Curitiba, Joinville e Blumenau. Volume anual representado: aprox. R$ 2,4M.",
    referencias:
      "1. Marcos Teixeira — Diretor, TechFabric Sul — (47) 99300-1234\n2. Elisa Cardoso — Compradora Senior, Uniformes Paraná — elisa@unifpr.com.br",
    status: "aprovado",
    perfilPublico: true,
    reviewedAt: isoOffset(1),
  },
];

function loadReps(): RepresentativeApplication[] {
  try {
    const raw = localStorage.getItem(REPS_KEY);
    if (raw) return JSON.parse(raw) as RepresentativeApplication[];
  } catch { /* */ }
  return SEED_REPS;
}

function persistReps(reps: RepresentativeApplication[]) {
  try {
    localStorage.setItem(REPS_KEY, JSON.stringify(reps));
  } catch { /* */ }
}

/* ─── Context ─── */
const RepresentativesContext = createContext<RepresentativesContextType | null>(null);

export function RepresentativesProvider({ children }: { children: React.ReactNode }) {
  const [applications, setApplications] = useState<RepresentativeApplication[]>(() => loadReps());

  const persist = useCallback((reps: RepresentativeApplication[]) => {
    persistReps(reps);
    setApplications(reps);
  }, []);

  /* Ensure seed is written on first load */
  useEffect(() => {
    if (!localStorage.getItem(REPS_KEY)) {
      persistReps(SEED_REPS);
    }
  }, []);

  const addApplication = useCallback(
    (data: NewApplication) => {
      const newApp: RepresentativeApplication = {
        ...data,
        id: `r${Date.now()}`,
        submittedAt: new Date().toISOString(),
        status: "pendente",
        perfilPublico: false,
      };
      persist([...applications, newApp]);
    },
    [applications, persist],
  );

  const updateStatus = useCallback(
    (id: string, status: RepStatus, note?: string) => {
      persist(
        applications.map((r) =>
          r.id === id
            ? {
                ...r,
                status,
                reviewedAt: new Date().toISOString(),
                ...(note !== undefined ? { reviewNote: note } : {}),
                perfilPublico: status === "aprovado" ? r.perfilPublico : false,
              }
            : r,
        ),
      );
    },
    [applications, persist],
  );

  const togglePublic = useCallback(
    (id: string) => {
      persist(
        applications.map((r) =>
          r.id === id ? { ...r, perfilPublico: !r.perfilPublico } : r,
        ),
      );
    },
    [applications, persist],
  );

  const deleteApplication = useCallback(
    (id: string) => {
      persist(applications.filter((r) => r.id !== id));
    },
    [applications, persist],
  );

  return (
    <RepresentativesContext.Provider
      value={{ applications, addApplication, updateStatus, togglePublic, deleteApplication }}
    >
      {children}
    </RepresentativesContext.Provider>
  );
}

export function useRepresentatives() {
  const ctx = useContext(RepresentativesContext);
  if (!ctx) throw new Error("useRepresentatives must be used within RepresentativesProvider");
  return ctx;
}
