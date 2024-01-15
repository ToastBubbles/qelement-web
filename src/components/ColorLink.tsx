import { color } from "../interfaces/general";
import axios from "axios";
import { useMutation } from "react-query";
import showToast, {
  Mode,
  getPrefColorName,
  getTextColor,
} from "../utils/utils";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/context";

interface IProps {
  color: color;
  centerText?: boolean;
}

export default function ColorLink({ color, centerText = false }: IProps) {
  const {
    state: {
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
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
}
