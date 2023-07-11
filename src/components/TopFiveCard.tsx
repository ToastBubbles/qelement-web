import { Ribbon, RibbonContainer } from "react-ribbons";
import { IQPartDTOIncludeLess, IWantedDTOGET } from "../interfaces/general";
import { filterImages, imagePath, sortStatus } from "../utils/utils";
import { Link } from "react-router-dom";

interface iProps {
  myWantedPart: IWantedDTOGET;
}
export default function TopFiveCard({ myWantedPart }: iProps) {
  let images = filterImages(myWantedPart.qpart.images);
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

  let status = sortStatus(
    myWantedPart.qpart.partStatuses
  )[0].status.toUpperCase();

  function getColor(type: string): string {
    let bg: string;
    let font: string;

    switch (status) {
      case "IDONLY": {
        bg = "#d6a82a";
        font = "#FFF";
        break;
      }
      case "SEEN": {
        bg = "rgb(231, 228, 7)";
        font = "var(--dk-grey)";
        break;
      }
      case "FOUND": {
        bg = "forestgreen";
        font = "#FFF";
        break;
      }
      case "KNOWN": {
        bg = "rgb(107, 131, 184)";
        font = "#FFF";
        break;
      }
      case "OTHER": {
        bg = "rgb(48, 48, 48)";
        font = "#FFF";
        break;
      }
      case "UNKNOWN": {
        bg = "rgb(153, 12, 106)";
        font = "#FFF";
        break;
      }
      default: {
        bg = "var(--dk-grey)";
        font = "#FFF";
        break;
      }
    }
    if (type == "bg") {
      return bg;
    }
    return font;
  }

  return (
    <RibbonContainer className="topfive-card">
      <Ribbon
        side="right"
        type="corner"
        size="large"
        backgroundColor={getColor("bg")}
        color={getColor("font")}
        withStripes={false}
        fontFamily="lexend"
      >
        {status}
      </Ribbon>
      <Link
        to={`/part/${myWantedPart.qpart.mold.parentPart.id}?color=${myWantedPart.qpart.color.id}`}
        className="topfive-img-container"
      >
        <img
          src={
            images.length > 0
              ? imagePath + primaryImage.fileName
              : "/img/missingimage.png"
          }
        />
      </Link>
      <div>
        {myWantedPart.qpart.mold.parentPart.name} (
        {myWantedPart.qpart.mold.number})
      </div>
      <div className="topfive-hr"></div>
    </RibbonContainer>
  );
}
