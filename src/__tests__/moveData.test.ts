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

describe("toKIF", () => {
  const tests: Array<{ move: MoveData.MoveData; want: string }> = [
    {
      move: { type: "md_initial" },
      want: "開始局面",
    },
    {
      move: {
        type: "md_normal",
        turn: "b",
        ply: 1,
        move: { type: "normal", from: "7g", to: "7f", promotion: false },
        piece: "P",
        same: false,
      },
      want: "1▲７六歩(77)",
    },
    {
      move: {
        type: "md_normal",
        turn: "b",
        ply: 3,
        move: { type: "normal", from: "8h", to: "2b", promotion: true },
        piece: "B",
        same: false,
      },
      want: "3▲２二角成(88)",
    },
    {
      move: {
        type: "md_normal",
        turn: "w",
        ply: 4,
        move: { type: "normal", from: "3a", to: "2b", promotion: false },
        piece: "s",
        same: true,
      },
      want: "4△同　銀(31)",
    },
    {
      move: {
        type: "md_drop",
        turn: "b",
        ply: 5,
        move: { type: "drop", to: "5e", pieceType: "B" },
      },
      want: "5▲５五角打",
    },
    {
      move: {
        type: "md_normal",
        turn: "b",
        ply: 127,
        move: { type: "normal", from: "3c", to: "4b", promotion: false },
        piece: "+N",
        same: true,
      },
      want: "127▲同　成桂(33)",
    },
    {
      move: {
        type: "md_toryo",
        turn: "w",
        ply: 200,
      },
      want: "200△投了",
    },
  ];

  tests.forEach(({ move, want }) => {
    test(want, () => {
      expect(moveToKIF(move)).toBe(want);
    });
  });
});
