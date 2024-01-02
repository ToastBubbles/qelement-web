import { Link } from "react-router-dom";
import { color } from "../interfaces/general";
import { getTextColor } from "../utils/utils";
import ColorLink from "./ColorLink";

interface IProps {
  similarColors: color[];
}

function SimilarColorBanner({ similarColors }: IProps) {
  if (similarColors.length == 0)
    return <div className="w-100" style={{ marginBottom: "2.55em" }}></div>;
  else
    return (
      <>
        <div className="simBanner">
          <div className="simBannerText">This color is similar to:</div>
          {similarColors.length > 0 &&
            similarColors.map((color) => {
              return <ColorLink key={color.id} color={color} />;
            })}
        </div>
      </>
    );
}

export default SimilarColorBanner;
