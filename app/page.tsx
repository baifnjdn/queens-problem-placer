"use client";

import { useState, useCallback } from "react";

const SIZE = 14;

type QueenSet = Set<string>;

function encode(row: number, col: number): string {
  return `${row},${col}`;
}

function countHighlights(
  row: number,
  col: number,
  queens: QueenSet,
): number {
  let count = 0;
  for (const key of queens) {
    const [qr, qc] = key.split(",").map(Number);
    if (qr === row || qc === col || Math.abs(qr - row) === Math.abs(qc - col)) {
      count++;
    }
  }
  return count;
}

export default function Home() {
  const [queens, setQueens] = useState<QueenSet>(new Set());

  const toggleQueen = useCallback((row: number, col: number) => {
    setQueens((prev) => {
      const next = new Set(prev);
      const key = encode(row, col);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const grid: [number, number, boolean, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const hasQueen = queens.has(encode(r, c));
      const highlightCount = hasQueen ? 0 : countHighlights(r, c, queens);
      grid.push([r, c, hasQueen, highlightCount]);
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-100 font-sans dark:bg-zinc-900 p-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-200">
        Queens Problem — {SIZE}×{SIZE}
      </h1>

      <div
        className="grid gap-px bg-zinc-400 dark:bg-zinc-500 border-2 border-zinc-400 dark:border-zinc-500 rounded-sm overflow-hidden shadow-lg"
        style={{
          gridTemplateColumns: `repeat(${SIZE}, 40px)`,
          gridTemplateRows: `repeat(${SIZE}, 40px)`,
        }}
      >
        {grid.map(([r, c, hasQueen, highlightCount]) => {
          const opacity = Math.min(highlightCount * 0.22, 0.9);

          return (
            <button
              key={encode(r, c)}
              onClick={() => toggleQueen(r, c)}
              className="relative flex items-center justify-center bg-zinc-200 dark:bg-zinc-700 cursor-pointer border-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:z-10"
              aria-label={`${hasQueen ? "Remove queen from" : "Place queen on"} row ${r + 1}, column ${c + 1}`}
            >
              {highlightCount > 0 && (
                <span
                  className="absolute inset-0 bg-yellow-400 dark:bg-yellow-500 transition-opacity duration-150"
                  style={{ opacity }}
                />
              )}
              {hasQueen && (
                <span className="relative z-10 w-6 h-6 rounded-full bg-black dark:bg-zinc-900 shadow-md" />
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
        {queens.size} queen{queens.size !== 1 ? "s" : ""} placed
      </p>
    </div>
  );
}
