import { useContext, useState } from "react";
import { AppContext } from "../../context/context";
import axios from "axios";
import { useQuery } from "react-query";
import { ICollectionDTOGET, IGoalDTOExtended } from "../../interfaces/general";
import LoadingPage from "../../components/LoadingPage";
import PopupGoal from "../../components/PopupGoal";
import Goal from "../../components/Goal";
import CollectionPart from "../../components/CollectionPart";
import { paginate } from "../../utils/utils";
import PaginationControl from "../../components/PaginationControl";

export default function CollectionView() {
  const {
    state: {
      jwt: { token, payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const [goalPopupOpen, setGoalPopupOpen] = useState(false);

  const { data: mycollectionData } = useQuery({
    queryKey: "mycollection",
    queryFn: () => {
      return axios.get<ICollectionDTOGET[]>(
        `http://localhost:3000/userInventory/id/${payload.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    staleTime: 100,
    enabled: !!payload.id,
  });

  const { data: myGoalData, refetch: myGoalRefetch } = useQuery({
    queryKey: "mygoals",
    queryFn: () => {
      return axios.get<IGoalDTOExtended[]>(
        `http://localhost:3000/userGoal/id/${payload.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    staleTime: 100,
    enabled: !!payload.id,
  });
  if (mycollectionData && myGoalData) {
    const goals = myGoalData.data;
    const myParts = mycollectionData.data;

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(myParts.length / itemsPerPage);

    const paginatedItems =
      myParts.length > itemsPerPage
        ? paginate(myParts, currentPage, itemsPerPage)
        : myParts;
    return (
      <>
        <div className="mx-w">
          {goalPopupOpen && (
            <PopupGoal
              userId={payload.id}
              closePopup={() => setGoalPopupOpen(false)}
              refetchFn={myGoalRefetch}
            />
          )}
          <h1>Your Goals</h1>
          <div>
            <div className="d-flex">
              {goals.length > 0 ? (
                goals.map((goal) => (
                  <Goal key={goal.id} goal={goal} collection={myParts} />
                ))
              ) : (
                <p>You currently don't have any goals set up!</p>
              )}
            </div>
            <div className="clickable" onClick={() => setGoalPopupOpen(true)}>
              Create New Goal
            </div>
          </div>
          <h1>Your Collection</h1>
          <div className="col-guide">
            <div>
              {prefPayload.isCollectionVisible
                ? "Your Collection is visible to others"
                : "Your Collection is hidden from others"}
            </div>
            {prefPayload.differentiateMaterialsInCollection && (
              <div style={{ width: "6.25em" }}>Material</div>
            )}
            <div>Sale</div>
            <div>Trade</div>
            <div>Qty</div>
          </div>
          <div>
            {myParts.length > 0 ? (
              <div>
                {paginatedItems.map((myqpart) => (
                  <CollectionPart key={myqpart.id} data={myqpart} />
                ))}
                {myParts.length > itemsPerPage && (
                  <PaginationControl
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </div>
            ) : (
              <p>Your collection is empty!</p>
            )}
          </div>
        </div>
      </>
    );
  } else {
    return <LoadingPage />;
  }
}
