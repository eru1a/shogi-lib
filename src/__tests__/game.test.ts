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

const pushMoves = (game: Game, usiMoves: Array<string>) => {
  usiMoves.forEach((usiMove) => {
    const move = Move.fromUSI(usiMove);
    if (move instanceof Error) throw move;
    const err = game.move(move);
    if (err instanceof Error) throw err;
  });
};

describe("move-next-prev-gotoPly", () => {
  const game = new Game();
  pushMoves(game, ["7g7f", "3c3d", "8h2b+", "3a2b", "B*5e"]);

  test("next", () => {
    game.gotoFirst();
    ["開始局面", "７六歩(77)", "３四歩(33)", "２二角成(88)", "同　銀(31)", "５五角打"].forEach(
      (want) => {
        expect(moveToKIF(game.currentNode.lastMove)).toBe(want);
        game.next();
      }
    );
  });

  test("prev", () => {
    game.gotoLast();
    ["５五角打", "同　銀(31)", "２二角成(88)", "３四歩(33)", "７六歩(77)", "開始局面"].forEach(
      (want) => {
        expect(moveToKIF(game.currentNode.lastMove)).toBe(want);
        game.prev();
      }
    );
  });

  test("gotoPly", () => {
    game.gotoPly(0);
    expect(game.currentNode.position.ply).toBe(0);

    game.gotoPly(4);
    expect(game.currentNode.position.ply).toBe(4);

    if (!(game.gotoPly(-1) instanceof Error)) {
      throw new Error("should be error gotoPly(-1)");
    }

    if (!(game.gotoPly(100) instanceof Error)) {
      throw new Error("should be error gotoPly(100)");
    }
  });
});

// TODO: もっと良い方法でテストする
test("branch", () => {
  const game = new Game();
  pushMoves(game, ["7g7f", "3c3d", "2g2f", "8c8d"]);
  game.move({ type: "md_toryo", turn: "w", ply: 5 });

  game.gotoPly(1);
  pushMoves(game, ["8c8d", "7i6h", "3c3d", "6g6f"]);
  game.move({ type: "md_chudan", turn: "b", ply: 6 });

  const moves: Array<string | [string, Array<string>]> = [];
  game.gotoFirst();
  while (true) {
    moves.push(moveToKIF(game.currentNode.lastMove));
    if (game.currentNode.next === undefined) break;
    game.next();
  }

  const branchMoves: Array<string> = [];
  game.gotoPly(1);
  game.gotoUID(game.currentNode.branch[0].uid);
  while (true) {
    branchMoves.push(moveToKIF(game.currentNode.lastMove));
    if (game.currentNode.next === undefined) break;
    game.next();
  }
  if (typeof moves[2] === "string") {
    moves[2] = [moves[2], branchMoves];
  }

  expect(moves).toEqual([
    "開始局面",
    "７六歩(77)",
    ["３四歩(33)", ["８四歩(83)", "６八銀(79)", "３四歩(33)", "６六歩(67)", "中断"]],
    "２六歩(27)",
    "８四歩(83)",
    "投了",
  ]);
});
