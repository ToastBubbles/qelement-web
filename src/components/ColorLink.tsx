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
}

export default function ColorLink({ color }: IProps) {
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
      }}
    >
      {getPrefColorName(color, prefPayload.prefName)}
    </Link>
  );
}
