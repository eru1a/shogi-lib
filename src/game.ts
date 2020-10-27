import * as Move from "./move";
import * as MoveData from "./moveData";
import { Position } from "./position";
import { parseKIF } from "./kif";

export type GameNode = {
  position: Position;
  /** 前の指し手。初期局面でも"md_initial"になるので必ず存在する */
  lastMove: MoveData.MoveData;
  prev?: GameNode;
  next?: GameNode;
};

export class Game {
  rootNode: GameNode;
  currentNode: GameNode;

  constructor() {
    const position = new Position();
    const node: GameNode = { position, lastMove: { type: "md_initial" } };
    this.rootNode = node;
    this.currentNode = node;
  }

  static fromKIF(kif: string): Game | Error {
    return parseKIF(kif);
  }

  /** Moveで指し手を進める */
  move(move: Move.Move): void | Error {
    // 既に保持している手だったら単に進める
    const prevNextMove = this.currentNode.next?.lastMove;
    if (
      prevNextMove !== undefined &&
      (prevNextMove.type === "md_normal" || prevNextMove.type === "md_drop") &&
      Move.equal(move, prevNextMove.move)
    ) {
      this.next();
      return;
    }

    const moveData = MoveData.fromMove(
      move,
      this.currentNode.position,
      MoveData.move(this.currentNode.lastMove)
    );
    if (moveData instanceof Error) {
      return new Error(`Game.move: ${moveData}`);
    }

    const position = this.currentNode.position.clone();
    const err = position.move(move);
    if (err instanceof Error) {
      return new Error(`Game.move: ${err}`);
    }
    const nextNode = { position, lastMove: moveData, prev: this.currentNode };
    this.currentNode.next = nextNode;
    this.currentNode = nextNode;
  }

  /** MoveDataで指し手を進める */
  moveData(moveData: MoveData.MoveData): void | Error {
    switch (moveData.type) {
      case "md_initial":
      case "md_toryo":
      case "md_chudan":
        const position = this.currentNode.position.clone();
        if (moveData.type !== "md_initial") {
          // 投了した時とかって手数進めたりするべきなのか?
          position.pass();
        }
        const nextNode = { position, lastMove: moveData, prev: this.currentNode };
        this.currentNode.next = nextNode;
        this.currentNode = nextNode;
        return;
      default:
        return this.move(moveData.move);
    }
  }

  next(): void | Error {
    if (this.currentNode.next === undefined) {
      return new Error("Game.next: no next node");
    }
    this.currentNode = this.currentNode.next;
  }

  prev(): void | Error {
    if (this.currentNode.prev === undefined) {
      return new Error("Game.prev: no prev node");
    }
    this.currentNode = this.currentNode.prev;
  }

  /** n番目の局面に飛ぶ */
  goToNth(n: number): void | Error {
    if (n < 0) {
      return new Error(`Game.goToNth: must be a positive number: ${n}`);
    }
    let current = this.rootNode;
    for (let i = 0; i < n; i++) {
      if (current.next === undefined) {
        return new Error(`Game.goToNth: there is no ${n}-th node, only ${i}-th`);
      }
      current = current.next;
    }
    this.currentNode = current;
  }

  goToFirst(): void {
    this.currentNode = this.rootNode;
  }

  goToLast(): void {
    let node = this.currentNode;
    while (node.next !== undefined) node = node.next;
    this.currentNode = node;
  }
}
