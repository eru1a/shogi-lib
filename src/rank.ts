export const ranks = ["a", "b", "c", "d", "e", "f", "g", "h", "i"] as const;
export type Rank = typeof ranks[number];

export function toY(rank: Rank): number {
  return ranks.indexOf(rank);
}

export function fromY(y: number): Rank | Error {
  return ranks[y] ?? new Error("rankFromY: y should be 0<=y<=8 ${y}");
}

export function toUSI(rank: Rank): string {
  // prettier-ignore
  switch (rank) {
    case "a": return "a";
    case "b": return "b";
    case "c": return "c";
    case "d": return "d";
    case "e": return "e";
    case "f": return "f";
    case "g": return "g";
    case "h": return "h";
    case "i": return "i";
  }
}

export function fromUSI(usi: string): Rank | Error {
  // prettier-ignore
  switch (usi) {
    case "a": return "a";
    case "b": return "b";
    case "c": return "c";
    case "d": return "d";
    case "e": return "e";
    case "f": return "f";
    case "g": return "g";
    case "h": return "h";
    case "i": return "i";
    default: return new Error(`rankFromUSI: invalid usi: ${usi}`);
  }
}
