import { Game } from "./game";
import * as PieceType from "./pieceType";
import * as Move from "./move";
import * as MoveData from "./moveData";
import * as Square from "./square";

// TODO: BOD, 分岐
export function parseKIF(kif: string): Game | Error {
  const headerRe = /(.*)：(.*)/;
  const moveRe = /(\d+)\s*([１２３４５６７８９][一二三四五六七八九]|同)\s*(成?[歩香桂銀金角飛王玉と杏圭全馬竜龍])([成|打]?)\s*\(?(\d\d)?\)?/;
  const specialMoveRe = /(\d+)\s*(投了|詰み|中断|千日手|王手連続千日手|勝ち宣言|時間切れ)/;

  const game = new Game();
  const lines = kif.split("\n");
  for (const line of lines) {
    if (line.startsWith("#")) continue;
    if (line.startsWith("*")) continue;
    if (line.startsWith("&")) continue;
    if (line.startsWith("手数")) continue;
    if (line.startsWith("まで")) break;
    if (headerRe.test(line)) continue;

    if (moveRe.test(line)) {
      const match = line.match(moveRe);
      if (match === null) return new Error(`parseKIF: can't happen`);
      const [, , toKIF, pieceKIF, promotionOrDrop, fromSuuji] = match;

      // TODO: move.tsにMove.fromKIFとして移動させる
      let move: Move.Move;
      if (promotionOrDrop === "打") {
        const pieceType = PieceType.fromKIF(pieceKIF);

        if (pieceType instanceof Error) {
          return new Error(`parseKIF: ${line}: ${pieceType}`);
        }

        const to = Square.fromKIF(toKIF);
        if (to instanceof Error) {
          return new Error(`parseKIF: ${line}: ${to}`);
        }

        move = { type: "drop", to, pieceType };
      } else {
        if (fromSuuji === undefined) {
          return new Error(`parseKIF: from should not be undefined: ${line}`);
        }

        const from = Square.fromSuuji(fromSuuji);
        if (from instanceof Error) {
          return new Error(`parseKIF: ${line}: ${from}`);
        }

        const lastMove = MoveData.getMove(game.currentNode.lastMove);
        const lastTo = lastMove?.to;
        const to = toKIF === "同" ? Square.fromKIF(toKIF, lastTo) : Square.fromKIF(toKIF);
        if (to instanceof Error) {
          return new Error(`parseKIF: ${line}: ${to}`);
        }

        move = { type: "normal", from, to, promotion: promotionOrDrop === "成" };
      }

      const err = game.move(move);
      if (err instanceof Error) {
        return new Error(`parseKIF: ${line}: ${err}`);
      }

      continue;
    }

    if (specialMoveRe.test(line)) {
      const match = line.match(specialMoveRe);
      if (match === null) return new Error(`parseKIF: can't happen`);
      const [, , specialMove] = match;
      if (specialMove !== "投了" && specialMove !== "中断") {
        continue;
      }
      const turn = game.currentNode.position.turn;
      const ply = game.currentNode.position.ply + 1;
      const move: MoveData.MoveData = {
        type: specialMove === "投了" ? "md_toryo" : "md_chudan",
        turn,
        ply,
      };
      const err = game.move(move);
      if (err instanceof Error) {
        return new Error(`parseKIF: ${line}: ${err}`);
      }
      continue;
    }
  }
  return game;
}
