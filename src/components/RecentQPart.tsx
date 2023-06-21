import axios from "axios";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { IQPartDTOInclude, color, part } from "../interfaces/general";
import { formatDate, sortStatus } from "../utils/utils";

interface IProps {
  qpart: IQPartDTOInclude;
}

export default function RecentQPart({ qpart }: IProps) {
  console.log(qpart);

  if (qpart) {
    return (
      <Link
        to={`/part/${qpart.mold.parentPart.id}?color=${qpart.color.id}`}
        className="listing new-listing"
      >
        <div className="listing-img">
          <div
            className={
              "recentQPartStatus tag-" +
              sortStatus(qpart.partStatuses)[0].status
            }
          >
            {sortStatus(qpart.partStatuses)[0].status}
          </div>
        </div>
        <div>
          <div>
            {qpart.mold.parentPart.name} ({qpart.mold.number})
          </div>
          <div className="listing-color">
            <div
              className={"listing-color-swatch " + qpart.color.type}
              style={{ backgroundColor: "#" + qpart.color.hex }}
            ></div>
            <div>
              {qpart.color.bl_name ? qpart.color.bl_name : qpart.color.tlg_name}
            </div>
          </div>
          <div style={{ fontSize: "0.8em" }}>
            Added: {formatDate(qpart.createdAt)}
          </div>
        </div>
      </Link>
    );
  } else return <div className="listing new-listing">Loading...</div>;
}
