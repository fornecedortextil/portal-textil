import { Shirt, Layers, Scissors, Wrench, Tag } from "lucide-react";
import type { Category } from "../data";

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const map: Record<string, typeof Shirt> = {
    "Tecidos":           Layers,
    "Malhas":            Shirt,
    "Fios & Aviamentos": Scissors,
    "Maquinário":        Wrench,
    "Saldos":            Tag,
  };
  const Icon = map[name as Category] ?? Layers;
  return <Icon className={className} />;
}
