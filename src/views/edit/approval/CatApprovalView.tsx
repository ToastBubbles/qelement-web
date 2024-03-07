import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { IAPIResponse, ICategory } from "../../../interfaces/general";
import showToast, { Mode } from "../../../utils/utils";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import ConfirmPopup from "../../../components/ConfirmPopup";
import { AppContext } from "../../../context/context";

export default function ApproveCatView() {
  const {
    state: {
      jwt: { token },
      // userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const {
    data: catData,
    isFetched,
    refetch,
  } = useQuery("notApprovedCats", () =>
    axios.get<ICategory[]>("http://localhost:3000/categories/notApproved")
  );
  const catMutation = useMutation({
    mutationFn: (id: number) =>
      axios.post<IAPIResponse>(
        `http://localhost:3000/categories/approve`,
        {
          id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onError: (e) => {
      showToast("401 Permissions Error", Mode.Error);
    },

    onSuccess: (e) => {
      if (e.data.code == 200) {
        refetch();
        showToast("Category approved!", Mode.Success);
      } else {
        showToast("Error adding category", Mode.Error);
      }
    },
  });

  const catDeleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios.post<IAPIResponse>(
        `http://localhost:3000/categories/deny`,
        {
          id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onError: (e) => {
      showToast("401 Permissions Error", Mode.Error);
    },
    onSuccess: (e) => {
      if (e.data.code == 200) {
        refetch();
        showToast("Category deleted...", Mode.Info);
      } else {
        showToast("Error deleting category", Mode.Error);
      }
    },
  });

  if (isFetched && catData) {
    const cats = catData.data;
    return (
      <>
        <div className="formcontainer">
          {showPopup && (
            <ConfirmPopup
              content="Are you sure you want to delete this Category?"
              closePopup={closePopUp}
              fn={denyRequest}
            />
          )}
          <h1>approve categories</h1>
          <Link className="link" to={"/approve"}>Back to Approval Overview</Link>
          <div className="mainform">
            {cats.length > 0 ? (
              cats.map((cat) => {
                return (
                  <div
                    key={cat.id}
                    className="d-flex jc-space-b w-100 p-1 alternating-children"
                  >
                    <div>{cat.name}</div>
                    <div>
                      <button onClick={() => catMutation.mutate(cat.id)}>
                        Approve
                      </button>
                      <div className="button-spacer">|</div>
                      <button onClick={() => handleDeny(cat.id)}>Delete</button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center p-1">
                nothing to approve right now!
              </div>
            )}
          </div>
        </div>
      </>
    );
    function handleDeny(id: number) {
      setSelectedCategoryId(id);
      setShowPopup(true);
    }
    function closePopUp() {
      setSelectedCategoryId(null);
      setShowPopup(false);
    }
    function denyRequest() {
      if (selectedCategoryId) catDeleteMutation.mutate(selectedCategoryId);
      setShowPopup(false);
    }
  } else {
    return <p>Loading...</p>;
  }
}
