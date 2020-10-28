import Benchmark from "benchmark";
import { Position } from "../src/position";

const suite = new Benchmark.Suite();

suite
  .add("perft(1)", () => {
    const p = Position.fromSFEN("lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1");
    if (p instanceof Error) throw p;
    p.perft(1);
  })
  .add("perft(2)", () => {
    const p = Position.fromSFEN("lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1");
    if (p instanceof Error) throw p;
    p.perft(2);
  })
  .on("cycle", (e: any) => console.log(`${e.target}`))
  .run({ async: true });
