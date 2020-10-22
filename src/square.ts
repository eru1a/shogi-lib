import * as File from "./file";
import * as Rank from "./rank";

// prettier-ignore
export const squares = [
  "9a", "8a", "7a", "6a", "5a", "4a", "3a", "2a", "1a",
  "9b", "8b", "7b", "6b", "5b", "4b", "3b", "2b", "1b",
  "9c", "8c", "7c", "6c", "5c", "4c", "3c", "2c", "1c",
  "9d", "8d", "7d", "6d", "5d", "4d", "3d", "2d", "1d",
  "9e", "8e", "7e", "6e", "5e", "4e", "3e", "2e", "1e",
  "9f", "8f", "7f", "6f", "5f", "4f", "3f", "2f", "1f",
  "9g", "8g", "7g", "6g", "5g", "4g", "3g", "2g", "1g",
  "9h", "8h", "7h", "6h", "5h", "4h", "3h", "2h", "1h",
  "9i", "8i", "7i", "6i", "5i", "4i", "3i", "2i", "1i",
] as const;

// やりすぎかなぁ...
// type square = { file: File, rank: Rank } とかのほうがいいかな
export type Square = typeof squares[number];

export function toNum(square: Square): number {
  return squares.indexOf(square);
}

export function fromNum(i: number): Square | Error {
  return squares[i] ?? new Error("squareFromNum: i should be 0<=i<=80 ${i}");
}

/** 将棋盤上で左上(9a)を(0, 0)、右下(1i)を(8, 8)とした時のsquareの指す座標を返す。 */
export function toXY(square: Square): { x: number; y: number } {
  const i = squares.indexOf(square);
  return { x: i % 9, y: Math.floor(i / 9) };
}

export function fromXY(x: number, y: number): Square | Error {
  if (File.fromX(x) instanceof Error || Rank.fromY(y) instanceof Error) {
    return new Error(`squareFromXY: invalid xy: (${x}, ${y})`);
  }
  return squares[x + y * 9];
}

export function toFileRank(square: Square): { file: File.File; rank: Rank.Rank } {
  const i = squares.indexOf(square);
  return { file: File.files[i % 9], rank: Rank.ranks[Math.floor(i / 9)] };
}

export function fromFileRank(file: File.File, rank: Rank.Rank): Square {
  const x = File.toX(file);
  const y = Rank.toY(rank);
  return squares[x + y * 9];
}

export function toUSI(square: Square): string {
  const { file, rank } = toFileRank(square);
  return `${File.toUSI(file)}${Rank.toUSI(rank)}`;
}

export function fromUSI(usi: string): Square | Error {
  const file = File.fromUSI(usi[0]);
  const rank = Rank.fromUSI(usi[1]);
  if (usi.length !== 2 || file instanceof Error || rank instanceof Error) {
    return new Error(`squareFromUSI: invalid usi: ${usi}`);
  }
  return fromFileRank(file, rank);
}

export function add(square: Square, dx: number, dy: number): Square | Error {
  const { x, y } = toXY(square);
  const sq = fromXY(x + dx, y + dy);
  if (sq instanceof Error) {
    return new Error(`squareAdd: out of bounds: add (${x}, ${y}) to ${square}`);
  }
  return sq;
}
