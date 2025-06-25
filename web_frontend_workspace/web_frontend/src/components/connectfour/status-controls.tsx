import { component$ } from "@builder.io/qwik";

interface StatusProps {
  currentPlayer: 1 | 2;
  gameOver: boolean;
  winner: 1 | 2 | null;
  onRestart$: () => void;
  draw: boolean;
}

export const ConnectFourStatusControls = component$<StatusProps>(
  ({ currentPlayer, gameOver, winner, draw, onRestart$ }) => {
    let status = "";
    if (winner) {
      status =
        winner === 1
          ? "Player 1 (Yellow) wins! 🎉"
          : "Player 2 (Pink) wins! 🎉";
    } else if (draw) {
      status = "It's a draw!";
    } else if (!gameOver) {
      status =
        currentPlayer === 1
          ? "Player 1's turn (Yellow)"
          : "Player 2's turn (Pink)";
    }

    return (
      <section
        style={{
          minWidth: "197px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            margin: "0 0 22px 0",
            textAlign: "center",
            fontWeight: 600,
            fontSize: "1.22rem",
            color: winner
              ? "#4361ee"
              : draw
              ? "#999"
              : currentPlayer === 1
              ? "#ffd60a"
              : "#f72585",
            letterSpacing: "1px",
          }}
        >
          {status}
        </div>
        <div style={{ textAlign: "center" }}>
          <button
            type="button"
            style={{
              background: "#fff",
              color: "#4361ee",
              border: "2px solid #4361ee",
              borderRadius: "999px",
              padding: "13px 38px",
              fontWeight: 700,
              fontSize: "1.02rem",
              cursor: "pointer",
              transition: "background 0.12s",
              boxShadow: "0 2.5px 10px 0 rgba(67,97,238,0.12)",
            }}
            onClick$={onRestart$}
            aria-label="Restart Game"
          >
            Restart
          </button>
        </div>
      </section>
    );
  }
);
