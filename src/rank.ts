export const ranks = ["a", "b", "c", "d", "e", "f", "g", "h", "i"] as const;
export type Rank = typeof ranks[number];

/** "a" -> 0, "b" -> 1, ..., "c" -> 8 */
export function toY(rank: Rank): number {
  return ranks.indexOf(rank);
}

/** 0 -> "a", 1 -> "b", ..., 8 -> "c" */
export function fromY(y: number): Rank | Error {
  return ranks[y] ?? new Error("Rank.fromY: y should be 0<=y<=8 ${y}");
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
    default: return new Error(`Rank.fromUSI: invalid usi: ${usi}`);
  }
}

export function toKIF(rank: Rank): string {
  // prettier-ignore
  switch (rank) {
    case "a": return "一";
    case "b": return "二";
    case "c": return "三";
    case "d": return "四";
    case "e": return "五";
    case "f": return "六";
    case "g": return "七";
    case "h": return "八";
    case "i": return "九";
  }
}

export function fromKIF(kif: string): Rank | Error {
  // prettier-ignore
  switch (kif) {
    case "一": return "a";
    case "二": return "b";
    case "三": return "c";
    case "四": return "d";
    case "五": return "e";
    case "六": return "f";
    case "七": return "g";
    case "八": return "h";
    case "九": return "i";
    default: return new Error(`Rank.fromKIF: invalid kif: ${kif}`);
  }
}

export function toSuuji(rank: Rank): string {
  // prettier-ignore
  switch (rank) {
    case "a": return "1";
    case "b": return "2";
    case "c": return "3";
    case "d": return "4";
    case "e": return "5";
    case "f": return "6";
    case "g": return "7";
    case "h": return "8";
    case "i": return "9";
  }
}

export function fromSuuji(suuji: string): Rank | Error {
  // prettier-ignore
  switch (suuji) {
    case "1": return "a";
    case "2": return "b";
    case "3": return "c";
    case "4": return "d";
    case "5": return "e";
    case "6": return "f";
    case "7": return "g";
    case "8": return "h";
    case "9": return "i";
    default: return new Error(`Rank.fromSuuji: invalid suuji: ${suuji}`);
  }
}
