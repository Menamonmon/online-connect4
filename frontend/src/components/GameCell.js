import React from "react";

export default function GameCell({ state, index, onClick, custom, width }) {
  function mapStateToColor(s) {
    return ["white", "red", "yellow"][s];
  }

  if (custom === undefined) {
    const calcRow = (i) => (i % 6) + 1;
    const calcCol = (i) => (i - (calcRow(i) - 1)) / 6 + 1;

    const row = calcRow(index);
    const col = calcCol(index);

    return (
      <div
        className="game-cell"
        onClick={(e) => onClick(e, row, col)}
        style={{
          borderRadius: "50%",
          backgroundColor: mapStateToColor(state),
          gridColumn: row,
          gridRow: col,
        }}
      />
    );
  } else {
    return (
      <div
        className="game-cell"
        style={{
          borderRadius: "50%",
          backgroundColor: mapStateToColor(state),
          width,
          height: width,
        }}
      />
    );
  }
}
