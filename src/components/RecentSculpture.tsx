import { Ribbon, RibbonContainer } from "react-ribbons";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { ISculptureDTO } from "../interfaces/general";
import { filterImages, formatDate, imagePath } from "../utils/utils";
import { AppContext } from "../context/context";

interface IProps {
  sculpture: ISculptureDTO;
  hideDate?: boolean;
  disableLinks?: boolean;
}

export default function RecentSculpture({
  sculpture,
  hideDate = false,
  disableLinks = false,
}: IProps) {
  const {
    state: {
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);

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

  if (sculpture) {
    const age = calculateHoursBetweenDates(sculpture.approvalDate);
    const images = filterImages(sculpture.images);
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
          to={`/sculpture/${sculpture.id}`}
          className={`listing link new-listing ${
            disableLinks ? " disabled-link" : ""
          }`}
        >
          <div className="listing-img rm-padding">
            <img
              src={
                images.length > 0
                  ? imagePath + primaryImage.fileName
                  : "/img/missingimage.png"
              }
            />
            {/* <div
              className={
                "recentQPartStatus tag-" +
                sortStatus(thisqpart.partStatuses)[0].status
              }
            >
              {sortStatus(thisqpart.partStatuses)[0].status}
            </div> */}
          </div>
          <div>
            <div>
              {sculpture.name} ({sculpture.brickSystem})
            </div>
            <div className="listing-color">
              <div>{getUniquePartCount()}</div>
            </div>
            {!hideDate && (
              <div style={{ fontSize: "0.8em" }}>
                Added: {formatDate(sculpture.approvalDate)}
              </div>
            )}
          </div>
        </Link>
      </RibbonContainer>
    );
  } else return <div className="listing new-listing">Loading...</div>;

  function getUniquePartCount(): string {
    if (sculpture.inventory == undefined || sculpture.inventory == null)
      return "";
    let output = 0;
    sculpture.inventory.forEach((item) => {
      if (item.SculptureInventory.approvalDate != null) output++;
    });
    return output + "  parts listed";
  }
}
