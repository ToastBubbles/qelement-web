import axios from "axios";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import { IQPartDTOInclude, ISculptureDTO } from "../../interfaces/general";
import showToast, { Mode } from "../../utils/utils";
import { useContext, useState } from "react";
import ConfirmPopup from "../ConfirmPopup";
import { AppContext } from "../../context/context";

interface IProps {
  sculpture: ISculptureDTO;
  refetchFn: () => void;
}

export default function SculptureDetails({ sculpture, refetchFn }: IProps) {
  const {
    state: {
      jwt: { token },
      // userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const sculptureMutation = useMutation({
    mutationFn: (id: number) =>
      axios.post<number>(
        `http://localhost:3000/sculpture/approve`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onError: () => {
      showToast("401 Permissions Error", Mode.Error);
    },
    onSuccess: () => {
      refetchFn();
      showToast("Sculpture approved!", Mode.Success);
    },
  });
  const sculptureDeleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios.post<number>(
        `http://localhost:3000/sculpture/deny`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onError: () => {
      showToast("401 Permissions Error", Mode.Error);
    },
    onSuccess: () => {
      refetchFn();
      showToast("Sculpture denied!", Mode.Info);
    },
  });

  if (sculpture) {
    console.log(sculpture);

    return (
      <div className="coldeet">
        {showPopup && (
          <ConfirmPopup
            content="Are you sure you want to delete this Status?"
            fn={denyRequest}
            closePopup={closePopUp}
          />
        )}
        <div>
          <div>Name:</div>
          <div>{sculpture.name}</div>
        </div>
        <div>
          <div>System:</div>
          <div>{sculpture.brickSystem}</div>
        </div>

        <div>
          <div>Year Made:</div>
          <div>{sculpture.yearMade}</div>
        </div>
        <div>
          <div>Tear Retired:</div>
          <div>{sculpture.yearRetired}</div>
        </div>
        <div>
          <div>Location:</div>
          <div>{sculpture.location}</div>
        </div>
        <div style={{ maxWidth: "40em", justifyContent: 'start' }} className="d-flex flex-wrap">
          <div>Keywords:</div>
          {/* <div className="wrap-string">{sculpture.keywords}</div> */}
          {sculpture.keywords.length > 0 &&
            sculpture.keywords.split(";").map((keyword) => (
              <div className="new-keyword" key={keyword}>
                {keyword}
              </div>
            ))}
        </div>
        <div>
          <div>Note:</div>
          <div>{sculpture.note}</div>
        </div>
        <div>
          <div>Requestor:</div>
          <div>
            {sculpture.creator.name} ({sculpture.creator.email})
          </div>
        </div>
        <div style={{ justifyContent: "end" }}>
          <button onClick={() => sculptureMutation.mutate(sculpture.id)}>
            Approve
          </button>
          <div style={{ width: "1em", textAlign: "center" }}>|</div>
          <button onClick={() => setShowPopup(true)}>Deny</button>
        </div>
      </div>
    );
  } else return <p>Loading</p>;

  function closePopUp() {
    setShowPopup(false);
  }
  function denyRequest() {
    sculptureDeleteMutation.mutate(sculpture.id);
    setShowPopup(false);
  }
}
