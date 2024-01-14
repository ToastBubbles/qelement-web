import axios from "axios";
import { useMutation } from "react-query";
import { ISculptureDTO, ISculptureInventory } from "../../interfaces/general";
import showToast, { Mode } from "../../utils/utils";
import { useState } from "react";
import ConfirmPopup from "../ConfirmPopup";
import RecentSculpture from "../RecentSculpture";
import RecentQPart from "../RecentQPart";

interface IProps {
  sculpture: ISculptureDTO;
  refetchFn: () => void;
}

export default function SculptureInventoryDetails({
  sculpture,
  refetchFn,
}: IProps) {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const sculptureMutation = useMutation({
    mutationFn: (id: number) =>
      axios
        .post<number>(`http://localhost:3000/sculpture/approve`, { id })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err)),
    onSuccess: () => {
      refetchFn();
      showToast("Sculpture approved!", Mode.Success);
    },
  });
  const sculptureDeleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios
        .post<number>(`http://localhost:3000/sculpture/deny`, { id })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err)),
    onSuccess: () => {
      refetchFn();
      showToast("Sculpture denied!", Mode.Info);
    },
  });

  if (sculpture) {
    return (
      <div className="coldeet">
        {showPopup && (
          <ConfirmPopup
            content="Are you sure you want to delete this Status?"
            fn={denyRequest}
            closePopup={closePopUp}
          />
        )}
        <RecentSculpture sculpture={sculpture} />
        <fieldset
          style={{
            marginBottom: "1em",
            maxHeight: "30em",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <legend>Parts Requested</legend>
          {sculpture.inventory.length > 0 ? (
            sculpture.inventory.map((part) => (
              <div className="rib-container fg-child d-flex">
                <RecentQPart qpart={part} />
                
              </div>
            ))
          ) : (
            <div>No Parts...</div>
          )}
        </fieldset>

        {/* <div>
          <div>Requestor:</div>
          <div>
            {sculptureInv.creator.name} ({sculpture.creator.email})
          </div>
        </div> */}
        <div style={{ justifyContent: "end" }}>
          {/* <button onClick={() => sculptureMutation.mutate(sculpture.id)}>
            Approve
          </button> */}
          {/* <div style={{ width: "1em", textAlign: "center" }}>|</div>
          <button onClick={() => setShowPopup(true)}>Deny</button> */}
        </div>
      </div>
    );
  } else return <p>Loading</p>;

  function closePopUp() {
    setShowPopup(false);
  }
  function denyRequest() {
    // sculptureDeleteMutation.mutate(sculpture.id);
    setShowPopup(false);
  }
}
