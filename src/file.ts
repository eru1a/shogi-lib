export const files = ["9", "8", "7", "6", "5", "4", "3", "2", "1"] as const;
export type File = typeof files[number];

export function toX(file: File): number {
  return files.indexOf(file);
}

export function fromX(x: number): File | Error {
  return files[x] ?? new Error("fileFromX: x should be 0<=x<=8 ${x}");
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
    default: return new Error(`fileFromUSI: invalid usi: ${usi}`);
  }
}
