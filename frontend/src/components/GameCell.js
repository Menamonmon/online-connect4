import { Circle } from "@chakra-ui/layout";
import React from "react";

export default function GameCell({ state, index, onClick, custom, width }) {
  function mapStateToColor(s) {
    return ["white", "red.500", "yellow.500"][s];
  }

  if (custom === undefined) {
    const calcRow = (i) => (i % 6) + 1;
    const calcCol = (i) => (i - (calcRow(i) - 1)) / 6 + 1;

    const row = calcRow(index);
    const col = calcCol(index);

    return (
      <Circle
        w={width}
        h={width}
        onClick={(e) => onClick(e, row, col)}
        bgColor={mapStateToColor(state)}
      />
    );
  } else {
    return <Circle w={width} h={width} bgColor={mapStateToColor(state)} />;
  }
}
