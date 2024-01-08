import { Link } from "react-router-dom";
import { IMoldStatus, IMoldStatusWUNK, color } from "../interfaces/general";
import {
  getPrefColorIdString,
  getPrefColorName,
  getTextColor,
} from "../utils/utils";
import { AppContext } from "../context/context";
import { ReactNode, useContext } from "react";

interface INewColor {
  bl_name?: string;
  bo_name?: string;
  tlg_name?: string;
  hex?: string;
  type?: string;
  swatchId?: number;
}
interface iProps {
  color?: color | null;
  newColor?: INewColor;

  // neighbors
}
export default function ColorSwatchOrder({ color, newColor }: iProps) {
  if (color)
    return (
      <div className="d-flex">
        <div
          className={"showHEX " + color.type}
          style={{
            backgroundColor:
              color.hex.length == 6 ? `#${color.hex}` : "transparent",
          }}
        ></div>
        <div>
          {color.bl_name} ({color.swatchId})
        </div>
      </div>
    );
  else if (newColor) {
    return (
      <div className="d-flex">
        <div
          className={"showHEX " + newColor.type}
          style={{
            backgroundColor:
              newColor.hex && newColor.hex.length == 6
                ? `#${newColor.hex}`
                : "transparent",
          }}
        ></div>
        <div>
          {newColor.bl_name} (
          {newColor.swatchId && newColor.swatchId > 0 ? newColor.swatchId : ""})
        </div>
      </div>
    );
  } else
    return (
      <div className="d-flex">
        <div className={"showHEX "}></div>
        <div>none</div>
      </div>
    );
}
