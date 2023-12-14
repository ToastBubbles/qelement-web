import axios from "axios";
import { useQuery } from "react-query";
import { category } from "../../interfaces/general";
import { Link } from "react-router-dom";

export default function AllSculptureView() {
  if (true) {
    return (
      <>
        <div className="mx-w">
          <h1>Part Categories</h1>
          <div className="parts-view">
            {/* {catData.data.map((cat) => {
                  return (
                    <Link key={cat.id} to={"/part-categories/" + cat.id}>
                      {cat.name}
                    </Link>
                  );
                })} */}
          </div>
        </div>
      </>
    );
  } else {
    return <p>loading</p>;
  }
}
