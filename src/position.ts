import * as Piece from "./piece";
import * as Color from "./color";
import * as Square from "./square";
import * as Move from "./move";
import * as Rank from "./rank";
import * as File from "./file";

export type Board = Array<Array<Piece.Piece | undefined>>;
export type Hand = Map<Piece.Piece, number>;

export function emptyBoard(): Board {
  return Array.from(new Array(9), () => new Array(9).fill(undefined));
}

export function defaultBoard(): Board {
  const board = emptyBoard();
  board[0][0] = "l";
  board[0][1] = "n";
  board[0][2] = "s";
  board[0][3] = "g";
  board[0][4] = "k";
  board[0][5] = "g";
  board[0][6] = "s";
  board[0][7] = "n";
  board[0][8] = "l";

  board[1][1] = "r";
  board[1][7] = "b";

  board[2][0] = "p";
  board[2][1] = "p";
  board[2][2] = "p";
  board[2][3] = "p";
  board[2][4] = "p";
  board[2][5] = "p";
  board[2][6] = "p";
  board[2][7] = "p";
  board[2][8] = "p";

  board[6][0] = "P";
  board[6][1] = "P";
  board[6][2] = "P";
  board[6][3] = "P";
  board[6][4] = "P";
  board[6][5] = "P";
  board[6][6] = "P";
  board[6][7] = "P";
  board[6][8] = "P";

  board[7][1] = "B";
  board[7][7] = "R";

  board[8][0] = "L";
  board[8][1] = "N";
  board[8][2] = "S";
  board[8][3] = "G";
  board[8][4] = "K";
  board[8][5] = "G";
  board[8][6] = "S";
  board[8][7] = "N";
  board[8][8] = "L";

  return board;
}

export function defaultHand(): Hand {
  const hand: Hand = new Map();
  Piece.handPieces.forEach((p) => hand.set(p, 0));
  return hand;
}

export class Position {
  board: Board;
  hand: Hand;
  turn: Color.Color;
  ply: number;

  constructor(p?: { board?: Board; turn?: Color.Color; hand?: Hand; ply?: number }) {
    // pを渡さなかった場合は初期局面
    this.board = p?.board ?? defaultBoard();
    this.turn = p?.turn ?? "b";
    this.hand = p?.hand ?? defaultHand();
    this.ply = p?.ply ?? 0;
  }

  clone(): Position {
    // position -> sfen -> position
    const p = Position.fromSFEN(this.toSFEN());
    if (p instanceof Error) {
      // Position.fromSFENにバグがある
      throw new Error("clone: Position.fromSFEN has bug ${this}");
    }
    return p;
  }

  static fromSFEN(sfen: string): Position | Error {
    const sp = sfen.split(" ");
    if (sp.length !== 4) {
      return new Error(
        `Position.fromSFEN: sfen should be separated into four sections by a whitespace: ${sfen}`
      );
    }

    const [b, t, h, p] = sp;

    const board = boardFromSFEN(b);
    if (board instanceof Error) {
      return new Error(`Position.fromSFEN: invalid board ${board}: ${sfen}`);
    }

    const turn = Color.fromUSI(t);
    if (turn instanceof Error) {
      return new Error(`Position.fromSFEN: invalid turn ${turn}: ${sfen}`);
    }

    const hand = handFromSFEN(h);
    if (hand instanceof Error) {
      return new Error(`Position.fromSFEN: invalid hand ${hand}: ${sfen}`);
    }

    // sfenでは次の手が何手目かを表すので-1
    const ply = parseInt(p) - 1;
    // parseIntは"12a"とかを12にしちゃうので数字だけを含んでいるかをテストしないといけない
    if (!/^\d+$/.test(p)) {
      return new Error(`Position.fromSFEN: invalid ply ${p}: ${sfen}`);
    }

    return new Position({ board, hand, turn, ply });
  }

  toSFEN(): string {
    let sfen = "";

    // board
    for (const rank of Rank.ranks) {
      let blankN = 0;
      for (const file of File.files) {
        const p = this.getPiece(Square.fromFileRank(file, rank));
        if (p === undefined) {
          blankN++;
          continue;
        }
        if (blankN > 0) {
          sfen += blankN.toString();
          blankN = 0;
        }
        sfen += Piece.toUSI(p);
      }

      if (blankN > 0) {
        sfen += blankN.toString();
      }
      if (rank !== "i") {
        sfen += "/";
      }
    }
    sfen += " ";

    // turn
    sfen += Color.toUSI(this.turn);
    sfen += " ";

    // hand
    Piece.handPieces.forEach((p) => {
      const n = this.hand.get(p) ?? 0;
      if (n > 0) {
        if (n > 1) {
          sfen += n.toString();
        }
        sfen += Piece.toUSI(p);
      }
    });
    if (Piece.handPieces.every((p) => (this.hand.get(p) ?? 0) === 0)) {
      sfen += "-";
    }
    sfen += " ";

    // ply
    // sfenでは次の手が何手目かを表すので+1
    sfen += (this.ply + 1).toString();

    return sfen;
  }

  getPiece(square: Square.Square): Piece.Piece | undefined {
    const { x, y } = Square.toXY(square);
    return this.board[y][x];
  }

  /** 駒を置く。既に駒が置いてあったらエラーを返す。 */
  setPiece(square: Square.Square, p: Piece.Piece): void | Error {
    const { x, y } = Square.toXY(square);
    if (this.board[y][x] !== undefined) {
      return new Error(`setPiece: there is already piece: ${square} ${this.board[y][x]}`);
    }
    this.board[y][x] = p;
  }

  /** 駒を取り除く。 */
  removePiece(square: Square.Square): void {
    const { x, y } = Square.toXY(square);
    this.board[y][x] = undefined;
  }

  /** 持ち駒に加える。駒台に置けない駒を渡すとエラーを返す。 */
  addHand(p: Piece.Piece, n = 1): void | Error {
    if (this.hand.get(p) === undefined) {
      return new Error(`addHand: invalid piece: ${p}`);
    }
    this.hand.set(p, (this.hand.get(p) ?? 0) + n);
  }

  /**
   * 持ち駒から取り除く。
   * 持ってる駒以上の枚数を取り除こうとしたり、駒台に置けない駒を渡すとエラーを返す。
   */
  removeHand(p: Piece.Piece, n = 1): void | Error {
    if (this.hand.get(p) === undefined) {
      return new Error(`removeHand: invalid piece: ${p}`);
    }
    const have = this.hand.get(p) ?? 0;
    if (have < n) {
      return new Error(
        `removeHand: tried to remove ${n} ${p} but only have ${have}: ${this.toSFEN()}`
      );
    }
    this.hand.set(p, (this.hand.get(p) ?? 0) - n);
  }

  /** 持ち駒の枚数を返す。駒台に置けない駒を渡すとエラーを返す。 */
  getHand(p: Piece.Piece): number | Error {
    return this.hand.get(p) ?? new Error(`getHand: invalid piece ${p}`);
  }

  private normalMove(m: Move.NormalMove): void | Error {
    let piece = this.getPiece(m.from);
    if (piece === undefined) {
      return new Error(`normalMove: there is no piece: ${m} ${this}`);
    }
    if (m.promotion) {
      if (piece === Piece.promote(piece)) {
        return new Error(`normalMove: ${piece} is already promoted: ${m} ${this}`);
      }
      piece = Piece.promote(piece);
    }
    const capturedPiece = this.getPiece(m.to);
    if (capturedPiece !== undefined) {
      if (Piece.color(capturedPiece) === this.turn) {
        return new Error(`normalMove: tried to capture own piece: ${m} ${this}`);
      }
      this.removePiece(m.to);
      this.addHand(Piece.colorInv(Piece.demote(capturedPiece)));
    }
    this.removePiece(m.from);
    this.setPiece(m.to, piece);
  }

  private dropMove(m: Move.DropMove): void | Error {
    const piece = Piece.make(m.pieceType, this.turn);
    const err = this.removeHand(piece);
    if (err instanceof Error) {
      return new Error(`dropMove: ${err}`);
    }
    if (this.getPiece(m.to) !== undefined) {
      return new Error(`dropMove: there is already piece: ${m} ${this}`);
    }
    this.setPiece(m.to, piece);
  }

  /** 王手放置等のチェックをせずに動かす */
  private unsafeMove(m: Move.Move): void | Error {
    const result = m.type === "normal" ? this.normalMove(m) : this.dropMove(m);
    if (result instanceof Error) {
      return result;
    }
    this.turn = Color.inv(this.turn);
    this.ply++;
  }

  move(m: Move.Move): void | Error {
    if (!this.isLegalMove(m)) {
      return new Error(`move: illegal move: ${Move.toUSI(m)} ${this}`);
    }
    const err = this.unsafeMove(m);
    if (err instanceof Error) {
      return new Error(`move: unsafeMove has error: ${err}`);
    }
  }

  pass(): void {
    this.turn = Color.inv(this.turn);
    this.ply++;
  }

  legalMoves(): Array<Move.Move> {
    return this.pseudoLegalMoves().filter((move) => {
      // 王手放置
      const clone = this.clone();
      const err = clone.unsafeMove(move);
      if (err instanceof Error) {
        throw new Error(`legalMoves: pseudoLegalMoves has bug: ${Move.toUSI(move)}: ${err}`);
      }
      if (clone.isInCheck(this.turn)) {
        return false;
      }
      // 打ち歩詰め
      if (
        move.type === "drop" &&
        move.pieceType === "P" &&
        clone.isInCheck() &&
        clone.isCheckmate()
      ) {
        return false;
      }
      return true;
    });
  }

  isLegalMove(m: Move.Move): boolean {
    return this.legalMoves().some((move) => Move.equal(move, m));
  }

  isCheckmate(): boolean {
    return this.legalMoves().length === 0;
  }

  // 時間がかかりすぎてダメ
  // 合法手の生成等を高速化しなければ...
  perft(depth: number): number {
    if (depth === 0) return 0;
    const clone = this.clone();
    const legalMoves = clone.legalMoves();
    let num = legalMoves.length;
    legalMoves.forEach((move) => {
      clone.move(move);
      num += clone.perft(depth - 1);
    });
    return num;
  }

  private generateHoppingMoves(
    color: Color.Color,
    from: Square.Square,
    piece: Piece.Piece,
    effect: PieceEffect
  ): Array<Move.Move> {
    const moves: Array<Move.Move> = [];
    for (const [dx, dy] of effect) {
      const to = Square.add(from, dx, dy);
      if (to instanceof Error) {
        continue;
      }
      const attackedPiece = this.getPiece(to);
      if (attackedPiece !== undefined && Piece.color(attackedPiece) === color) {
        continue;
      }
      if (!Piece.needForcePromotion(piece, to)) {
        // 強制成りが必要な場合は不成を生成しない
        moves.push({ type: "normal", from, to, promotion: false });
      }
      if (Piece.canPromote(piece, from, to)) {
        // 成り
        moves.push({ type: "normal", from, to, promotion: true });
      }
    }
    return moves;
  }

  private generateSlidingMoves(
    color: Color.Color,
    from: Square.Square,
    piece: Piece.Piece,
    effect: PieceEffect
  ): Array<Move.Move> {
    const moves: Array<Move.Move> = [];
    for (const [dx, dy] of effect) {
      for (let to = Square.add(from, dx, dy); !(to instanceof Error); to = Square.add(to, dx, dy)) {
        const attackedPiece = this.getPiece(to);
        if (attackedPiece !== undefined && Piece.color(attackedPiece) === color) {
          break;
        }

        if (!Piece.needForcePromotion(piece, to)) {
          // 強制成りが必要な場合は不成を生成しない
          moves.push({ type: "normal", from, to, promotion: false });
        }
        if (Piece.canPromote(piece, from, to)) {
          // 成り
          moves.push({ type: "normal", from, to, promotion: true });
        }

        if (attackedPiece !== undefined) {
          break;
        }
      }
    }
    return moves;
  }

  private generateNormalMoves(color: Color.Color): Array<Move.Move> {
    const getEffect = (piece: Piece.Piece) => pieceEffects.get(piece) ?? [];
    let moves: Array<Move.Move> = [];
    for (const square of Square.squares) {
      const piece = this.getPiece(square);
      if (piece === undefined) continue;
      if (Piece.color(piece) !== color) continue;

      switch (piece) {
        case "P":
          moves = moves.concat(this.generateHoppingMoves(color, square, piece, getEffect("P")));
          break;
        case "L":
          moves = moves.concat(this.generateSlidingMoves(color, square, piece, getEffect("L")));
          break;
        case "N":
          moves = moves.concat(this.generateHoppingMoves(color, square, piece, getEffect("N")));
          break;
        case "S":
          moves = moves.concat(this.generateHoppingMoves(color, square, piece, getEffect("S")));
          break;
        case "G":
        case "+P":
        case "+L":
        case "+N":
        case "+S":
          moves = moves.concat(this.generateHoppingMoves(color, square, piece, getEffect("G")));
          break;
        case "B":
          moves = moves.concat(this.generateSlidingMoves(color, square, piece, getEffect("B")));
          break;
        case "+B":
          moves = moves.concat(this.generateSlidingMoves(color, square, piece, getEffect("B")));
          moves = moves.concat(this.generateHoppingMoves(color, square, piece, getEffect("R")));
          break;
        case "R":
          moves = moves.concat(this.generateSlidingMoves(color, square, piece, getEffect("R")));
          break;
        case "+R":
          moves = moves.concat(this.generateSlidingMoves(color, square, piece, getEffect("R")));
          moves = moves.concat(this.generateHoppingMoves(color, square, piece, getEffect("B")));
          break;
        case "K":
          moves = moves.concat(this.generateHoppingMoves(color, square, piece, getEffect("K")));
          break;
        case "p":
          moves = moves.concat(this.generateHoppingMoves(color, square, piece, getEffect("p")));
          break;
        case "l":
          moves = moves.concat(this.generateSlidingMoves(color, square, piece, getEffect("l")));
          break;
        case "n":
          moves = moves.concat(this.generateHoppingMoves(color, square, piece, getEffect("n")));
          break;
        case "s":
          moves = moves.concat(this.generateHoppingMoves(color, square, piece, getEffect("s")));
          break;
        case "g":
        case "+p":
        case "+l":
        case "+n":
        case "+s":
          moves = moves.concat(this.generateHoppingMoves(color, square, piece, getEffect("g")));
          break;
        case "b":
          moves = moves.concat(this.generateSlidingMoves(color, square, piece, getEffect("b")));
          break;
        case "+b":
          moves = moves.concat(this.generateSlidingMoves(color, square, piece, getEffect("b")));
          moves = moves.concat(this.generateHoppingMoves(color, square, piece, getEffect("r")));
          break;
        case "r":
          moves = moves.concat(this.generateSlidingMoves(color, square, piece, getEffect("r")));
          break;
        case "+r":
          moves = moves.concat(this.generateSlidingMoves(color, square, piece, getEffect("r")));
          moves = moves.concat(this.generateHoppingMoves(color, square, piece, getEffect("b")));
          break;
        case "k":
          moves = moves.concat(this.generateHoppingMoves(color, square, piece, getEffect("k")));
          break;
      }
    }
    return moves;
  }

  private generateDropMoves(color: Color.Color): Array<Move.Move> {
    const fuInRow = (p: Piece.Piece, file: File.File): boolean => {
      for (const rank of Rank.ranks) {
        if (this.getPiece(Square.fromFileRank(file, rank)) === p) return true;
      }
      return false;
    };
    const moves: Array<Move.Move> = [];
    Piece.handPieces
      .filter((piece) => Piece.color(piece) === color)
      .filter((piece) => (this.getHand(piece) ?? 0) >= 1)
      .forEach((piece) => {
        for (const rank of Rank.ranks) {
          for (const file of File.files) {
            const square = Square.fromFileRank(file, rank);

            // そこに駒がある場合
            if (this.getPiece(square) !== undefined) continue;
            // 歩香桂が置けない段
            if (Piece.needForcePromotion(piece, square)) continue;
            // 二歩
            if ((piece === "P" || piece === "p") && fuInRow(piece, file)) continue;

            moves.push({
              type: "drop",
              to: square,
              pieceType: Piece.pieceType(piece),
            });
          }
        }
      });
    return moves;
  }

  private pseudoLegalMoves(color: Color.Color = this.turn): Array<Move.Move> {
    return this.generateNormalMoves(color).concat(this.generateDropMoves(color));
  }

  private findKing(color: Color.Color = this.turn): Square.Square | undefined {
    for (const square of Square.squares) {
      const piece = this.getPiece(square);
      if (piece === undefined) continue;
      if (Piece.pieceType(piece) === "K" && Piece.color(piece) === color) {
        return square;
      }
    }
    return undefined;
  }

  /** color側の玉が王手を掛けられているか */
  isInCheck(color: Color.Color = this.turn): boolean {
    const kingSquare = this.findKing(color);
    if (kingSquare === undefined) return false;
    // 相手側の疑似合法手の中にこっちの玉のマスに動かせる手があったら王手を掛けられているということ
    return this.generateNormalMoves(Color.inv(color)).some((move) => move.to === kingSquare);
  }

  toString(): string {
    return this.toSFEN();
  }
}

const boardFromSFEN = (boardSFEN: string): Board | Error => {
  const board: Board = Array.from(new Array(9), () => new Array(9).fill(undefined));
  const sp = boardSFEN.split("/");
  if (sp.length !== 9) {
    return new Error(
      `boardFromSFEN: board sfen should be separated into nine sections by a '/': ${boardSFEN}`
    );
  }
  for (let y = 0; y < 9; y++) {
    let x = 0;
    let prevPlus = false;
    for (const c of sp[y]) {
      if (x < 0 || x >= 9) {
        return new Error(`boardFromSFEN: out of bounds (${x}, ${y})`);
      }
      if (c === "+") {
        if (prevPlus) {
          return new Error(`boardFromSFEN: '+' appeared twice in a row: ${sp[y]}`);
        }
        prevPlus = true;
        continue;
      }
      if ("1" <= c && c <= "9") {
        if (prevPlus) {
          return new Error(`boardFromSFEN: number appeared after the '+': ${sp[y]}`);
        }
        x += parseInt(c);
        continue;
      }
      let p = Piece.fromUSI(c);
      if (p instanceof Error) {
        return new Error(`boardFromSFEN: ${p}`);
      }
      if (prevPlus) {
        p = Piece.promote(p);
      }
      board[y][x] = p;
      x++;
      prevPlus = false;
    }
  }
  return board;
};

const handFromSFEN = (handSFEN: string): Hand | Error => {
  const hand = defaultHand();
  if (handSFEN === "-") {
    return hand;
  }

  const s: Set<Piece.Piece> = new Set();

  // 枚数
  let n: number | undefined = undefined;
  for (const c of handSFEN) {
    if ("0" <= c && c <= "9") {
      n = (n ?? 0) * 10 + parseInt(c);
      continue;
    }
    const p = Piece.fromUSI(c);
    if (p instanceof Error) {
      return new Error(`handFromSFEN: unknown piece: ${p}`);
    }
    if (s.has(p)) {
      return new Error(`handFromSFEN: duplicate ${p}: ${handSFEN}`);
    }
    s.add(p);
    // 玉の場合エラーにすべき?
    hand.set(p, n ?? 1);
    n = undefined;
  }
  if (n !== undefined) {
    return new Error(`handFromSFEN: end with number: ${handSFEN}`);
  }
  return hand;
};

// 駒の効き
type PieceEffect = Array<[number, number]>;

// prettier-ignore
const pieceEffects: Map<Piece.Piece, PieceEffect> = new Map([
  [ "P",  [[0, -1]] ],
  [ "L",  [[0, -1]] ],
  [ "N",  [[-1, -2], [1, -2]] ],
  [ "S",  [[-1, -1], [0, -1], [1, -1], [-1, 1], [1, 1]] ],
  [ "G",  [[-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [0, 1]] ],
  [ "B",  [[-1, -1], [1, -1], [1, 1], [-1, 1]] ],
  [ "R",  [[-1, 0], [0, -1], [1, 0], [0, 1]] ],
  [ "K",  [[-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1]] ],
  [ "p",  [[0, 1]] ],
  [ "l",  [[0, 1]] ],
  [ "n",  [[-1, 2], [1, 2]] ],
  [ "s",  [[-1, 1], [0, 1], [1, 1], [-1, -1], [1, -1]] ],
  [ "g",  [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [0, -1]] ],
  [ "b",  [[-1, 1], [1, 1], [1, -1], [-1, -1]] ],
  [ "r",  [[-1, 0], [0, 1], [1, 0], [0, -1]] ],
  [ "k",  [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]] ],
]);
