import axios from "axios";
import { useQuery } from "react-query";

import { Link } from "react-router-dom";
import { ICategory } from "../../interfaces/general";

export default function AllPartCategoriesView() {
  const { data: catData } = useQuery("allCats", () =>
    axios.get<ICategory[]>("http://localhost:3000/categories")
  );
  if (catData) {
    return (
      <>
        <div className="mx-w">
          <h1>Part Categories</h1>
          <div className="parts-view">
            {catData.data.map((cat) => {
              return (
                <Link key={cat.id} to={"/part-categories/" + cat.id}>
                  {cat.name}
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
