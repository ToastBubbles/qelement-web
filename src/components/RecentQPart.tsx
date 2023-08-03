import { Ribbon, RibbonContainer } from "react-ribbons";
import { Link } from "react-router-dom";
import { IQPartDTOInclude, IQPartDTOIncludeLess } from "../interfaces/general";
import {
  filterImages,
  formatDate,
  imagePath,
  sortStatus,
} from "../utils/utils";

interface IProps {
  qpart?: IQPartDTOInclude;
  qpartl?: IQPartDTOIncludeLess;
}

export default function RecentQPart({ qpart, qpartl }: IProps) {
  let thisqpart: IQPartDTOIncludeLess;

  if (qpart) {
    thisqpart = {
      id: qpart.id,
      type: qpart.type,
      mold: qpart.mold,
      color: qpart.color,
      creator: qpart.creator,
      note: qpart.note,
      elementIDs: qpart.elementIDs,
      images: qpart.images,
      partStatuses: qpart.partStatuses,
      createdAt: qpart.createdAt,
      approvalDate: qpart.approvalDate,
    };
  } else if (qpartl) {
    thisqpart = qpartl;
  } else {
    return <p>Data mismatch!</p>;
  }
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

  if (thisqpart) {
    const age = calculateHoursBetweenDates(thisqpart.approvalDate);
    const images = filterImages(thisqpart.images);
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
          to={`/part/${thisqpart.mold.parentPart.id}?color=${thisqpart.color.id}`}
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
                sortStatus(thisqpart.partStatuses)[0].status
              }
            >
              {sortStatus(thisqpart.partStatuses)[0].status}
            </div>
          </div>
          <div>
            <div>
              {thisqpart.mold.parentPart.name} ({thisqpart.mold.number})
            </div>
            <div className="listing-color">
              <div
                className={"listing-color-swatch " + thisqpart.color.type}
                style={{ backgroundColor: "#" + thisqpart.color.hex }}
              ></div>
              <div>
                {thisqpart.color.bl_name
                  ? thisqpart.color.bl_name
                  : thisqpart.color.tlg_name}
              </div>
            </div>
            <div style={{ fontSize: "0.8em" }}>
              Added: {formatDate(thisqpart.approvalDate)}
            </div>
          </div>
        </Link>
      </RibbonContainer>
    );
  } else return <div className="listing new-listing">Loading...</div>;
}
