import axios from "axios";
import { useQuery } from "react-query";

import { Link } from "react-router-dom";
import { IAPIResponse, ICategory } from "../../interfaces/general";
import { AppContext } from "../../context/context";
import { useContext, useState } from "react";
import EditCategoryPopup from "../../components/EditCategoryPopup";

export default function AllPartCategoriesView() {
  const {
    state: {
      jwt: { token, payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const { data: adminData } = useQuery({
    queryKey: "isAdmin",
    queryFn: () =>
      axios.get<IAPIResponse>(
        `http://localhost:3000/user/checkIfAdmin/${payload.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    retry: false,
    // refetchInterval: 30000,
    enabled: !!payload.id,
  });
  const { data: catData } = useQuery("allCats", () =>
    axios.get<ICategory[]>("http://localhost:3000/categories")
  );
  if (catData) {
    return (
      <>
        <div className="mx-w">
          {showPopup && <EditCategoryPopup closePopup={closePopUp} />}
          <h1>Part Categories</h1>
          <h2 className="lt-black clickable">
            {adminData && adminData.data.code == 200 ? (
              <div onClick={(e) => setShowPopup(true)}>Edit Category Names</div>
            ) : (
              ""
            )}
          </h2>
          <div className="parts-view">
            {catData.data.map((cat) => {
              return (
                <Link key={cat.id} className="link" to={"/part-categories/" + cat.id}>
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
  function closePopUp() {
    setShowPopup(false);
  }
}
