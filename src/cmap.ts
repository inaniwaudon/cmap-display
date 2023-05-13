export interface CMap {
  uniToCid: {
    unicode: number;
    cid: number;
  }[];
}

export const cmaps = [
  { name: "UniJIS-UTF16-H", vertical: false },
  { name: "UniJIS-UTF16-V", vertical: true },
  { name: "UniJIS2004-UTF16-H", vertical: false },
  { name: "UniJIS2004-UTF16-V", vertical: true },
];

export const supplements: {
  type: "std" | "pro" | "pr5" | "pr6";
  supplement: number;
  color: string;
  cidTo?: number;
}[] = [
  { type: "std", supplement: 3, color: "transparent", cidTo: 9353 },
  { type: "pro", supplement: 4, color: "hsl(40, 100%, 94%)", cidTo: 15443 },
  { type: "pr5", supplement: 5, color: "hsl(100, 100%, 94%)", cidTo: 20316 },
  { type: "pr6", supplement: 6, color: "hsl(160, 100%, 94%)" },
];
