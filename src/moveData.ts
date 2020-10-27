import * as Move from "./move";
import * as Color from "./color";
import * as Piece from "./piece";
import * as Square from "./square";
import * as PieceType from "./pieceType";
import { Position } from "./position";

/** Moveより詳細なデータを持つ、指し手を表す型 */
// TODO:
//   千日手とか他にも色々
//   消費時間
export type MoveData =
  | {
      type: "md_normal";
      move: Move.NormalMove;
      turn: Color.Color;
      ply: number;
      // 動かした駒(fromにあった駒)
      piece: Piece.Piece;
      // 取った駒
      captured?: Piece.Piece;
      same: boolean;
    }
  | { type: "md_drop"; move: Move.DropMove; turn: Color.Color; ply: number }
  | { type: "md_initial" }
  | { type: "md_chudan"; turn: Color.Color; ply: number }
  | { type: "md_toryo"; turn: Color.Color; ply: number };

export function fromMove(
  move: Move.Move,
  position: Position,
  lastMove?: Move.Move
): MoveData | Error {
  if (move.type === "normal") {
    const piece = position.getPiece(move.from);
    if (piece === undefined) {
      return new Error(
        `MoveData.fromMove: no piece on from square: ${position.toSFEN()} ${Move.toUSI(move)}`
      );
    }
    const same = lastMove?.to === move.to ?? false;
    return {
      type: "md_normal",
      move,
      turn: position.turn,
      ply: position.ply + 1,
      piece,
      captured: position.getPiece(move.to),
      same,
    };
  }
  return {
    type: "md_drop",
    move,
    turn: position.turn,
    ply: position.ply + 1,
  };
}

export function move(moveData: MoveData): Move.Move | undefined {
  switch (moveData.type) {
    case "md_normal":
    case "md_drop":
      return moveData.move;
    default:
      return undefined;
  }
}

export function toKIF(
  moveData: MoveData,
  option?: { turnUnicode?: boolean }
): { ply?: number; turn?: string; move: string; from?: string } {
  const turnKIF = (turn: Color.Color) => {
    if (option?.turnUnicode ?? false) {
      return turn === "b" ? "☗" : "☖";
    }
    return turn === "b" ? "▲" : "△";
  };
  switch (moveData.type) {
    case "md_initial":
      return { move: "開始局面" };
    case "md_normal": {
      const ply = moveData.ply;
      const turn = turnKIF(moveData.turn);
      const from = `(${Square.toSuuji(moveData.move.from)})`;
      const to = Square.toKIF(moveData.move.to);
      let piece = PieceType.toKIF(Piece.pieceType(moveData.piece));
      if (moveData.move.promotion) piece += "成";

      if (moveData.same) {
        return { ply, turn, move: `同　${piece}`, from };
      }
      return { ply, turn, move: `${to}${piece}`, from };
    }
    case "md_drop": {
      const ply = moveData.ply;
      const turn = turnKIF(moveData.turn);
      const to = Square.toKIF(moveData.move.to);
      const piece = PieceType.toKIF(moveData.move.pieceType);

      return {
        ply,
        turn,
        move: `${to}${piece}打`,
      };
    }
    case "md_toryo": {
      const ply = moveData.ply;
      const turn = turnKIF(moveData.turn);
      return { ply, turn, move: "投了" };
    }
    case "md_chudan": {
      const ply = moveData.ply;
      const turn = turnKIF(moveData.turn);
      return { ply, turn, move: "中断" };
    }
  }
}
