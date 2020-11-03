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
  branch: Array<GameNode>;

  readonly uid: number;
};

export class Game {
  rootNode: GameNode;
  currentNode: GameNode;
  private uid = 0;

  constructor() {
    const position = new Position();
    const node: GameNode = {
      position,
      lastMove: { type: "md_initial" },
      branch: [],
      uid: this.uid++,
    };
    this.rootNode = node;
    this.currentNode = node;
  }

  static fromKIF(kif: string): Game | Error {
    return parseKIF(kif);
  }

  /** Moveで指し手を進める */
  move(move: Move.Move | MoveData.MoveData): void | Error {
    if (!(move.type === "normal" || move.type === "drop")) {
      return this.moveByMoveData(move);
    }

    const moveData = MoveData.fromMove(
      move,
      this.currentNode.position,
      MoveData.getMove(this.currentNode.lastMove)
    );
    if (moveData instanceof Error) {
      return new Error(`Game.move: ${moveData}`);
    }
    return this.moveByMoveData(moveData);
  }

  /** MoveDataで指し手を進める */
  private moveByMoveData(moveData: MoveData.MoveData): void | Error {
    // 投了/中断されてる場合は何もしない
    // => 前の局面に戻って中断を上書きするほうがいいだろうか?
    const lastMove = this.currentNode.lastMove;
    if (lastMove.type === "md_toryo" || lastMove.type === "md_chudan") return;

    // 既に指している手だったら単に進める
    if (this.currentNode.next) {
      const lastMove = this.currentNode.next.lastMove;
      if (lastMove !== undefined && MoveData.equal(moveData, lastMove)) {
        this.next();
        return;
      }
    }

    // 分岐の中で同じ手を指している場合も単に進める
    for (const node of this.currentNode.branch) {
      const lastMove = node.lastMove;
      if (lastMove !== undefined && MoveData.equal(moveData, lastMove)) {
        this.gotoUID(node.uid);
        return;
      }
    }

    // 局面を進める
    const position = this.currentNode.position.clone();
    if (moveData.type === "md_normal" || moveData.type === "md_drop") {
      const err = position.move(moveData.move);
      if (err instanceof Error) return new Error(`Game.move: ${err}`);
    }
    // 投了とか中断した場合って手番入れ替えたりするべきなのかな
    // ShogiGUIはそうしてるっぽいけど...

    const nextNode = {
      position,
      lastMove: moveData,
      prev: this.currentNode,
      branch: [],
      uid: this.uid++,
    };

    // nextがなければ次の手とする
    if (this.currentNode.next === undefined) {
      this.currentNode.next = nextNode;
      this.currentNode = nextNode;
      return;
    }
    // nextがある場合は分岐とする
    this.currentNode.branch.push(nextNode);
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

  gotoFirst(): void {
    this.currentNode = this.rootNode;
  }

  gotoLast(): void {
    let node = this.currentNode;
    while (node.next !== undefined) node = node.next;
    this.currentNode = node;
  }

  gotoPly(ply: number): void | Error {
    let node = this.rootNode;
    while (true) {
      if (node.position.ply === ply) {
        this.currentNode = node;
        return;
      }
      if (node.next === undefined) break;
      node = node.next;
    }
    return new Error(`Game.gotoPly: cannot found: ${ply}`);
  }

  /** uidで局面を探す */
  gotoUID(uid: number): void | Error {
    // 全探索
    // uidのつけ方を工夫することで効率良く探すことが出来るだろうか
    const search = (node: GameNode): GameNode | undefined => {
      if (node.uid === uid) return node;

      if (node.next !== undefined) {
        const result = search(node.next);
        if (result !== undefined) return result;
      }

      for (const branchNode of node.branch) {
        const result = search(branchNode);
        if (result !== undefined) return result;
      }

      return undefined;
    };

    const node = search(this.rootNode);
    if (node === undefined) {
      return new Error(`Game.gotoUID: cannot found: ${uid}`);
    }
    this.currentNode = node;
  }
}
