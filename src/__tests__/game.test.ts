import { Game } from "../game";
import * as Move from "../move";

describe("move-next-prev-goToNth", () => {
  const game = new Game();
  ["7g7f", "3c3d", "8h2b+", "3a2b", "B*5e"].forEach((usiMove) => {
    const move = Move.fromUSI(usiMove);
    if (move instanceof Error) throw move;
    const err = game.move(move);
    if (err instanceof Error) throw err;
  });

  test("next", () => {
    game.goToFirst();
    [undefined, "7g7f", "3c3d", "8h2b+", "3a2b", "B*5e"].forEach((want) => {
      const lastMove = game.currentNode.lastMove;
      if (lastMove === undefined) {
        expect(lastMove).toBe(want);
      } else {
        expect(Move.toUSI(lastMove)).toBe(want);
      }
      game.next();
    });
  });

  test("prev", () => {
    game.goToLast();
    ["B*5e", "3a2b", "8h2b+", "3c3d", "7g7f", undefined].forEach((want) => {
      const lastMove = game.currentNode.lastMove;
      if (lastMove === undefined) {
        expect(lastMove).toBe(want);
      } else {
        expect(Move.toUSI(lastMove)).toBe(want);
      }
      game.prev();
    });
  });

  test("goToNth", () => {
    game.goToNth(0);
    expect(game.currentNode.position.ply).toBe(0);

    game.goToNth(4);
    expect(game.currentNode.position.ply).toBe(4);

    if (!(game.goToNth(-1) instanceof Error)) {
      throw new Error("should be error goToNth(-1)");
    }

    if (!(game.goToNth(100) instanceof Error)) {
      throw new Error("should be error goToNth(100)");
    }
  });
});
