import Benchmark from "benchmark";
import { Game } from "../src/game";
import * as fs from "fs";

const suite = new Benchmark.Suite();

suite
  .add("parseKIF", () => {
    const buf = fs.readFileSync("./src/__tests__/data/test2.kifu", { encoding: "utf8" });
    Game.fromKIF(buf);
  })
  .on("cycle", (e: any) => console.log(`${e.target}`))
  .run({ async: true });
