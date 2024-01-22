import { RibbonContainer } from "react-ribbons";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { IPartDTO, IPartDTOIncludes, part } from "../interfaces/general";

import { AppContext } from "../context/context";

interface IProps {
  part: IPartDTOIncludes;
}

export default function RecentPart({ part }: IProps) {
  // console.log("here");

  const {
    state: {
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);

  if (part) {
    // const images = filterImages(part.images);
    // let primaryImage = images[images.length - 1];
    // for (let i = images.length - 1; i >= 0; i--) {
    //   if (images[i].type == "part") {
    //     primaryImage = images[i];
    //   }
    //   if (images[i].isPrimary) {
    //     primaryImage = images[i];
    //     break;
    //   }
    // }
    // console.log(thisqpart);

    return (
      <RibbonContainer>
        <Link to={`/part/${part.id}`} className={`listing new-listing`}>
          <div className="listing-img">
            <img src={"/img/missingimage.png"} />
          </div>
          <div>
            <div>{part.name}</div>
            <div className="lt-black">{showMolds()}</div>
          </div>
        </Link>
      </RibbonContainer>
    );
  } else return <div className="listing new-listing">Loading...</div>;

  function showMolds(): string {
    let output = "";
    if (part.molds.length == 0) return "No part molds exist for this part yet";
    part.molds.forEach((mold) => {
      if (output == "") {
        output = mold.number;
      } else {
        output += `, ${mold.number}`;
      }
    });
    return output;
  }
}
