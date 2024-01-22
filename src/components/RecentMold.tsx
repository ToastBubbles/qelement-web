import { RibbonContainer } from "react-ribbons";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { IPartDTO, IPartDTOIncludes, IPartMoldDTO, part } from "../interfaces/general";

import { AppContext } from "../context/context";

interface IProps {
  mold: IPartMoldDTO;
}

export default function RecentMold({ mold }: IProps) {


  const {
    state: {
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);

  if (mold) {


    return (
      <RibbonContainer>
        <Link to={`/part/${mold.parentPart.id}`} className={`listing new-listing`}>
          <div className="listing-img">
            <img src={"/img/missingimage.png"} />
          </div>
          <div>
            <div>{mold.number}</div>
            <div className="lt-black">{mold.parentPart.name}</div>
          </div>
        </Link>
      </RibbonContainer>
    );
  } else return <div className="listing new-listing">Loading...</div>;

}
