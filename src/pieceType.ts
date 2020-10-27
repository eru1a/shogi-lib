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
    case "+P": return "+P";
    case "+L": return "+L";
    case "+N": return "+N";
    case "+S": return "+S";
    case "+B": return "+B";
    case "+R": return "+R";
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
    default: return new Error(`PieceType.fromUSI: invalid usi: "${usi}"`);
  }
}

// TODO: 成香とかを1文字で表すオプションを引数に渡せるようにする
export function toKIF(pt: PieceType): string {
  // prettier-ignore
  switch (pt) {
    case "P": return "歩";
    case "L": return "香";
    case "N": return "桂";
    case "S": return "銀";
    case "G": return "金";
    case "B": return "角";
    case "R": return "飛";
    case "K": return "玉";
    case "+P": return "と";
    case "+L": return "成香";
    case "+N": return "成桂";
    case "+S": return "成銀";
    case "+B": return "馬";
    case "+R": return "龍";
  }
}

export function fromKIF(kif: string): PieceType | Error {
  // prettier-ignore
  switch (kif) {
    case "歩": return "P";
    case "香": return "L";
    case "桂": return "N";
    case "銀": return "S";
    case "金": return "G";
    case "角": return "B";
    case "飛": return "R";
    case "玉": case "王": return "K";
    case "と": case "と金": return "+P";
    case "杏": case "成香": return "+L";
    case "圭": case "成桂": return "+N";
    case "全": case "成銀": return "+S";
    case "馬": return "+B";
    case "龍": case "竜": return "+R";
    default: return new Error(`PieceType.fromKIF: invalid kif: "${kif}"`);
  }
}

export function promote(pt: PieceType): PieceType {
  // prettier-ignore
  switch (pt) {
    case "P": case "+P": return "+P";
    case "L": case "+L": return "+L";
    case "N": case "+N": return "+N";
    case "S": case "+S": return "+S";
    case "G": return "G";
    case "B": case "+B": return "+B";
    case "R": case "+R": return "+R";
    case "K": return "K";
  }
}

export function demote(pt: PieceType): PieceType {
  // prettier-ignore
  switch (pt) {
    case "P": case "+P": return "P";
    case "L": case "+L": return "L";
    case "N": case "+N": return "N";
    case "S": case "+S": return "S";
    case "G": return "G";
    case "B": case "+B": return "B";
    case "R": case "+R": return "R";
    case "K": return "K";
  }
}
