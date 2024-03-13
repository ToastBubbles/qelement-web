import React, { CSSProperties, useEffect, useState } from "react";
import { IColorWithPercent } from "../interfaces/general";

interface iProps {
  colorsWPercent: IColorWithPercent[];
  radius?: number;
}

export default function ColorPieChart({
  colorsWPercent,
  radius = 100,
}: iProps) {
  const [colorDegrees, setColorDegrees] = useState<string>("");

  useEffect(() => {
    let totalDegrees = 0;
    let gradient = "";
    for (const colObj of colorsWPercent) {
      const percent =
        colObj.percent === null
          ? 1 / colorsWPercent.length
          : colObj.percent / 100;
      const degrees = percent * 360;
      gradient += `#${colObj.color.hex} ${totalDegrees}deg ${
        totalDegrees + degrees
      }deg`;
      totalDegrees += degrees;
      if (colObj !== colorsWPercent[colorsWPercent.length - 1]) {
        gradient += ",";
      }
    }
    setColorDegrees(gradient);
  }, [colorsWPercent]);

  const style: CSSProperties = {
    width: `${radius}px`,
    height: `${radius}px`,
    borderRadius: "50%",
    border: "solid 1px var(--lt-grey)",
    backgroundImage: `conic-gradient(${colorDegrees})`,
  };

  return <div style={style}></div>;
}
