import axios from "axios";
import { useQuery } from "react-query";
import { category, part } from "../../interfaces/general";
import { Link, useParams } from "react-router-dom";

export default function SinglePartCategoryView() {
  const { catId } = useParams();
  const { data: catData, error: catError } = useQuery("singleCat", () =>
    axios.get<category>(`http://localhost:3000/categories/id/${catId}`)
  );
  const { data: partsData, error: partsError } = useQuery(
    "singleCatParts",
    () => axios.get<part[]>(`http://localhost:3000/parts/byCatId/${catId}`)
  );

  if (catData && partsData) {
    return (
      <>
        <div className="mx-w">
          <h1>{catData.data.name}</h1>
          <div className="parts-view">
            {partsData.data.map((part) => {
              return (
                <Link key={part.id} to={"/part/" + part.id}>
                  {part.name}
                </Link>
              );
            })}
          </div>
        </div>
      </>
    );
  } else {
    return <p>loading</p>;
  }
}
