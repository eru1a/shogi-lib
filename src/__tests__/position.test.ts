import * as Move from "../move";
import * as Piece from "../piece";
import { Position, Hand, defaultHand, emptyBoard } from "../position";

// 配列で持ち駒を作る補助関数
function makeHand(arr: Array<{ p: Piece.Piece; n: number }>): Hand {
  const hand = defaultHand();

  arr.forEach(({ p, n }) => {
    hand.set(p, n);
  });
  return hand;
}

const ____ = undefined;

describe("position <-> sfen", () => {
  const testsOK: Array<{ sfen: string; position: Position }> = [
    {
      sfen: "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1",
      position: new Position(),
    },
    {
      sfen: "3g2snl/R8/2+P1ppgp1/B1pp4p/G2n1S3/2PbP1P2/KP1+lkPN1P/6S2/L+r3G2L w 3Psn2p 98",
      position: new Position({
        // prettier-ignore
        board: [
            [____, ____, ____,  "g", ____, ____,  "s",  "n",  "l"],
            [ "R", ____, ____, ____, ____, ____, ____, ____, ____],
            [____, ____, "+P", ____,  "p",  "p",  "g",  "p", ____],
            [ "B", ____,  "p",  "p", ____, ____, ____, ____,  "p"],
            [ "G", ____, ____,  "n", ____,  "S", ____, ____, ____],
            [____, ____,  "P",  "b",  "P", ____,  "P", ____, ____],
            [ "K",  "P", ____, "+l",  "k",  "P",  "N", ____,  "P"],
            [____, ____, ____, ____, ____, ____,  "S", ____, ____],
            [ "L", "+r", ____, ____, ____,  "G", ____, ____,  "L"],
          ],
        hand: makeHand([
          { p: "P", n: 3 },
          { p: "p", n: 2 },
          { p: "n", n: 1 },
          { p: "s", n: 1 },
        ]),
        turn: "w",
        ply: 97,
      }),
    },
    {
      sfen: "9/9/9/9/9/9/9/9/9 b 99P100p 1",
      position: new Position({
        board: emptyBoard(),
        hand: makeHand([
          { p: "P", n: 99 },
          { p: "p", n: 100 },
        ]),
        turn: "b",
        ply: 0,
      }),
    },
  ];

  testsOK.forEach(({ sfen, position }) => {
    test(`sfen -> position (${sfen})`, () => {
      expect(Position.fromSFEN(sfen)).toEqual(position);
    });

    test(`position -> sfen (${sfen})`, () => {
      expect(position.toSFEN()).toBe(sfen);
    });
  });

  const testsNG = [
    "",
    "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL1 b - 1",
    "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL/ b - 1",
    "/lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1",
    "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL a - 1",
    "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNA b - 1",
    "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b PP 1",
    "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b A 1",
    "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b P3 1",
    "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1a",
    "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1e3",
  ];

  testsNG.forEach((sfen) => {
    test(`sfen -> position (${sfen})`, () => {
      if (!(Position.fromSFEN(sfen) instanceof Error)) {
        throw new Error(`should be error: ${sfen}`);
      }
    });
  });
});

describe("move", () => {
  const tests: Array<{ sfen: string; moves: Array<{ move: Move.Move; want: string }> }> = [
    {
      sfen: "r6n1/6gk1/P2g1sspl/+B+Sp2ppl1/3pP2Np/3P1PP2/2+b1GG1S1/5K3/7RL b NLn7p 109",
      moves: [
        {
          move: { type: "normal", from: "9c", to: "9b", promotion: true },
          want: "r6n1/+P5gk1/3g1sspl/+B+Sp2ppl1/3pP2Np/3P1PP2/2+b1GG1S1/5K3/7RL w NLn7p 110",
        },
        {
          move: { type: "normal", from: "9a", to: "9b", promotion: false },
          want: "7n1/r5gk1/3g1sspl/+B+Sp2ppl1/3pP2Np/3P1PP2/2+b1GG1S1/5K3/7RL b NLn8p 111",
        },
        {
          move: { type: "normal", from: "2e", to: "3c", promotion: false },
          want: "7n1/r5gk1/3g1sNpl/+B+Sp2ppl1/3pP3p/3P1PP2/2+b1GG1S1/5K3/7RL w SNLn8p 112",
        },
        {
          move: { type: "normal", from: "2d", to: "2g", promotion: true },
          want: "7n1/r5gk1/3g1sNpl/+B+Sp2pp2/3pP3p/3P1PP2/2+b1GG1+l1/5K3/7RL b SNLsn8p 113",
        },
        {
          move: { type: "drop", pieceType: "S", to: "5b" },
          want: "7n1/r3S1gk1/3g1sNpl/+B+Sp2pp2/3pP3p/3P1PP2/2+b1GG1+l1/5K3/7RL w NLsn8p 114",
        },
        {
          move: { type: "drop", pieceType: "S", to: "5h" },
          want: "7n1/r3S1gk1/3g1sNpl/+B+Sp2pp2/3pP3p/3P1PP2/2+b1GG1+l1/4sK3/7RL b NLn8p 115",
        },
        {
          move: { type: "normal", from: "4h", to: "5h", promotion: false },
          want: "7n1/r3S1gk1/3g1sNpl/+B+Sp2pp2/3pP3p/3P1PP2/2+b1GG1+l1/4K4/7RL w SNLn8p 116",
        },
      ],
    },
  ];

  tests.forEach(({ sfen, moves }) => {
    test(sfen, () => {
      const p = Position.fromSFEN(sfen);
      if (p instanceof Error) throw p;
      moves.forEach(({ move, want }) => {
        const err = p.move(move);
        if (err instanceof Error) throw err;
        expect(p.toSFEN()).toBe(want);
      });
    });
  });
});

describe("legalMoves", () => {
  const tests: Array<{ msg: string; sfen: string; want: number }> = [
    {
      msg: "initial position",
      sfen: "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1",
      want: 30,
    },
    { msg: "nifu", sfen: "8k/PP7/2P6/3P5/9/5P3/6P2/7P1/8P b P 1", want: 18 },
    { msg: "test", sfen: "9/4B1SGL/PN2R4/1N1P5/6N2/5+R3/3+B5/9/8L b - 1", want: 112 },
    { msg: "oute(1)", sfen: "9/9/3rR2B1/9/8b/4s4/4K4/3N5/9 b 2P 1", want: 8 },
    { msg: "oute(2)", sfen: "4r4/9/3R5/7B1/9/9/9/9/4K4 b G 1", want: 16 },
    {
      msg: "floodgate",
      sfen: "l+S3ks1R/3g2g1+L/4pp1p1/p5p2/1KPS1P1P1/P2p1BP2/+bg2P4/1P5R1/1N7 b 3N2L5Pgs 1",
      want: 153,
    },
    // 以下はpython-shogiから
    {
      msg: "stalemate",
      sfen: "+R+N+SGKG+S+N+R/+B+N+SG+LG+S+N+B/P+LPP+LPP+LP/1P2P2P1/9/9/9/9/6k2 b - 200",
      want: 0,
    },
    { msg: "checkmate by dropping FU(1)", sfen: "kn7/9/1G7/9/9/9/9/9/9 b P 1", want: 76 },
    { msg: "checkmate by dropping FU(2)", sfen: "kn7/9/9/1NN6/9/9/9/9/9 b P 1", want: 73 },
    { msg: "check by dropping FU(1)", sfen: "k8/9/9/9/9/9/9/9/9 b P 1", want: 72 },
    { msg: "check by dropping FU(2)", sfen: "kn7/1n7/9/9/9/9/9/9/9 b P 1", want: 71 },
    { msg: "check by dropping FU(3)", sfen: "kn7/9/9/1N7/9/9/9/9/9 b P 1", want: 73 },
    // 82歩打で相手がstalemateになるけど王手でないので打ち歩詰めではない(?)
    { msg: "check by dropping FU(4)", sfen: "k8/9/1S7/9/9/9/9/9/9 b P 1", want: 81 },
    { msg: "check by dropping FU(5)", sfen: "kg7/9/1G7/9/9/9/9/9/9 b P 1", want: 77 },
  ];
  tests.forEach(({ msg, sfen, want }) => {
    test(msg, () => {
      const p = Position.fromSFEN(sfen);
      if (p instanceof Error) throw p;
      expect(p.legalMoves().length).toBe(want);
    });
  });
});

describe("isLegalMove", () => {
  const tests: Array<{ sfen: string; legals: Array<Move.Move>; illegals: Array<Move.Move> }> = [
    {
      sfen: "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1",
      legals: [
        { type: "normal", from: "7g", to: "7f", promotion: false },
        { type: "normal", from: "3i", to: "4h", promotion: false },
        { type: "normal", from: "1i", to: "1h", promotion: false },
      ],
      illegals: [
        { type: "normal", from: "7g", to: "6f", promotion: false },
        { type: "normal", from: "8h", to: "2b", promotion: false },
        { type: "drop", pieceType: "P", to: "5e" },
      ],
    },
    {
      sfen: "l+P6l/9/p1p1g1k1p/4pp3/1gP4pB/2r2P2P/P3P2PK/4+r1S2/5+p2L w 2S2N3Pb2gs2nlp 1",
      legals: [
        { type: "normal", from: "3c", to: "3d", promotion: false },
        { type: "normal", from: "3c", to: "2c", promotion: false },
        { type: "drop", pieceType: "B", to: "2d" },
        { type: "drop", pieceType: "L", to: "2d" },
      ],
      illegals: [
        { type: "normal", from: "3c", to: "2d", promotion: false },
        { type: "normal", from: "3c", to: "4b", promotion: false },
        { type: "normal", from: "4h", to: "5h", promotion: false },
        { type: "drop", pieceType: "P", to: "2d" },
      ],
    },
  ];
  tests.forEach(({ sfen, legals, illegals }) => {
    const p = Position.fromSFEN(sfen);
    if (p instanceof Error) throw p;

    legals.forEach((legal) => {
      test(`${Move.toUSI(legal)}`, () => {
        expect(p.isLegalMove(legal)).toBe(true);
      });
    });
    illegals.forEach((illegal) => {
      test(`${Move.toUSI(illegal)}`, () => {
        expect(p.isLegalMove(illegal)).toBe(false);
      });
    });
  });
});

describe("isInCheck", () => {
  const tests: Array<{ sfen: string; want: boolean }> = [
    { sfen: "1r6l/3g2kg1/3sSpn2/4P1p1p/l1Pp1P3/2Sn1B2P/1P4B2/K1gG2+r2/LN6L b N8Psp 1", want: true },
    {
      sfen: "1r6l/3g2kg1/3sSpn2/4P1p1p/l1Pp1P3/2Sn1B2P/PP4B2/K1gG2+r2/LN6L w N7Psp 1",
      want: false,
    },
    {
      sfen: "l2g1p1nl/1s4k2/p2p2ppp/9/1r3G1NP/2B2P1PL/P1pP2P2/3s1SSK1/L4G3 w R4Pbg2np 1",
      want: true,
    },
    {
      sfen: "l2g1p1nl/1s4k2/p2p1bppp/9/1r3G1NP/2B2P1PL/P1pP2P2/3s1SSK1/L4G3 b R4Pg2np 1",
      want: false,
    },
    { sfen: "4k4/9/9/9/9/9/4B4/9/1r2L4 w - 1", want: false },
    { sfen: "4k4/9/9/1B7/9/9/9/9/1r2L4 w - 1", want: true },
    { sfen: "k8/9/9/LK7/9/9/9/9/9 w - 1", want: true },
    { sfen: "k8/n8/9/LK7/9/9/9/9/9 b - 1", want: true },
  ];

  tests.forEach(({ sfen, want }) => {
    test(sfen, () => {
      const p = Position.fromSFEN(sfen);
      if (p instanceof Error) throw p;
      expect(p.isInCheck()).toBe(want);
    });
  });
});

describe("isCheckmate", () => {
  const tests: Array<{ sfen: string; want: boolean }> = [
    { sfen: "ln3k2l/3R5/p1p4p1/2s5p/6Pn1/4P1b1P/L+pPP3s1/3s3K1/1N2+s+r1NL b B4GP7p 1", want: true },
    { sfen: "lR2+R2+B1/+N3kg3/pPPp4p/3spsN2/5p1K1/Pp2S3P/n1N2P2L/3P5/L8 w B2GS6Pgl 1", want: true },
    {
      sfen: "ln7/2+R6/p1pppp1+Bp/1Nn6/L1S+b5/S1k6/P1LPP3P/1GG2P1P1/1N2KGS1L w GPrs5p 1",
      want: true,
    },
    {
      sfen: "ln7/2+R6/p1pppp1+Bp/1Nn6/L1S+b5/S1k6/P1PPP3P/1GG2P1P1/1N2KGS1L w GPrs5p 1",
      want: false,
    },
    { sfen: "8k/8P/7+R1/9/9/9/9/9/9 w - 1", want: true },
    { sfen: "8k/8P/7R1/9/9/9/9/9/9 w - 1", want: false },
    { sfen: "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1", want: false },
  ];

  tests.forEach(({ sfen, want }) => {
    test(sfen, () => {
      const p = Position.fromSFEN(sfen);
      if (p instanceof Error) throw p;
      expect(p.isCheckmate()).toBe(want);
    });
  });
});

describe("peft", () => {
  const tests: Array<{ sfen: string; depth: number; want: number }> = [
    {
      sfen: "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1",
      depth: 1,
      want: 30,
    },
    {
      sfen: "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1",
      depth: 2,
      want: 900,
    },
    {
      // 最大の合法手が存在する局面
      sfen: "R8/2K1S1SSk/4B4/9/9/9/9/9/1L1L1L3 b RBGSNLP3g3n17p 1",
      depth: 1,
      want: 593,
    },
    {
      sfen: "4k4/9/9/9/9/9/9/9/9 b 16P 1",
      depth: 1,
      want: 72,
    },
    {
      sfen: "4k4/9/9/9/9/9/9/9/9 b 16P 1",
      depth: 2,
      want: 355,
    },
    {
      sfen: "r7k/6K2/7SP/4s2bb/9/9/9/9/9 b r4g2s4n4l17p 1",
      depth: 1,
      want: 4,
    },
    {
      sfen: "l7l/5bS2/p1np5/6Sk1/4p2B1/PSpPPn1G1/1P1G2g1N/2+l6/L1KN1+r3 b R3Pgs7p 1",
      depth: 1,
      want: 1,
    },
  ];

  tests.forEach(({ sfen, depth, want }) => {
    test(sfen, () => {
      const p = Position.fromSFEN(sfen);
      if (p instanceof Error) throw p;
      expect(p.perft(depth)).toBe(want);
    });
  });
});
