import { Link } from "react-router-dom";
import { color } from "../interfaces/general";

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
              return (
                <Link
                  key={color.id}
                  to={"/color/" + color.id}
                  className="flag flag-spacer white-text"
                  style={{ backgroundColor: "#" + color.hex }}
                >
                  {color.bl_name.length == 0 ? color.tlg_name : color.bl_name}
                </Link>
              );
            })}
        </div>
      </>
    );
}

export default SimilarColorBanner;
