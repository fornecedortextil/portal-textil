import React, { createContext, useContext, useState, useEffect } from "react";

export type PlanType = "basic" | "destaque" | "premium";

export interface FeaturedPlan {
  plan: PlanType;
  startedAt: string;
  expiresAt: string;
  price: string;
  durationDays: number;
}

export interface UserAd {
  id: string;
  title: string;
  category: string;
  price: string;
  unit: string;
  city: string;
  uf: string;
  publishedAt: string;
  expiresAt: string;
  views: number;
  contacts: number;
  status: "active" | "expired" | "paused";
  featuredPlan?: FeaturedPlan;
}

export interface AuthUser {
  id: string;
  email: string;
  companyName: string;
  cnpj: string;
  city: string;
  uf: string;
  ads: UserAd[];
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  renewAd: (adId: string) => void;
  pauseAd: (adId: string) => void;
  resumeAd: (adId: string) => void;
  upgradePlan: (adId: string, plan: Exclude<PlanType, "basic">) => void;
  cancelPlan: (adId: string) => void;
}

export interface RegisterData {
  email: string;
  password: string;
  companyName: string;
  cnpj: string;
  city: string;
  uf: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "ft_users";
const SESSION_KEY = "ft_session";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function addDays(iso: string, n: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

export const PLAN_CONFIG: Record<Exclude<PlanType, "basic">, {
  label: string; price: string; priceNum: number; days: number; color: string;
  benefits: string[];
}> = {
  destaque: {
    label: "Destaque",
    price: "R$ 49,90",
    priceNum: 49.90,
    days: 30,
    color: "#C8A030",
    benefits: [
      "Aparece no topo da listagem",
      "Borda e badge dourado no card",
      "Ícone ⭐ de destaque",
      "Até 3× mais visualizações",
      "Seção 'Anúncios em Destaque'",
    ],
  },
  premium: {
    label: "Premium",
    price: "R$ 89,90",
    priceNum: 89.90,
    days: 30,
    color: "#7C3AED",
    benefits: [
      "Tudo do plano Destaque",
      "Badge 'Fornecedor Verificado'",
      "Posição fixa no topo",
      "Destaque em resultados de busca",
      "Estatísticas avançadas",
    ],
  },
};

const DEMO_USERS: Record<string, { password: string; user: AuthUser }> = {
  "demo@fornecedortextil.com.br": {
    password: "demo123",
    user: {
      id: "u1",
      email: "demo@fornecedortextil.com.br",
      companyName: "Textilaria Progresso Ltda.",
      cnpj: "12.345.678/0001-99",
      city: "São Paulo",
      uf: "SP",
      ads: [
        {
          id: "a1",
          title: "Malha 100% Algodão 30/1 Penteado",
          category: "Malhas",
          price: "R$ 18,50/kg",
          unit: "kg",
          city: "São Paulo",
          uf: "SP",
          publishedAt: daysAgo(45),
          expiresAt: addDays(daysAgo(45), 60),
          views: 312,
          contacts: 28,
          status: "active",
          featuredPlan: {
            plan: "destaque",
            startedAt: daysAgo(5),
            expiresAt: addDays(daysAgo(5), 30),
            price: "R$ 49,90",
            durationDays: 30,
          },
        },
        {
          id: "a2",
          title: "Saldo Malha Ribana Colorida",
          category: "Saldos",
          price: "R$ 8,00/kg",
          unit: "kg",
          city: "São Paulo",
          uf: "SP",
          publishedAt: daysAgo(62),
          expiresAt: addDays(daysAgo(62), 60),
          views: 187,
          contacts: 14,
          status: "expired",
        },
        {
          id: "a3",
          title: "Tecido Oxford Liso 150cm — Cáqui",
          category: "Tecidos",
          price: "R$ 11,00/metro",
          unit: "metro",
          city: "São Paulo",
          uf: "SP",
          publishedAt: daysAgo(10),
          expiresAt: addDays(daysAgo(10), 60),
          views: 54,
          contacts: 6,
          status: "active",
        },
        {
          id: "a4",
          title: "Fio 100% Algodão 30/2 — Cone 500g",
          category: "Fios & Aviamentos",
          price: "R$ 14,50/cone",
          unit: "cone",
          city: "São Paulo",
          uf: "SP",
          publishedAt: daysAgo(20),
          expiresAt: addDays(daysAgo(20), 60),
          views: 98,
          contacts: 9,
          status: "paused",
        },
      ],
    },
  },
};

function loadUsers(): Record<string, { password: string; user: AuthUser }> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEMO_USERS, ...JSON.parse(raw) };
  } catch { /* */ }
  return { ...DEMO_USERS };
}

function saveUsers(users: Record<string, { password: string; user: AuthUser }>) {
  const without = { ...users };
  delete without["demo@fornecedortextil.com.br"];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(without));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      const users = loadUsers();
      const entry = users[session];
      if (entry) setUser(entry.user);
    }
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    const users = loadUsers();
    const entry = users[email.toLowerCase()];
    if (!entry) return { ok: false, error: "E-mail não encontrado." };
    if (entry.password !== password) return { ok: false, error: "Senha incorreta." };
    setUser(entry.user);
    localStorage.setItem(SESSION_KEY, email.toLowerCase());
    return { ok: true };
  };

  const register = async (data: RegisterData) => {
    await new Promise((r) => setTimeout(r, 800));
    const users = loadUsers();
    if (users[data.email.toLowerCase()]) return { ok: false, error: "E-mail já cadastrado." };
    const newUser: AuthUser = {
      id: `u${Date.now()}`,
      email: data.email.toLowerCase(),
      companyName: data.companyName,
      cnpj: data.cnpj,
      city: data.city,
      uf: data.uf,
      ads: [],
    };
    users[data.email.toLowerCase()] = { password: data.password, user: newUser };
    saveUsers(users);
    setUser(newUser);
    localStorage.setItem(SESSION_KEY, data.email.toLowerCase());
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateAd = (adId: string, patch: Partial<UserAd>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        ads: prev.ads.map((a) => (a.id === adId ? { ...a, ...patch } : a)),
      };
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        const users = loadUsers();
        if (users[session]) {
          users[session].user = updated;
          saveUsers(users);
        }
      }
      return updated;
    });
  };

  const renewAd = (adId: string) => {
    const now = new Date().toISOString();
    updateAd(adId, { publishedAt: now, expiresAt: addDays(now, 60), status: "active" });
  };

  const pauseAd = (adId: string) => updateAd(adId, { status: "paused" });
  const resumeAd = (adId: string) => updateAd(adId, { status: "active" });

  const upgradePlan = (adId: string, plan: Exclude<PlanType, "basic">) => {
    const cfg = PLAN_CONFIG[plan];
    const now = new Date().toISOString();
    updateAd(adId, {
      featuredPlan: {
        plan,
        startedAt: now,
        expiresAt: addDays(now, cfg.days),
        price: cfg.price,
        durationDays: cfg.days,
      },
    });
  };

  const cancelPlan = (adId: string) => {
    updateAd(adId, { featuredPlan: undefined });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, renewAd, pauseAd, resumeAd, upgradePlan, cancelPlan }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function isFeatureActive(fp?: FeaturedPlan): boolean {
  if (!fp) return false;
  return new Date(fp.expiresAt).getTime() > Date.now();
}
