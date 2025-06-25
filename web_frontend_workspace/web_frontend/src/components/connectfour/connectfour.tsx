import { component$, useSignal, $ } from "@builder.io/qwik";
import { ConnectFourBoard, Player } from "./board";
import { ConnectFourStatusControls } from "./status-controls";

type GameStatus =
  | { state: "playing"; currentPlayer: 1 | 2 }
  | { state: "won"; winner: 1 | 2; winningCells: [number, number][] }
  | { state: "draw" };

function createEmptyBoard(): Player[][] {
  // 6 rows x 7 columns
  return Array.from({ length: 6 }, () => Array(7).fill(0) as Player[]);
}

function getAvailableRow(board: Player[][], col: number): number {
  // Returns the lowest available row in a column (or -1 if full)
  for (let row = 0; row < 6; row++) {
    if (board[row][col] === 0) return row;
  }
  return -1;
}

function checkWin(
  board: Player[][],
  player: Player
): [boolean, [number, number][] | null] {
  // Returns: isWin, and winning cells as array of [row,col]
  // Only check for player (1 or 2)
  // Directions: horizontal, vertical, diagonal, anti-diagonal
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 7; c++) {
      if (board[r][c] !== player) continue;
      // Horizontal:
      if (
        c <= 3 &&
        board[r][c + 1] === player &&
        board[r][c + 2] === player &&
        board[r][c + 3] === player
      ) {
        return [
          true,
          [
            [r, c],
            [r, c + 1],
            [r, c + 2],
            [r, c + 3],
          ],
        ];
      }
      // Vertical:
      if (
        r <= 2 &&
        board[r + 1][c] === player &&
        board[r + 2][c] === player &&
        board[r + 3][c] === player
      ) {
        return [
          true,
          [
            [r, c],
            [r + 1, c],
            [r + 2, c],
            [r + 3, c],
          ],
        ];
      }
      // Diagonal /
      if (
        r <= 2 &&
        c <= 3 &&
        board[r + 1][c + 1] === player &&
        board[r + 2][c + 2] === player &&
        board[r + 3][c + 3] === player
      ) {
        return [
          true,
          [
            [r, c],
            [r + 1, c + 1],
            [r + 2, c + 2],
            [r + 3, c + 3],
          ],
        ];
      }
      // Anti-diagonal \
      if (
        r <= 2 &&
        c >= 3 &&
        board[r + 1][c - 1] === player &&
        board[r + 2][c - 2] === player &&
        board[r + 3][c - 3] === player
      ) {
        return [
          true,
          [
            [r, c],
            [r + 1, c - 1],
            [r + 2, c - 2],
            [r + 3, c - 3],
          ],
        ];
      }
    }
  }
  return [false, null];
}

function boardIsFull(board: Player[][]): boolean {
  return board.every((row) => row.every((cell) => cell !== 0));
}

// PUBLIC_INTERFACE
export const ConnectFourGame = component$(() => {
  const board = useSignal<Player[][]>(createEmptyBoard());
  const status = useSignal<GameStatus>({ state: "playing", currentPlayer: 1 });
  const activeCol = useSignal<number | null>(null);

  // PUBLIC_INTERFACE
  const handleCellClick = $((col: number) => {
    if (status.value.state !== "playing") return;
    const row = getAvailableRow(board.value, col);
    if (row === -1) return; // Column full

    // Place the token
    const newBoard = board.value.map((rowArr) => rowArr.slice()) as Player[][];
    newBoard[row][col] =
      status.value.state === "playing" ? status.value.currentPlayer : 0;
    board.value = newBoard;

    // Check for win
    const [won, winningCells] = checkWin(
      newBoard,
      status.value.state === "playing" ? status.value.currentPlayer : 1
    );
    if (won && winningCells) {
      status.value = {
        state: "won",
        winner: status.value.currentPlayer,
        winningCells,
      };
      return;
    }

    // Check for draw
    if (boardIsFull(newBoard)) {
      status.value = { state: "draw" };
      return;
    }

    // Switch player
    status.value = {
      state: "playing",
      currentPlayer: status.value.currentPlayer === 1 ? 2 : 1,
    };
  });

  // PUBLIC_INTERFACE
  const restartGame = $(() => {
    board.value = createEmptyBoard();
    status.value = { state: "playing", currentPlayer: 1 };
  });

  // PUBLIC_INTERFACE
  const handleColMouse = $((colIdx: number | null) => {
    activeCol.value = colIdx;
  });

  let winner: 1 | 2 | null = null;
  let draw = false;
  let winningCoords: [number, number][] | null = null;
  let currentPlayer: 1 | 2 = 1;
  let gameOver = false;

  if (status.value.state === "won") {
    winner = status.value.winner;
    winningCoords = status.value.winningCells;
    gameOver = true;
  } else if (status.value.state === "draw") {
    draw = true;
    gameOver = true;
  } else if (status.value.state === "playing") {
    currentPlayer = status.value.currentPlayer;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        minHeight: "95vh",
        background: "#fff",
      }}
    >
      <h1
        style={{
          color: "#4361ee",
          margin: "16px 0 17px 0",
          fontWeight: 800,
          fontSize: "2.12rem",
        }}
      >
        4 IN LINE
      </h1>
      <div
        style={{
          display: "flex",
          gap: "42px",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
          maxWidth: "950px",
        }}
      >
        <div
          style={{
            flex: 1.5,
          }}
          onMouseLeave$={() => handleColMouse(null)}
        >
          <ConnectFourBoard
            board={board.value}
            winningCells={winningCoords}
            onCellClick$={handleCellClick}
            disabled={gameOver}
            activeCol={activeCol.value}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "13px",
              fontSize: "1.03rem",
              color: "#b2b2b2",
            }}
          >
            <span>
              Player 1&nbsp;
              <span
                style={{
                  margin: "0 4px",
                  width: "12px",
                  height: "12px",
                  background: "#ffd60a",
                  display: "inline-block",
                  borderRadius: "50%",
                  border: "1.5px solid #ffe06a",
                }}
              ></span>
              &nbsp;&nbsp;|&nbsp;&nbsp;Player 2&nbsp;
              <span
                style={{
                  margin: "0 4px",
                  width: "12px",
                  height: "12px",
                  background: "#f72585",
                  display: "inline-block",
                  borderRadius: "50%",
                  border: "1.5px solid #fa5eab",
                }}
              ></span>
            </span>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <ConnectFourStatusControls
            currentPlayer={currentPlayer}
            gameOver={gameOver}
            winner={winner}
            draw={draw}
            onRestart$={restartGame}
          />
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          div[style*="gap: 42px"] {
            flex-direction: column !important;
            gap: 12px !important;
            align-items: center !important;
            width: 98vw !important;
            max-width: none !important;
          }
        }
        @media (max-width: 700px) {
          h1 {
            font-size: 1.37rem !important;
          }
        }
      `}</style>
    </div>
  );
});
