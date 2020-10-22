import * as File from "../file";
import * as Rank from "../rank";
import * as Square from "../square";

describe("toNum", () => {
  const tests: Array<{ square: Square.Square; want: number }> = [
    { square: "9a", want: 0 },
    { square: "7g", want: 56 },
    { square: "1i", want: 80 },
  ];
  tests.forEach(({ square, want }) => {
    test(`{square}`, () => {
      expect(Square.toNum(square)).toBe(want);
    });
  });
});

describe("fromNum", () => {
  const testsOK: Array<{ num: number; want: Square.Square }> = [
    { num: 0, want: "9a" },
    { num: 56, want: "7g" },
    { num: 80, want: "1i" },
  ];
  testsOK.forEach(({ num, want }) => {
    expect(Square.fromNum(num)).toBe(want);
  });

  const testsNG = [-1, 81, 100];
  testsNG.forEach((num) => {
    test(`${num}`, () => {
      if (!(Square.fromNum(num) instanceof Error)) {
        throw new Error(`should be error ${num}`);
      }
    });
  });
});

describe("toXY", () => {
  const tests: Array<{ square: Square.Square; want: { x: number; y: number } }> = [
    { square: "9a", want: { x: 0, y: 0 } },
    { square: "7g", want: { x: 2, y: 6 } },
    { square: "1i", want: { x: 8, y: 8 } },
  ];
  tests.forEach(({ square, want }) => {
    test(`{square}`, () => {
      expect(Square.toXY(square)).toEqual(want);
    });
  });
});

describe("fromXY", () => {
  const testsOK: Array<{ xy: { x: number; y: number }; want: Square.Square }> = [
    { xy: { x: 0, y: 0 }, want: "9a" },
    { xy: { x: 2, y: 6 }, want: "7g" },
    { xy: { x: 8, y: 8 }, want: "1i" },
  ];
  testsOK.forEach(({ xy: { x, y }, want }) => {
    test(`{x: ${x}, y: {y}}`, () => {
      expect(Square.fromXY(x, y)).toBe(want);
    });
  });

  const testsNG = [
    { x: -1, y: 0 },
    { x: 9, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 9 },
    { x: -1, y: -1 },
    { x: 9, y: 9 },
  ];
  testsNG.forEach(({ x, y }) => {
    test(`{x: ${x}, y: {y}}`, () => {
      if (!(Square.fromXY(x, y) instanceof Error)) {
        throw new Error(`should be error (${x}, ${y})`);
      }
    });
  });
});

describe("toFileRank", () => {
  const tests: Array<{
    square: Square.Square;
    want: { file: File.File; rank: Rank.Rank };
  }> = [
    { square: "9a", want: { file: "9", rank: "a" } },
    { square: "7g", want: { file: "7", rank: "g" } },
    { square: "1i", want: { file: "1", rank: "i" } },
  ];
  tests.forEach(({ square, want }) => {
    test(`{square}`, () => {
      expect(Square.toFileRank(square)).toEqual(want);
    });
  });
});

describe("fromFileRank", () => {
  const tests: Array<{
    filerank: { file: File.File; rank: Rank.Rank };
    want: Square.Square;
  }> = [
    { filerank: { file: "9", rank: "a" }, want: "9a" },
    { filerank: { file: "7", rank: "g" }, want: "7g" },
    { filerank: { file: "1", rank: "i" }, want: "1i" },
  ];
  tests.forEach(({ filerank: { file, rank }, want }) => {
    test(`{file: ${file}, rank: {rank}}`, () => {
      expect(Square.fromFileRank(file, rank)).toBe(want);
    });
  });
});

describe("fromUSI", () => {
  const testsOK: Array<{ usi: string; want: Square.Square }> = [
    { usi: "9a", want: "9a" },
    { usi: "7g", want: "7g" },
    { usi: "1i", want: "1i" },
  ];
  testsOK.forEach(({ usi, want }) => {
    expect(Square.fromUSI(usi)).toBe(want);
  });

  const testsNG = ["", "1", "a", "a1", "12", "ab", "0a", "1j", "7g7f"];
  testsNG.forEach((usi) => {
    test(usi, () => {
      if (!(Square.fromUSI(usi) instanceof Error)) {
        throw new Error(`should be error ${usi}`);
      }
    });
  });
});

describe("toUSI", () => {
  const tests: Array<{ square: Square.Square; want: string }> = [
    { square: "9a", want: "9a" },
    { square: "7g", want: "7g" },
    { square: "1i", want: "1i" },
  ];
  tests.forEach(({ square, want }) => {
    test(`{square}`, () => {
      expect(Square.toUSI(square)).toBe(want);
    });
  });
});

describe("add", () => {
  const testsOK: Array<{
    square: Square.Square;
    dx: number;
    dy: number;
    want: Square.Square;
  }> = [
    { square: "9a", dx: 1, dy: 1, want: "8b" },
    { square: "5e", dx: -2, dy: 3, want: "7h" },
    { square: "1i", dx: -1, dy: -2, want: "2g" },
  ];
  testsOK.forEach(({ square, dx, dy, want }) => {
    test(`{square}`, () => {
      expect(Square.add(square, dx, dy)).toBe(want);
    });
  });

  const testsNG: Array<{ square: Square.Square; dx: number; dy: number }> = [
    { square: "9a", dx: -1, dy: 1 },
    { square: "5e", dx: 5, dy: 3 },
    { square: "1i", dx: 0, dy: 2 },
  ];
  testsNG.forEach(({ square, dx, dy }) => {
    test(`{square}`, () => {
      if (!(Square.add(square, dx, dy) instanceof Error)) {
        throw new Error(`should be error ${square}, (${dx}, ${dy})`);
      }
    });
  });
});
