import { parseKIF } from "../kif";
import * as fs from "fs";
import * as MoveData from "../moveData";

const moveToKIF = (m: MoveData.MoveData) => {
  const kif = MoveData.toKIF(m);
  switch (m.type) {
    case "md_initial":
      return kif.move;
    case "md_normal":
      return `${kif.ply}${kif.turn}${kif.move}${kif.from}`;
    case "md_drop":
    case "md_toryo":
    case "md_chudan":
      return `${kif.ply}${kif.turn}${kif.move}`;
  }
};

describe("parseKIF", () => {
  test("test.kifu", () => {
    const kif = fs.readFileSync("./src/__tests__/data/test.kifu", { encoding: "utf8" });
    const game = parseKIF(kif);
    if (game instanceof Error) throw game;

    game.goToFirst();
    [
      "開始局面",
      "1▲７六歩(77)",
      "2△８四歩(83)",
      "3▲３三角成(88)",
      "4△同　角(22)",
      "5▲８八銀(79)",
      "6△同　角成(33)",
      "7▲同　飛(28)",
      "8△５八銀打",
      "9▲投了",
    ].forEach((want) => {
      expect(moveToKIF(game.currentNode.lastMove)).toBe(want);
      game.next();
    });
  });

  test("test2.kifu", () => {
    const kif = fs.readFileSync("./src/__tests__/data/test2.kifu", { encoding: "utf8" });
    const game = parseKIF(kif);
    if (game instanceof Error) throw game;
    game.goToLast();
    expect(game.currentNode.position.toSFEN()).toBe(
      "lrg3k1l/3Sl4/p1pppp+B2/1P1s2ppp/P8/+Rp1n2P2/4PP2P/6G2/L4K3 b 2Gb2s3n3p 115"
    );
  });
});
