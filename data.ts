export type Category = "Tecidos" | "Malhas" | "Fios & Aviamentos" | "Maquinário" | "Saldos";

export const CATEGORIES: Category[] = [
  "Tecidos",
  "Malhas",
  "Fios & Aviamentos",
  "Maquinário",
  "Saldos",
];

export const CATEGORY_META: Record<Category, { blurb: string }> = {
  "Tecidos":          { blurb: "Planos, estampados e técnicos" },
  "Malhas":           { blurb: "Algodão, poliéster e elastano" },
  "Fios & Aviamentos":{ blurb: "Linhas, elásticos e botões" },
  "Maquinário":       { blurb: "Novas e seminovas" },
  "Saldos":           { blurb: "Peças e rolos com desconto" },
};

export const UFS = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA",
  "MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN",
  "RO","RR","RS","SC","SE","SP","TO",
];

export interface ProductSpecs {
  metragem?: string;
  largura?: string;
  composicao?: string;
  gramatura?: string;
  cores?: string;
  rendimento?: string;
  potencia?: string;
  velocidade?: string;
  voltagem?: string;
  titulo?: string;
  elasticidade?: string;
  acabamento?: string;
}

export interface Product {
  id: string;
  title: string;
  category: Category;
  price: string;
  unit: string;
  minOrder: string;
  seller: string;
  city: string;
  uf: string;
  description: string;
  badge?: string;
  origin?: "brasil" | "china";
  specs?: ProductSpecs;
  photos?: string[];
}

export interface SellerProfile {
  name: string;
  cnpj: string;
  description: string;
  city: string;
  uf: string;
  memberSince: string;
  phone: string;
  specialties: string[];
  employees?: string;
  website?: string;
}

export const SELLERS: Record<string, SellerProfile> = {
  "Textilaria Progresso": {
    name: "Textilaria Progresso Ltda.",
    cnpj: "12.345.678/0001-99",
    description: "Fabricante e distribuidora de malhas e tecidos há mais de 20 anos no mercado têxtil paulista. Especializada em malhas de algodão e ribana para confecções de médio e grande porte.",
    city: "São Paulo",
    uf: "SP",
    memberSince: "2022-03",
    phone: "5511999990001",
    specialties: ["Malhas", "Saldos", "Algodão"],
    employees: "50–200",
  },
  "Distribuidora Fiação Sul": {
    name: "Distribuidora Fiação Sul Ltda.",
    cnpj: "23.456.789/0001-11",
    description: "Distribuidora catarinense com foco em tecidos planos para uniformes e artigos técnicos. Atende todo o sul do país com entrega rápida.",
    city: "Blumenau",
    uf: "SC",
    memberSince: "2021-08",
    phone: "5547999990002",
    specialties: ["Tecidos", "Oxford", "Uniformes"],
    employees: "10–50",
  },
  "MáquinasTex SP": {
    name: "MáquinasTex SP Comércio Ltda.",
    cnpj: "34.567.890/0001-22",
    description: "Comércio e manutenção de máquinas de costura industriais. Revisão completa e garantia em todos os equipamentos. Peças originais e assistência técnica.",
    city: "Santo André",
    uf: "SP",
    memberSince: "2020-05",
    phone: "5511999990003",
    specialties: ["Maquinário", "Overlock", "Reta Industrial"],
    employees: "10–50",
  },
  "Aviamentos Meridional": {
    name: "Aviamentos Meridional S.A.",
    cnpj: "45.678.901/0001-33",
    description: "Maior distribuidora de aviamentos do Nordeste. Elásticos, linhas, botões e fechos para toda a cadeia produtiva têxtil.",
    city: "Fortaleza",
    uf: "CE",
    memberSince: "2023-01",
    phone: "5585999990004",
    specialties: ["Aviamentos", "Elásticos", "Linhas"],
    employees: "10–50",
  },
  "Fashion Saldos": {
    name: "Fashion Saldos Têxteis Ltda.",
    cnpj: "56.789.012/0001-44",
    description: "Especialista em liquidação de estoques têxteis. Adquirimos e revendemos saldos de fábricas e importadores com preços abaixo do mercado.",
    city: "Americana",
    uf: "SP",
    memberSince: "2022-11",
    phone: "5519999990005",
    specialties: ["Saldos", "Viscose", "Estampados"],
    employees: "1–10",
  },
  "Sport Malhas Nordeste": {
    name: "Sport Malhas Nordeste Ind. e Com. Ltda.",
    cnpj: "67.890.123/0001-55",
    description: "Fabricante de malhas técnicas para linha esportiva e fitness. Produção própria com tingimento e acabamento internos.",
    city: "Recife",
    uf: "PE",
    memberSince: "2021-03",
    phone: "5581999990006",
    specialties: ["Malhas", "Dry-Fit", "Fitness"],
    employees: "50–200",
  },
  "Indústria Têxtil Centro-Oeste": {
    name: "Indústria Têxtil Centro-Oeste S.A.",
    cnpj: "78.901.234/0001-66",
    description: "Maior produtora de brim e tecidos pesados do Centro-Oeste. Atende o agronegócio, construção civil e setor industrial com tecidos de alta resistência.",
    city: "Goiânia",
    uf: "GO",
    memberSince: "2020-09",
    phone: "5562999990007",
    specialties: ["Tecidos", "Brim", "Industrial"],
    employees: "200+",
  },
  "Oficina das Máquinas": {
    name: "Oficina das Máquinas Ltda.",
    cnpj: "89.012.345/0001-77",
    description: "Especialistas em revenda e manutenção de máquinas de costura industriais. Mais de 15 anos de experiência em Belo Horizonte e região.",
    city: "Belo Horizonte",
    uf: "MG",
    memberSince: "2023-04",
    phone: "5531999990008",
    specialties: ["Maquinário", "Reta Industrial", "Singer"],
    employees: "1–10",
  },
  "FioSul Distribuição": {
    name: "FioSul Distribuição de Fios Ltda.",
    cnpj: "90.123.456/0001-88",
    description: "Distribuidora gaúcha de fios e linhas para malharia e tecelagem. Estoque permanente com mais de 80 títulos diferentes de fio de algodão e sintético.",
    city: "Porto Alegre",
    uf: "RS",
    memberSince: "2021-06",
    phone: "5551999990009",
    specialties: ["Fios", "Algodão", "Malharia"],
    employees: "10–50",
  },
  "Neoprene Brasil": {
    name: "Neoprene Brasil Com. Imp. Ltda.",
    cnpj: "01.234.567/0001-99",
    description: "Importador direto e distribuidor exclusivo de neoprene e materiais técnicos para a indústria de calçados, bolsas e moda.",
    city: "Rio de Janeiro",
    uf: "RJ",
    memberSince: "2022-07",
    phone: "5521999990010",
    specialties: ["Tecidos", "Neoprene", "Importação"],
    employees: "10–50",
  },
  "Import Têxtil China": {
    name: "Import Têxtil China Ltda.",
    cnpj: "11.222.333/0001-00",
    description: "Importadora direta de tecidos e malhas da China. Escritório em Guangzhou com seleção rigorosa de fábricas certificadas. Despacho aduaneiro incluso.",
    city: "São Paulo",
    uf: "SP",
    memberSince: "2020-02",
    phone: "5511999990011",
    specialties: ["Importação", "Crepe", "Georgette"],
    employees: "10–50",
    website: "importextilchina.com.br",
  },
};

function photos(seed: string): string[] {
  return [
    `https://picsum.photos/seed/${seed}-a/480/360`,
    `https://picsum.photos/seed/${seed}-b/480/360`,
    `https://picsum.photos/seed/${seed}-c/480/360`,
    `https://picsum.photos/seed/${seed}-d/480/360`,
  ];
}

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Malha 100% Algodão 30/1 Penteado",
    category: "Malhas",
    price: "R$ 18,50",
    unit: "kg",
    minOrder: "100 kg",
    seller: "Textilaria Progresso",
    city: "São Paulo",
    uf: "SP",
    description: "Malha de alta qualidade para confecção de camisetas e moda praia. Disponível em diversas cores com excelente fixação de tintura.",
    badge: "Destaque",
    photos: photos("p1"),
    specs: {
      composicao: "100% Algodão Penteado",
      gramatura: "160 g/m²",
      largura: "180 cm",
      metragem: "Rolos de 20–40 kg",
      cores: "Mais de 40 cores disponíveis",
      acabamento: "Compactado antiencolhimento",
    },
  },
  {
    id: "p2",
    title: "Tecido Oxford Liso 150cm",
    category: "Tecidos",
    price: "R$ 12,90",
    unit: "metro",
    minOrder: "200 m",
    seller: "Distribuidora Fiação Sul",
    city: "Blumenau",
    uf: "SC",
    description: "Oxford 100% poliéster, ideal para uniformes, bolsas e mochila. Alta resistência à abrasão e fácil manutenção.",
    photos: photos("p2"),
    specs: {
      composicao: "100% Poliéster",
      gramatura: "120 g/m²",
      largura: "150 cm",
      metragem: "Rolos de 100 metros",
      cores: "Branco, preto, azul, cáqui, cinza",
      acabamento: "Liso, sem tratamento impermeável",
    },
  },
  {
    id: "p3",
    title: "Máquina Overlock Industrial 5 Fios",
    category: "Maquinário",
    price: "R$ 4.200,00",
    unit: "unid.",
    minOrder: "1 unid.",
    seller: "MáquinasTex SP",
    city: "Santo André",
    uf: "SP",
    description: "Overloque industrial seminova, revisada e com garantia de 6 meses. Ideal para costuras de malhas e malharia em geral.",
    badge: "Seminova",
    photos: photos("p3"),
    specs: {
      potencia: "550 W — Motor servo",
      velocidade: "Até 6.500 RPM",
      voltagem: "220V monofásico",
      acabamento: "5 fios — corrente e cobertura",
    },
  },
  {
    id: "p4",
    title: "Elástico Chato 2cm — Rolo 100m",
    category: "Fios & Aviamentos",
    price: "R$ 38,00",
    unit: "rolo",
    minOrder: "10 rolos",
    seller: "Aviamentos Meridional",
    city: "Fortaleza",
    uf: "CE",
    description: "Elástico de alta elasticidade e durabilidade para lingerie e fitness. Aprovado pelas principais confecções do Nordeste.",
    photos: photos("p4"),
    specs: {
      largura: "2 cm (20 mm)",
      composicao: "78% Poliéster / 22% Elastano",
      metragem: "100 metros por rolo",
      elasticidade: "Até 150% de alongamento",
      cores: "Branco e preto",
      acabamento: "Bordas firmes antidesfiamento",
    },
  },
  {
    id: "p5",
    title: "Saldo de Tecido Viscose Estampado",
    category: "Saldos",
    price: "R$ 6,00",
    unit: "metro",
    minOrder: "50 m",
    seller: "Fashion Saldos",
    city: "Americana",
    uf: "SP",
    description: "Rolos com 30–80m cada, estampas variadas. Perfeito para saídas de praia, blusas femininas e moda casual.",
    badge: "Liquidação",
    photos: photos("p5"),
    specs: {
      composicao: "100% Viscose",
      gramatura: "90–110 g/m²",
      largura: "145 cm",
      metragem: "Rolos de 30 a 80 metros",
      cores: "Estampas variadas — florais e geométricas",
      acabamento: "Estampa digital e rotativa",
    },
  },
  {
    id: "p6",
    title: "Malha Dry-Fit Poliéster 100%",
    category: "Malhas",
    price: "R$ 22,00",
    unit: "kg",
    minOrder: "50 kg",
    seller: "Sport Malhas Nordeste",
    city: "Recife",
    uf: "PE",
    description: "Ideal para linha fitness e uniformes esportivos. Propriedade de gestão de umidade e secagem ultrarrápida.",
    photos: photos("p6"),
    specs: {
      composicao: "100% Poliéster",
      gramatura: "140–180 g/m² (a pedido)",
      largura: "165 cm",
      metragem: "Rolos de 15–30 kg",
      cores: "16 cores disponíveis",
      acabamento: "Tratamento anti-odor e dry-fit",
    },
  },
  {
    id: "p7",
    title: "Tecido Brim Pesado 12oz — Cor Cáqui",
    category: "Tecidos",
    price: "R$ 19,90",
    unit: "metro",
    minOrder: "100 m",
    seller: "Indústria Têxtil Centro-Oeste",
    city: "Goiânia",
    uf: "GO",
    description: "Brim pesado para confecção de calças, macacões e jalecos industriais. Alta resistência e durabilidade.",
    photos: photos("p7"),
    specs: {
      composicao: "100% Algodão",
      gramatura: "340 g/m² (12 oz)",
      largura: "160 cm",
      metragem: "Rolos de 100 metros",
      cores: "Cáqui, verde exército, azul marinho, bege",
      acabamento: "Sanfor e mercerizado",
    },
  },
  {
    id: "p8",
    title: "Reta Industrial Singer 20U — Revisada",
    category: "Maquinário",
    price: "R$ 1.800,00",
    unit: "unid.",
    minOrder: "1 unid.",
    seller: "Oficina das Máquinas",
    city: "Belo Horizonte",
    uf: "MG",
    description: "Máquina reta industrial Singer revisada com mesa de madeira e motor servo. Ponto regulável e lubrificação automática.",
    badge: "Seminova",
    photos: photos("p8"),
    specs: {
      potencia: "400 W — Motor servo silencioso",
      velocidade: "Até 5.500 pontos/min",
      voltagem: "110V ou 220V",
      acabamento: "Ponto reto — agulha 135×17",
    },
  },
  {
    id: "p9",
    title: "Fio 100% Algodão 30/2 — Cone 500g",
    category: "Fios & Aviamentos",
    price: "R$ 14,50",
    unit: "cone",
    minOrder: "24 cones",
    seller: "FioSul Distribuição",
    city: "Porto Alegre",
    uf: "RS",
    description: "Fio de algodão cru para malharia e tecelagem circular e retilínea. Alta regularidade e resistência à ruptura.",
    photos: photos("p9"),
    specs: {
      titulo: "Ne 30/2",
      composicao: "100% Algodão Cardado",
      metragem: "~2.400 m/cone (500g)",
      elasticidade: "Torção S/Z — Regular",
      cores: "Cru, branco alvejado",
      acabamento: "Cardado — alta resistência",
    },
  },
  {
    id: "p10",
    title: "Tecido Neoprene Liso — Várias Cores",
    category: "Tecidos",
    price: "R$ 32,00",
    unit: "metro",
    minOrder: "30 m",
    seller: "Neoprene Brasil",
    city: "Rio de Janeiro",
    uf: "RJ",
    description: "Neoprene 3mm, perfeito para bolsas, calçados e acessórios de moda. Fácil de costurar e com excelente caimento.",
    badge: "Novo",
    photos: photos("p10"),
    specs: {
      composicao: "85% Neoprene / 15% Poliéster",
      gramatura: "450 g/m² (3mm)",
      largura: "150 cm",
      metragem: "Rolos de 25 metros",
      cores: "14 cores sólidas + estampados",
      acabamento: "Dupla face — jersey interno",
    },
  },
  {
    id: "p11",
    title: "Saldo Malha Ribana Colorida",
    category: "Saldos",
    price: "R$ 8,00",
    unit: "kg",
    minOrder: "20 kg",
    seller: "Textilaria Progresso",
    city: "São Paulo",
    uf: "SP",
    description: "Ribana colorida em estoque — rolos de 10 a 30 kg. Cores sortidas, ideal para complemento de coleções.",
    badge: "Liquidação",
    photos: photos("p11"),
    specs: {
      composicao: "92% Algodão / 8% Elastano",
      gramatura: "220 g/m²",
      largura: "75 cm (tubular)",
      metragem: "Rolos de 10 a 30 kg",
      cores: "Sortidas — mais de 20 cores",
      acabamento: "Compactado — levemente encorpado",
    },
  },
  {
    id: "p12",
    title: "Tecido Crepe Georgette Importado",
    category: "Tecidos",
    price: "R$ 28,00",
    unit: "metro",
    minOrder: "50 m",
    seller: "Import Têxtil China",
    city: "São Paulo",
    uf: "SP",
    description: "Georgette importado da China — leve, fluido e com excelente caimento para vestuário feminino premium.",
    origin: "china",
    badge: "Importado",
    photos: photos("p12"),
    specs: {
      composicao: "100% Poliéster",
      gramatura: "65–75 g/m²",
      largura: "150 cm",
      metragem: "Rolos de 50 metros",
      cores: "Sólidos e estampados digitais",
      acabamento: "Crepe georgette — superfície texturizada",
    },
  },
];

export const CHINA_PRODUCTS: Product[] = [
  {
    id: "c1",
    title: "Tecido Seda Artificial Estampado",
    category: "Tecidos",
    price: "US$ 2,80",
    unit: "metro",
    minOrder: "500 m",
    seller: "Suzhou Silk Co.",
    city: "Suzhou",
    uf: "SP",
    description: "Seda artificial com estampas digitais exclusivas. MOQ para importação. Prova de cor disponível.",
    origin: "china",
    badge: "Importação direta",
    photos: photos("c1"),
    specs: {
      composicao: "100% Viscose (seda artificial)",
      gramatura: "75 g/m²",
      largura: "140 cm",
      metragem: "Rolos de 100 metros",
      cores: "Estampas digitais — 200+ opções",
      acabamento: "Brilho satinado",
    },
  },
  {
    id: "c2",
    title: "Malha Spandex 80/20 — Alta Performance",
    category: "Malhas",
    price: "US$ 4,50",
    unit: "kg",
    minOrder: "200 kg",
    seller: "Guangzhou Knit Factory",
    city: "Guangzhou",
    uf: "SP",
    description: "Spandex premium 80% poliamida 20% elastano para linha fitness e lingerie. Certificação OEKO-TEX®.",
    origin: "china",
    badge: "Fábrica direta",
    photos: photos("c2"),
    specs: {
      composicao: "80% Poliamida / 20% Elastano",
      gramatura: "200–240 g/m²",
      largura: "160 cm",
      metragem: "Rolos de 20 kg",
      elasticidade: "Bidirecional — 4 vias",
      acabamento: "Suave ao toque, opaco",
    },
  },
  {
    id: "c3",
    title: "Reta Industrial Jack F4 — Série 2024",
    category: "Maquinário",
    price: "US$ 320,00",
    unit: "unid.",
    minOrder: "5 unid.",
    seller: "Jack Sewing Machines",
    city: "Taizhou",
    uf: "SP",
    description: "Reta industrial Jack nova, motor servo, controle eletrônico. Negociação direta entre as partes. Certificação CE.",
    origin: "china",
    badge: "Fábrica direta",
    photos: photos("c3"),
    specs: {
      potencia: "550 W — Motor servo brushless",
      velocidade: "Até 5.500 pontos/min",
      voltagem: "220V monofásico",
      acabamento: "Ponto reto — lubrificação automática",
    },
  },
  {
    id: "c4",
    title: "Tecido Oxford 600D Impermeável",
    category: "Tecidos",
    price: "US$ 1,90",
    unit: "metro",
    minOrder: "1000 m",
    seller: "Zhejiang Textile Group",
    city: "Hangzhou",
    uf: "SP",
    description: "Oxford 600D impermeável PU coating. Ideal para bolsas, mochilas e tendas. Certificado REACH.",
    origin: "china",
    badge: "Importação direta",
    photos: photos("c4"),
    specs: {
      composicao: "100% Poliéster 600D",
      gramatura: "300 g/m²",
      largura: "150 cm",
      metragem: "Rolos de 500 metros",
      cores: "32 cores sólidas",
      acabamento: "PU coating impermeável 2000mm",
    },
  },
];
