import { color } from "../interfaces/general";

import { getPrefColorName, getTextColor } from "../utils/utils";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../context/context";

interface IProps {
  color: color;
  centerText?: boolean;
  deleteMode?: boolean;
}

export default function ColorLink({
  color,
  centerText = false,
  deleteMode = false,
}: IProps) {
  const {
    state: {
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const [onHover, setOnHover] = useState<boolean>(false);
  if (!deleteMode)
    return (
      <Link
        key={color.id}
        to={"/color/" + color.id}
        className="flag flag-spacer"
        style={{
          backgroundColor: "#" + color.hex,
          color: getTextColor(color.hex),
          textAlign: centerText ? "center" : "start",
        }}
      >
        {getPrefColorName(color, prefPayload.prefName)}
      </Link>
    );
  else
    return (
      <div
        key={color.id}
        className="flag flag-spacer d-flex ai-center"
        style={{
          backgroundColor: "#" + color.hex,
          color: getTextColor(color.hex),
          textAlign: centerText ? "center" : "start",
        }}
        onMouseEnter={() => setOnHover(true)}
        onMouseLeave={() => setOnHover(false)}
      >
        {getPrefColorName(color, prefPayload.prefName)}
        {onHover && (
          <svg
            style={{ marginLeft: "auto" }}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="var(--lt-red)"
            viewBox="0 0 16 16"
          >
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
          </svg>
        )}
      </div>
    );
}
