import { component$, $, PropFunction } from "@builder.io/qwik";
import styles from "./board.module.css";

export type Player = 0 | 1 | 2;

interface BoardProps {
  board: Player[][];
  winningCells?: [number, number][] | null;
  onCellClick$: PropFunction<(col: number) => void>;
  disabled?: boolean;
  activeCol?: number | null;
}

export const ConnectFourBoard = component$<BoardProps>((props) => {
  // Map through columns from left (0) to right (6)
  return (
    <div class={styles["board-wrapper"]}>
      <div class={styles.board}>
        {Array.from({ length: 6 }).map((_, row) =>
          Array.from({ length: 7 }).map((_, col) => {
            // Render from bottom up (row 0 = bottom, so invert row index for appearance)
            const displayRow = 5 - row;
            const cellValue = props.board[displayRow][col];
            const isWinning =
              props.winningCells &&
              props.winningCells.some(
                ([r, c]) => r === displayRow && c === col
              );

            return (
              <div
                key={`cell-${displayRow}-${col}`}
                class={[
                  styles.cell,
                  cellValue === 1 && styles["cell--player1"],
                  cellValue === 2 && styles["cell--player2"],
                  isWinning && styles["cell--win"],
                ]}
                style={{
                  outline:
                    props.activeCol === col && !props.disabled
                      ? `2.5px dashed var(--secondary)`
                      : undefined,
                  opacity:
                    cellValue === 0 && props.disabled ? "0.9" : undefined,
                  cursor:
                    cellValue === 0 && !props.disabled ? "pointer" : "default",
                }}
                onClick$={() =>
                  !props.disabled &&
                  props.onCellClick$ &&
                  cellValue === 0 &&
                  row ===
                    (props.board
                      .map((rowArr) => rowArr[col])
                      .findLastIndex((v) => v === 0)) &&
                  props.onCellClick$(col)
                }
                tabIndex={0}
                aria-label={`Row ${displayRow + 1} Column ${
                  col + 1
                }${cellValue === 1 ? ", player 1" : cellValue === 2 ? ", player 2" : ""
                  }`}
                role="button"
              ></div>
            );
          })
        )}
      </div>
    </div>
  );
});
