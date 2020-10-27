import * as PieceType from "./pieceType";
import * as Square from "./square";

export type NormalMove = {
  type: "normal";
  from: Square.Square;
  to: Square.Square;
  promotion: boolean;
};

export type DropMove = { type: "drop"; to: Square.Square; pieceType: PieceType.PieceType };

/** 指し手を表す型。USI形式の指し手を表現するのに必要な最低限のデータしか持たない。 */
export type Move = NormalMove | DropMove;

export function toUSI(move: Move): string {
  switch (move.type) {
    case "normal": {
      const from = Square.toUSI(move.from);
      const to = Square.toUSI(move.to);
      const promotion = move.promotion ? "+" : "";
      return `${from}${to}${promotion}`;
    }
    case "drop": {
      const pieceType = PieceType.toUSI(move.pieceType);
      const to = Square.toUSI(move.to);
      return `${pieceType}*${to}`;
    }
  }
}

export function fromUSI(usi: string): Move | Error {
  if (usi.length < 4 || usi.length > 5) {
    return new Error(`moveFromUSI: usi length should be 4 or 5: ${usi}`);
  }
  if (usi.length === 4 && usi[1] === "*") {
    const pieceType = PieceType.fromUSI(usi[0]);
    if (pieceType instanceof Error) {
      return new Error(`moveFromUSI: invalid drop move 'PieceType usi': ${usi} ${pieceType}`);
    }
    const to = Square.fromUSI(usi.substring(2, 4));
    if (to instanceof Error) {
      return new Error(`moveFromUSI: invalid drop move 'To usi': ${usi} ${to}`);
    }
    return { type: "drop", to, pieceType };
  }
  const from = Square.fromUSI(usi.substring(0, 2));
  const to = Square.fromUSI(usi.substring(2, 4));
  if (from instanceof Error || to instanceof Error) {
    return new Error(`Move.fromUSI: invalid normal move: ${usi}`);
  }
  if (usi.length === 4) {
    return { type: "normal", from, to, promotion: false };
  }
  if (usi.length === 5 && usi[4] === "+") {
    return { type: "normal", from, to, promotion: true };
  }
  return new Error(`Move.fromUSI: 5th char should be '+': ${usi}`);
}

export function equal(m1: Move, m2: Move): boolean {
  if (m1.type === "normal" && m2.type === "normal") {
    return m1.from === m2.from && m1.to === m2.to && m1.promotion === m2.promotion;
  }
  if (m1.type === "drop" && m2.type === "drop") {
    return m1.pieceType === m2.pieceType && m1.to === m2.to;
  }
  return false;
}
