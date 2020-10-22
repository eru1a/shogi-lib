// prettier-ignore
export type PieceType =
  |  "P" |  "L" |  "N" |  "S" |  "G" |  "B" |  "R" | "K"
  | "+P" | "+L" | "+N" | "+S" |        "+B" | "+R" ;

export function toUSI(pt: PieceType): string {
  // prettier-ignore
  switch (pt) {
    case "P": return "P";
    case "L": return "L";
    case "N": return "N";
    case "S": return "S";
    case "G": return "G";
    case "B": return "B";
    case "R": return "R";
    case "K": return "K";
    case "+P": return "P";
    case "+L": return "L";
    case "+N": return "N";
    case "+S": return "S";
    case "+B": return "B";
    case "+R": return "R";
  }
}

export function fromUSI(usi: string): PieceType | Error {
  // prettier-ignore
  switch (usi) {
    case "P": return "P";
    case "L": return "L";
    case "N": return "N";
    case "S": return "S";
    case "G": return "G";
    case "B": return "B";
    case "R": return "R";
    case "K": return "K";
    case "+P": return "+P";
    case "+L": return "+L";
    case "+N": return "+N";
    case "+S": return "+S";
    case "+B": return "+B";
    case "+R": return "+R";
    default: return new Error(`pieceTypeFromUSI: invalid usi: "${usi}"`);
  }
}

export function promote(pt: PieceType): PieceType {
  switch (pt) {
    case "P":
    case "+P":
      return "+P";
    case "L":
    case "+L":
      return "+L";
    case "N":
    case "+N":
      return "+N";
    case "S":
    case "+S":
      return "+S";
    case "G":
      return "G";
    case "B":
    case "+B":
      return "+B";
    case "R":
    case "+R":
      return "+R";
    case "K":
      return "K";
  }
}

export function demote(pt: PieceType): PieceType {
  switch (pt) {
    case "P":
    case "+P":
      return "P";
    case "L":
    case "+L":
      return "L";
    case "N":
    case "+N":
      return "N";
    case "S":
    case "+S":
      return "S";
    case "G":
      return "G";
    case "B":
    case "+B":
      return "B";
    case "R":
    case "+R":
      return "R";
    case "K":
      return "K";
  }
}
