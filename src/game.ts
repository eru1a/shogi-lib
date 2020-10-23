import * as Move from "./move";
import { Position } from "./position";

export type GameNode = {
  position: Position;
  lastMove?: Move.Move;
  prev?: GameNode;
  next?: GameNode;
};

// TODO: 分岐
export class Game {
  rootNode: GameNode;
  currentNode: GameNode;

  constructor() {
    const position = new Position();
    const node: GameNode = { position };
    this.rootNode = node;
    this.currentNode = node;
  }

  move(move: Move.Move): void | Error {
    // 同じ手だったら単に進める
    const nextMove = this.currentNode.next?.lastMove;
    if (nextMove !== undefined && Move.equal(move, nextMove)) {
      this.next();
      return;
    }
    const position = this.currentNode.position.clone();
    const err = position.move(move);
    if (err instanceof Error) {
      return new Error(`Game.next: ${err}`);
    }
    const nextNode = { position, lastMove: move, prev: this.currentNode };
    this.currentNode.next = nextNode;
    this.currentNode = nextNode;
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
