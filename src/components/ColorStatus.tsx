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

  function generateStatuses(): ReactNode {
    if (statuses.length > 2) {
      let i = 0;
      return (
        //   <div key={color.id} className="color-row">
        statuses.map((statusObj) => {
          i++;
          if (i <= 4)
            return (
              <div
                key={i}
                className={`flag-status tag-${
                  statusObj.status == "no status"
                    ? "nostatus"
                    : statusObj.status
                } flag-sizebyqty-${statuses.length > 4 ? 4 : statuses.length}`}
              >
                {statusObj.status.toUpperCase()[0]}
                {statusObj.unknown ? "*" : ""}
              </div>
            );
        })

        //   </div>
      );
    } else {
      return (
        //   <div key={color.id} className="color-row">
        statuses.map((statusObj) => (
          <div
            className={
              "flag-status tag-" +
              (statusObj.status == "no status" ? "nostatus" : statusObj.status)
            }
          >
            {statusObj.status.toUpperCase()}
          </div>
        ))

        //   </div>
      );
    }
  }

  return (
    <div className="color-row">
      <div className="table-id">
        {getPrefColorIdString(color, prefPayload.prefId)}
      </div>
      <Link
        to={`/part/${1}?color=${color.id}`}
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
