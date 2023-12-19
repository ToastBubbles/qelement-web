import { Ribbon, RibbonContainer } from "react-ribbons";
import { IWantedDTOGET } from "../interfaces/general";
import showToast, {
  Mode,
  filterImages,
  getTier,
  imagePath,
  sortStatus,
} from "../utils/utils";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "react-query";
import axios from "axios";

interface iProps {
  myWantedPart: IWantedDTOGET;
  refetchFn: () => void;
}
export default function TopFiveCard({ myWantedPart, refetchFn }: iProps) {
  const [isHovered, setHovered] = useState(false);
  const images = filterImages(myWantedPart.qpart.images);
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

  interface wantedDelete {
    wantedId: number;
    userId: number;
  }
  const wantedMutation = useMutation({
    mutationFn: (removalDTO: wantedDelete) =>
      axios.post(`http://localhost:3000/userFavorite/remove`, removalDTO),
    onSuccess: (e) => {
      if (e.data.code == 200) {
        showToast(`Successfully removed part from list!`, Mode.Success);
        refetchFn();
      } else {
        showToast(`Error removing part!`, Mode.Warning);
        console.log(e.data);
      }
    },
  });
  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const status = sortStatus(
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
  function getRating(): number {
    if (myWantedPart.qpart.ratings.length > 0) {
      let total = 0;
      let count = 0;
      for (const rating of myWantedPart.qpart.ratings) {
        total += rating.rating;
        count++;
      }
      return Math.floor(total / count);
    } else {
      return -1;
    }
  }
  const rating = getRating();
  const tier = getTier(rating);
  return (
    <Link
      to={`/part/${myWantedPart.qpart.mold.parentPart.id}?color=${myWantedPart.qpart.color.id}`}
      className="topfive-card clickable"
      style={{ borderColor: "#" + myWantedPart.qpart.color.hex }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <RibbonContainer>
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
        {isHovered && (
          <div
            style={{
              position: "absolute",
              top: "2px",
              right: "2px",
              cursor: "pointer",
              zIndex: 20,
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              wantedMutation.mutate({
                userId: myWantedPart.userId,
                wantedId: myWantedPart.id,
              });
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="var(--lt-red)"
              className="bi bi-x"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
            </svg>
            <div className="white-fill"></div>
          </div>
        )}
        <div className="topfive-img-container">
          <img
            src={
              images.length > 0
                ? imagePath + primaryImage.fileName
                : "/img/missingimage.png"
            }
          />
        </div>
        <div>
          {myWantedPart.qpart.mold.parentPart.name} (
          {myWantedPart.qpart.mold.number})
        </div>
        <div className="topfive-hr"></div>
        <div className="topfive-body">
          <div>
            {myWantedPart.qpart.color.bl_name
              ? myWantedPart.qpart.color.bl_name
              : ""}
          </div>
          <div className="topfive-body-2">
            {myWantedPart.qpart.color.tlg_name
              ? myWantedPart.qpart.color.tlg_name
              : ""}
          </div>
          <div className="topfive-body-2">
            {myWantedPart.qpart.color.bo_name
              ? myWantedPart.qpart.color.bo_name
              : ""}
          </div>
        </div>
        <div className={"topfive-tier " + tier}>{tier.toUpperCase()}</div>
      </RibbonContainer>
    </Link>
  );
}
