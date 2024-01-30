import { Ribbon, RibbonContainer } from "react-ribbons";
import { useContext } from "react";
import { Link } from "react-router-dom";
import {
  IQPartDTOInclude,
  IQPartDTOIncludeLess,
  IRibbonOverride,
} from "../interfaces/general";
import {
  filterImages,
  formatDate,
  getPrefColorName,
  imagePath,
  sortStatus,
} from "../utils/utils";
import { AppContext } from "../context/context";

interface IProps {
  qpart?: IQPartDTOInclude;
  qpartl?: IQPartDTOIncludeLess;
  hideDate?: boolean;
  disableLinks?: boolean;
  ribbonOverride?: IRibbonOverride;
}

export default function RecentQPart({
  qpart,
  qpartl,
  hideDate = false,
  disableLinks = false,
  ribbonOverride,
}: IProps) {
  // console.log("here");

  const {
    state: {
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  let thisqpart: IQPartDTOIncludeLess;
  // if (qpart?.partStatuses.length == 0) return <></>;
  if (qpart) {
    thisqpart = {
      id: qpart.id,
      type: qpart.type,
      mold: qpart.mold,
      color: qpart.color,
      creator: qpart.creator,
      note: qpart.note,
      isMoldUnknown: qpart.isMoldUnknown,
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
    // console.log(thisqpart);

    return (
      <RibbonContainer>
        {generateRibbon(age)}
        <Link
          to={`/part/${thisqpart.mold.parentPart.id}?color=${thisqpart.color.id}&mold=${thisqpart.mold.id}`}
          className={`listing link new-listing ${
            disableLinks ? " disabled-link" : ""
          }`}
        >
          <div className="listing-img">
            <img
              src={
                images.length > 0
                  ? imagePath + primaryImage.fileName
                  : "/img/missingimage.png"
              }
            />
            {thisqpart.partStatuses.length > 0 ? (
              <div
                className={
                  "recentQPartStatus tag-" +
                  sortStatus(thisqpart.partStatuses)[0].status
                }
              >
                {sortStatus(thisqpart.partStatuses)[0].status}
              </div>
            ) : (
              <div className={"recentQPartStatus tag-nostatus"}>No Status</div>
            )}
          </div>
          <div>
            <div>
              {thisqpart.mold.parentPart.name} (
              {thisqpart.isMoldUnknown ? "Unknown Mold" : thisqpart.mold.number}
              )
            </div>
            <div className="listing-color">
              <div
                className={"listing-color-swatch " + thisqpart.color.type}
                style={{ backgroundColor: "#" + thisqpart.color.hex }}
              ></div>
              <div>
                {getPrefColorName(thisqpart.color, prefPayload.prefName)}
              </div>
            </div>
            {!hideDate && (
              <div style={{ fontSize: "0.8em" }}>
                Added: {formatDate(thisqpart.approvalDate)}
              </div>
            )}
          </div>
        </Link>
      </RibbonContainer>
    );
  } else return <div className="listing new-listing">Loading...</div>;

  function generateRibbon(age: number): React.ReactNode {
    if (ribbonOverride) {
      return (
        <Ribbon
          side="right"
          type="corner"
          size="normal"
          backgroundColor={ribbonOverride.bgColor}
          color={ribbonOverride.fgColor}
          withStripes={false}
          fontFamily="lexend"
        >
          <div style={{ fontSize: ribbonOverride.fontSize }}>
            {ribbonOverride.content}
          </div>
        </Ribbon>
      );
    }
    if (thisqpart.approvalDate == null) return;
    <Ribbon
      side="right"
      type="corner"
      size="normal"
      backgroundColor="red"
      color="white"
      withStripes={false}
      fontFamily="lexend"
    >
      <div style={{ fontSize: "0.6em" }}>NOT APPROVED</div>
    </Ribbon>;

    if (age <= 24)
      return (
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
      );
    return <></>;
  }
}
