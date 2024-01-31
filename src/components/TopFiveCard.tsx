import { Ribbon, RibbonContainer } from "react-ribbons";
import {
  IDeletionDTO,
  IQPartDTOInclude,
  IWantedDTOGET,
} from "../interfaces/general";
import showToast, {
  Mode,
  filterImages,
  getTier,
  imagePath,
  sortStatus,
} from "../utils/utils";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { useMutation } from "react-query";
import axios from "axios";
import OnHoverX from "./OnHoverX";
import { AppContext } from "../context/context";

interface iProps {
  myWantedPart: IWantedDTOGET;
  refetchFn?: () => void;
  isMine?: boolean;
}
export default function TopFiveCard({
  myWantedPart,
  refetchFn,
  isMine = true,
}: iProps) {
  console.log(myWantedPart);
  const {
    state: {
      jwt: { token },
    },
  } = useContext(AppContext);
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

  const wantedMutation = useMutation({
    mutationFn: (removalDTO: IDeletionDTO) =>
      axios.post(`http://localhost:3000/userFavorite/remove`, removalDTO, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (e) => {
      if (e.data.code == 200) {
        showToast(`Successfully removed part from list!`, Mode.Success);
        if (refetchFn) refetchFn();
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
      className="topfive-card clickable link"
      style={{ borderColor: "#" + myWantedPart.qpart.color.hex }}
      onMouseEnter={() => {
        if (isMine) handleMouseEnter;
      }}
      onMouseLeave={() => {
        if (isMine) handleMouseLeave;
      }}
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
        {isHovered && isMine && <OnHoverX onClickFn={removeFromWanted} />}
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
  function removeFromWanted() {
    wantedMutation.mutate({
      userId: myWantedPart.userId,
      itemToDeleteId: myWantedPart.id,
    });
  }
}
