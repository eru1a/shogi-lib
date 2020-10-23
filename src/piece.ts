import * as Color from "./color";
import * as PieceType from "./pieceType";
import * as Square from "./square";

// prettier-ignore
export type Piece =
  |  "P" |  "L" |  "N" |  "S" |  "G" |  "B" |  "R" | "K"
  | "+P" | "+L" | "+N" | "+S" |        "+B" | "+R"
  |  "p" |  "l" |  "n" |  "s" |  "g" |  "b" |  "r" | "k"
  | "+p" | "+l" | "+n" | "+s" |        "+b" | "+r" ;

export function make(pt: PieceType.PieceType, c: Color.Color): Piece {
  switch (pt) {
    case "P":
      if (c === "b") return "P";
      else return "p";
    case "L":
      if (c === "b") return "L";
      else return "l";
    case "N":
      if (c === "b") return "N";
      else return "n";
    case "S":
      if (c === "b") return "S";
      else return "s";
    case "G":
      if (c === "b") return "G";
      else return "g";
    case "B":
      if (c === "b") return "B";
      else return "b";
    case "R":
      if (c === "b") return "R";
      else return "r";
    case "K":
      if (c === "b") return "K";
      else return "k";
    case "+P":
      if (c === "b") return "+P";
      else return "+p";
    case "+L":
      if (c === "b") return "+L";
      else return "+l";
    case "+N":
      if (c === "b") return "+N";
      else return "+n";
    case "+S":
      if (c === "b") return "+S";
      else return "+s";
    case "+B":
      if (c === "b") return "+B";
      else return "+b";
    case "+R":
      if (c === "b") return "+R";
      else return "+r";
  }
}

export function toUSI(p: Piece): string {
  // prettier-ignore
  switch (p) {
    case "P": return "P";
    case "p": return "p";
    case "L": return "L";
    case "l": return "l";
    case "N": return "N";
    case "n": return "n";
    case "S": return "S";
    case "s": return "s";
    case "G": return "G";
    case "g": return "g";
    case "B": return "B";
    case "b": return "b";
    case "R": return "R";
    case "r": return "r";
    case "K": return "K";
    case "k": return "k";
    case "+P": return "+P";
    case "+p": return "+p";
    case "+L": return "+L";
    case "+l": return "+l";
    case "+N": return "+N";
    case "+n": return "+n";
    case "+S": return "+S";
    case "+s": return "+s";
    case "+B": return "+B";
    case "+b": return "+b";
    case "+R": return "+R";
    case "+r": return "+r";
  }
}

export function fromUSI(usi: string): Piece | Error {
  // prettier-ignore
  switch (usi) {
    case "P": return "P";
    case "p": return "p";
    case "L": return "L";
    case "l": return "l";
    case "N": return "N";
    case "n": return "n";
    case "S": return "S";
    case "s": return "s";
    case "G": return "G";
    case "g": return "g";
    case "B": return "B";
    case "b": return "b";
    case "R": return "R";
    case "r": return "r";
    case "K": return "K";
    case "k": return "k";
    case "+P": return "+P";
    case "+p": return "+p";
    case "+L": return "+L";
    case "+l": return "+l";
    case "+N": return "+N";
    case "+n": return "+n";
    case "+S": return "+S";
    case "+s": return "+s";
    case "+B": return "+B";
    case "+b": return "+b";
    case "+R": return "+R";
    case "+r": return "+r";
    default: return new Error(`pieceFromUSI: invalid usi: "${usi}"`);
  }
}

export function color(p: Piece): Color.Color {
  switch (p) {
    case "P":
    case "L":
    case "N":
    case "S":
    case "G":
    case "B":
    case "R":
    case "K":
    case "+P":
    case "+L":
    case "+N":
    case "+S":
    case "+B":
    case "+R":
      return "b";
    case "p":
    case "l":
    case "n":
    case "s":
    case "g":
    case "b":
    case "r":
    case "k":
    case "+p":
    case "+l":
    case "+n":
    case "+s":
    case "+b":
    case "+r":
      return "w";
  }
}

export function colorInv(p: Piece): Piece {
  return make(pieceType(p), Color.inv(color(p)));
}

export function pieceType(p: Piece): PieceType.PieceType {
  switch (p) {
    case "P":
    case "p":
      return "P";
    case "L":
    case "l":
      return "L";
    case "N":
    case "n":
      return "N";
    case "S":
    case "s":
      return "S";
    case "G":
    case "g":
      return "G";
    case "B":
    case "b":
      return "B";
    case "R":
    case "r":
      return "R";
    case "K":
    case "k":
      return "K";
    case "+P":
    case "+p":
      return "+P";
    case "+L":
    case "+l":
      return "+L";
    case "+N":
    case "+n":
      return "+N";
    case "+S":
    case "+s":
      return "+S";
    case "+B":
    case "+b":
      return "+B";
    case "+R":
    case "+r":
      return "+R";
  }
}

export function promote(p: Piece): Piece {
  const pt = pieceType(p);
  const c = color(p);
  return make(PieceType.promote(pt), c);
}

export function demote(p: Piece): Piece {
  const pt = pieceType(p);
  const c = color(p);
  return make(PieceType.demote(pt), c);
}

function canPromoteSub(p: Piece, s: Square.Square): boolean {
  const r = Square.toFileRank(s).rank;
  if (promote(p) === p) return false;
  switch (p) {
    case "P":
    case "L":
    case "N":
    case "S":
    case "B":
    case "R":
      return r === "a" || r === "b" || r === "c";
    case "p":
    case "l":
    case "n":
    case "s":
    case "b":
    case "r":
      return r === "g" || r === "h" || r === "i";
  }
  return false;
}

export function canPromote(p: Piece, from: Square.Square, to: Square.Square): boolean {
  return canPromoteSub(p, from) || canPromoteSub(p, to);
}

export function needForcePromotion(p: Piece, s: Square.Square): boolean {
  const r = Square.toFileRank(s).rank;
  switch (p) {
    case "P":
      return r === "a";
    case "L":
      return r === "a";
    case "N":
      return r === "a" || r === "b";
    case "p":
      return r === "i";
    case "l":
      return r === "i";
    case "n":
      return r === "h" || r === "i";
  }
  return false;
}

// prettier-ignore
export const handPieces: Array<Piece> = ["R", "B", "G", "S", "N", "L", "P", "r", "b", "g", "s", "n", "l", "p",];
