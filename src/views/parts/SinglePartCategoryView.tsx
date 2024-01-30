import axios from "axios";
import { useQuery } from "react-query";
import { ICategory, part } from "../../interfaces/general";
import { Link, useParams } from "react-router-dom";

export default function SinglePartCategoryView() {
  const { catId } = useParams();
  const { data: catData } = useQuery("singleCat", () =>
    axios.get<ICategory>(`http://localhost:3000/categories/id/${catId}`)
  );
  const { data: partsData } = useQuery("singleCatParts", () =>
    axios.get<part[]>(`http://localhost:3000/parts/byCatId/${catId}`)
  );

  if (catData && partsData) {
    return (
      <>
        <div className="mx-w">
          <h1>{catData.data.name}</h1>
          <div className="parts-view">
            {partsData.data.map((part) => {
              return (
                <Link key={part.id} className="link" to={"/part/" + part.id}>
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
