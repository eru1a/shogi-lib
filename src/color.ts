export type Color = "b" | "w";

export function inv(c: Color): Color {
  switch (c) {
    case "b":
      return "w";
    case "w":
      return "b";
  }
}

export function toUSI(c: Color): string {
  switch (c) {
    case "b":
      return "b";
    case "w":
      return "w";
  }
}

export function fromUSI(usi: string): Color | Error {
  switch (usi) {
    case "b":
      return "b";
    case "w":
      return "w";
    default:
      return new Error(`Color.fromUSI: invalid usi: "${usi}"`);
  }
}
