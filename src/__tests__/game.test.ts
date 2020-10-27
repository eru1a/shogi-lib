import { Game } from "../game";
import * as Move from "../move";
import * as MoveData from "../moveData";

const moveToKIF = (m: MoveData.MoveData) => {
  const kif = MoveData.toKIF(m);
  switch (m.type) {
    case "md_initial":
      return kif.move;
    case "md_normal":
      return `${kif.move}${kif.from}`;
    case "md_drop":
    case "md_toryo":
    case "md_chudan":
      return `${kif.move}`;
  }
};

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
    ["開始局面", "７六歩(77)", "３四歩(33)", "２二角成(88)", "同　銀(31)", "５五角打"].forEach(
      (want) => {
        expect(moveToKIF(game.currentNode.lastMove)).toBe(want);
        game.next();
      }
    );
  });

  test("prev", () => {
    game.goToLast();
    ["５五角打", "同　銀(31)", "２二角成(88)", "３四歩(33)", "７六歩(77)", "開始局面"].forEach(
      (want) => {
        expect(moveToKIF(game.currentNode.lastMove)).toBe(want);
        game.prev();
      }
    );
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
