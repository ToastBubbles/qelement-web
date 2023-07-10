import { Ribbon, RibbonContainer } from "react-ribbons";
import { Link } from "react-router-dom";
import { IQPartDTOInclude, color, part } from "../interfaces/general";
import {
  filterImages,
  formatDate,
  imagePath,
  sortStatus,
} from "../utils/utils";

interface IProps {
  qpart: IQPartDTOInclude;
}

export default function RecentQPart({ qpart }: IProps) {
  function calculateHoursBetweenDates(startDateStr: string): number {
    const endDate = new Date();
    const startDate = new Date(startDateStr);
    const millisecondsPerHour = 1000 * 60 * 60;
    const timeDifference = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(timeDifference / millisecondsPerHour);
    return hours;
  }
  function makeHoursString(age: number): string {
    if (age == 0) {
      return "Just now!";
    } else if (age == 1) {
      return "1hr ago";
    } else {
      return `${age}hrs ago`;
    }
  }

  if (qpart) {
    let age = calculateHoursBetweenDates(qpart.createdAt);
    let images = filterImages(qpart.images);
    let primaryImage = images[images.length - 1];
    for (let i = images.length - 1; i >= 0; i--) {
      if (images[i].type == "part") {
        primaryImage = images[i];
      }
      if (images[i].isPrimary) {
        primaryImage = images[i];
        break;
      }
    }

    return (
      <RibbonContainer>
        {age <= 24 && (
          <Ribbon
            side="right"
            type="corner"
            size="normal"
            backgroundColor="var(--dk-grey)"
            color="var(--lt-grey)"
            withStripes={false}
            fontFamily="lexend"
          >
            {makeHoursString(age)}
          </Ribbon>
        )}
        <Link
          to={`/part/${qpart.mold.parentPart.id}?color=${qpart.color.id}`}
          className="listing new-listing"
        >
          <div className="listing-img">
            <img
              src={
                images.length > 0
                  ? imagePath + primaryImage.fileName
                  : "/img/missingimage.png"
              }
            />
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
                {qpart.color.bl_name
                  ? qpart.color.bl_name
                  : qpart.color.tlg_name}
              </div>
            </div>
            <div style={{ fontSize: "0.8em" }}>
              Added: {formatDate(qpart.createdAt)}
            </div>
          </div>
        </Link>
      </RibbonContainer>
    );
  } else return <div className="listing new-listing">Loading...</div>;
}
