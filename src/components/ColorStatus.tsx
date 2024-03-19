import { Link } from "react-router-dom";
import { IMoldStatus, IMoldStatusWUNK, color } from "../interfaces/general";
import {
  getPrefColorIdString,
  getPrefColorName,
  getTextColor,
} from "../utils/utils";
import { AppContext } from "../context/context";
import { ReactNode, useContext } from "react";

interface iProps {
  color: color;

  statuses: IMoldStatusWUNK[];
}
export default function ColorStatus({ color, statuses }: iProps) {
  const {
    state: {
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  function replaceSpacesWithDash(str: string): string {
    return str.replace(/ /g, "-");
  }
  function generateStatuses(): ReactNode {
    if (statuses.length > 2) {
      let i = 0;
      return statuses.map((statusObj) => {
        i++;
        if (i <= 4)
          return (
            <Link
              to={`/part/${statusObj.partId}?color=${color.id}&mold=${statusObj.moldId}`}
              onClick={(event) => {
                if (statusObj.status == "no status") event.preventDefault();
              }}
              key={i}
              className={`flag-status tag-${replaceSpacesWithDash(
                statusObj.status.trim()
              )} flag-sizebyqty-${statuses.length > 4 ? 4 : statuses.length}`}
            >
              {statusObj.status.toUpperCase()[0]}
              {statusObj.unknown ? "*" : ""}
            </Link>
          );
      });
    } else {
      return statuses.map((statusObj) => (
        <Link
          to={`/part/${statusObj.partId}?color=${color.id}&mold=${statusObj.moldId}`}
          key={statusObj.moldId}
          onClick={(event) => {
            if (statusObj.status == "no status") event.preventDefault();
          }}
          className={
            "flag-status tag-" + replaceSpacesWithDash(statusObj.status.trim())
          }
        >
          {statusObj.status.toUpperCase()}
        </Link>
      ));
    }
  }

  return (
    <div className="color-row">
      <div className="table-id">
        {getPrefColorIdString(color, prefPayload.prefId)}
      </div>
      <Link
        to={`/color/${color.id}`}
        className="flag flag-fill"
        style={{
          backgroundColor: "#" + color.hex,
          color: getTextColor(color.hex),
        }}
      >
        {getPrefColorName(color, prefPayload.prefName)}
      </Link>
      {generateStatuses()}
    </div>
  );
}
