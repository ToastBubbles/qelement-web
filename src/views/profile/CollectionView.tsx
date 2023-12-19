import { useContext, useState } from "react";
import { AppContext } from "../../context/context";
import axios from "axios";
import { useQuery } from "react-query";
import { ICollectionDTOGET, IGoalDTOExtended } from "../../interfaces/general";
import LoadingPage from "../../components/LoadingPage";
import PopupGoal from "../../components/PopupGoal";
import Goal from "../../components/Goal";
import CollectionPart from "../../components/CollectionPart";

export default function CollectionView() {
  const {
    state: {
      jwt: { payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const [goalPopupOpen, setGoalPopupOpen] = useState(false);

  const { data: mycollectionData } = useQuery({
    queryKey: "mycollection",
    queryFn: () => {
      return axios.get<ICollectionDTOGET[]>(
        `http://localhost:3000/userInventory/id/${payload.id}`
      );
    },
    staleTime: 100,
    enabled: !!payload.id,
  });

  const { data: myGoalData } = useQuery({
    queryKey: "mygoals",
    queryFn: () => {
      return axios.get<IGoalDTOExtended[]>(
        `http://localhost:3000/userGoal/id/${payload.id}`
      );
    },
    staleTime: 100,
    enabled: !!payload.id,
  });
  if (mycollectionData && myGoalData) {
    const goals = myGoalData.data;
    const myParts = mycollectionData.data;
    return (
      <>
        <div className="mx-w">
          {goalPopupOpen && (
            <PopupGoal
              userId={payload.id}
              closePopup={() => setGoalPopupOpen(false)}
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
            <div>Sale</div>
            <div>Trade</div>
            <div>Qty</div>
          </div>
          <div>
            {myParts.length > 0 ? (
              myParts.map((myqpart) => (
                <CollectionPart key={myqpart.id} data={myqpart} />
              ))
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
