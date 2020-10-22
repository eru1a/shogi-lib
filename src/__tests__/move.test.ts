import * as Move from "../move";

describe("toUSI", () => {
  const tests: Array<{ move: Move.Move; want: string }> = [
    {
      move: { type: "normal", from: "7g", to: "7f", promotion: false },
      want: "7g7f",
    },
    {
      move: { type: "normal", from: "8h", to: "2b", promotion: true },
      want: "8h2b+",
    },
    {
      move: { type: "drop", to: "5e", pieceType: "B" },
      want: "B*5e",
    },
  ];

  tests.forEach(({ move, want }) => {
    test(want, () => {
      expect(Move.toUSI(move)).toBe(want);
    });
  });
});

describe("fromUSI", () => {
  const testsOK: Array<{ usi: string; want: Move.Move }> = [
    {
      usi: "7g7f",
      want: { type: "normal", from: "7g", to: "7f", promotion: false },
    },
    {
      usi: "8h2b+",
      want: { type: "normal", from: "8h", to: "2b", promotion: true },
    },
    {
      usi: "B*5e",
      want: { type: "drop", to: "5e", pieceType: "B" },
    },
  ];

  testsOK.forEach(({ usi, want }) => {
    expect(Move.fromUSI(usi)).toEqual(want);
  });

  const testsNG = ["", "7g", "7g10f", "10g7f", "8h2b++", "8h2b*", "A*5e", "B*e5", "B*0e", "B+5e"];

  testsNG.forEach((usi) => {
    test(usi, () => {
      if (!(Move.fromUSI(usi) instanceof Error)) {
        throw new Error(`should be error ${usi}`);
      }
    });
  });
});
