import axios from "axios";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { similarColor, color } from "../interfaces/general";

interface IProps {
  similarColors: similarColor[];
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
              //   console.log(color.colorId2);
              const thisColor = getSimilarColorData(color.colorId2);

              return (
                <Link
                  to={"/color/" + thisColor?.id}
                  className="flag flag-spacer"
                  style={{ backgroundColor: "#" + thisColor?.hex }}
                >
                  {thisColor?.bl_name.length == 0
                    ? thisColor?.tlg_name
                    : thisColor?.bl_name}
                </Link>
              );
            })}
          {/* <div>{similarColors.length}</div> */}
        </div>
      </>
    );
}

function getSimilarColorData(cId: number): color | undefined {
  const {
    data: scolData,
    isLoading: scolIsLoading,
    error: scolError,
  } = useQuery({
    queryKey: `color${cId}`,
    queryFn: () => axios.get<color>(`http://localhost:3000/color/id/${cId}`),
    enabled: true,
    retry: false,
  });
  return scolData?.data;
}

export default SimilarColorBanner;
