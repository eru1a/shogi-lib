export const files = ["9", "8", "7", "6", "5", "4", "3", "2", "1"] as const;
export type File = typeof files[number];

/** "9" -> 0, "8" -> 1, ..., "1" -> 8 */
export function toX(file: File): number {
  return files.indexOf(file);
}

/** 0 -> "9", 1 -> "8", ..., 8 -> "1" */
export function fromX(x: number): File | Error {
  return files[x] ?? new Error("File.fromX: x should be 0<=x<=8 ${x}");
}

export function toUSI(file: File): string {
  // prettier-ignore
  switch (file) {
    case "9": return "9";
    case "8": return "8";
    case "7": return "7";
    case "6": return "6";
    case "5": return "5";
    case "4": return "4";
    case "3": return "3";
    case "2": return "2";
    case "1": return "1";
  }
}

export function fromUSI(usi: string): File | Error {
  // prettier-ignore
  switch (usi) {
    case "9": return "9";
    case "8": return "8";
    case "7": return "7";
    case "6": return "6";
    case "5": return "5";
    case "4": return "4";
    case "3": return "3";
    case "2": return "2";
    case "1": return "1";
    default: return new Error(`File.fromUSI: invalid usi: ${usi}`);
  }
}

export function toKIF(file: File): string {
  // prettier-ignore
  switch (file) {
    case "9": return "９";
    case "8": return "８";
    case "7": return "７";
    case "6": return "６";
    case "5": return "５";
    case "4": return "４";
    case "3": return "３";
    case "2": return "２";
    case "1": return "１";
  }
}

export function fromKIF(kif: string): File | Error {
  // prettier-ignore
  switch (kif) {
    case "９": return "9";
    case "８": return "8";
    case "７": return "7";
    case "６": return "6";
    case "５": return "5";
    case "４": return "4";
    case "３": return "3";
    case "２": return "2";
    case "１": return "1";
    default: return new Error(`File.fromKIF: invalid kif: ${kif}`);
  }
}

export function toSuuji(file: File): string {
  // prettier-ignore
  switch (file) {
    case "9": return "9";
    case "8": return "8";
    case "7": return "7";
    case "6": return "6";
    case "5": return "5";
    case "4": return "4";
    case "3": return "3";
    case "2": return "2";
    case "1": return "1";
  }
}

export function fromSuuji(suuji: string): File | Error {
  // prettier-ignore
  switch (suuji) {
    case "9": return "9";
    case "8": return "8";
    case "7": return "7";
    case "6": return "6";
    case "5": return "5";
    case "4": return "4";
    case "3": return "3";
    case "2": return "2";
    case "1": return "1";
    default: return new Error(`File.fromSuuji: invalid suuji: ${suuji}`);
  }
}
