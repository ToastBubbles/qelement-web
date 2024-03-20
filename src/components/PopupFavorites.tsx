import axios from "axios";
import { useContext, useState } from "react";
import { useMutation } from "react-query";
import { AppContext } from "../context/context";
import { IQPartDTOInclude, IWantedDTO } from "../interfaces/general";
import showToast, { Mode, getPrefColorName } from "../utils/utils";
import MyToolTip from "./MyToolTip";

interface IProps {
  qpart: IQPartDTOInclude;
  closePopup: () => void;
}

export default function PopupFavorites({ qpart, closePopup }: IProps) {
  const {
    state: {
      jwt: { token, payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const initialValues: IWantedDTO = {
    qpartId: qpart.id || -1,
    userId: payload.id || -1,
    type: "wanted",
  };

  const [wantedObj, setWantedObj] = useState<IWantedDTO>(initialValues);

  const wantedMutation = useMutation({
    mutationFn: (wantedDTO: IWantedDTO) =>
      axios.post(`http://localhost:3000/userFavorite/add`, wantedDTO, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (e) => {
      if (e.data.code == 200) {
        showToast(`Added to your ${wantedObj.type} list!`, Mode.Success);
        closePopup();
      } else if (e.data.code == 501) {
        showToast(
          `This part already exists in your ${wantedObj.type} list, to update the quantity, visit your ${wantedObj.type} list page.`,
          Mode.Warning
        );
        console.log(e.data);
      } else if (e.data.code == 502) {
        showToast(
          `You already have 5 items in your Top 5, please remove one before adding more`,
          Mode.Warning
        );
        console.log(e.data);
      } else {
        showToast("Add failed", Mode.Error);
        console.log(e.data);
      }
      //   qpartRefetch();
    },
  });
  return (
    <div className="popup-container">
      <div className="popup-body">
        <button className="popup-close" onClick={closePopup}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </button>
        <div className="popup-inner-body">
          <h1 style={{ marginBottom: "0.5em" }}>Add to my Favorites:</h1>
          <h3 style={{ marginBottom: "1.5em" }}>
            {getPrefColorName(qpart.color, prefPayload.prefName)}{" "}
            {qpart.mold.parentPart.name} ({qpart.mold.number})
          </h3>
          <div className="w-100 d-flex jc-space-b my-1">
            <label htmlFor="favesDrop">
              Add to:{" "}
              <MyToolTip
                content={
                  <div
                    style={{ maxWidth: "20em" }}
                    className="d-flex flex-col jc-start"
                  >
                    <div>
                      This allows you to add parts to your lists. As of right
                      now, lists are only for your referrence and to allow
                      others to see what parts you are interested in (you can
                      disable visibility of this feature in your settings).
                      Currently there is no functionality built for this yet, so
                      no notifications sadly.
                    </div>
                    <div>See below for a guide:</div>
                    <ul className="tt-list">
                      <li>
                        <span>Wanted:</span> Use this to keep track of parts you
                        are trying to collect, can be viewed by others if
                        allowed
                      </li>
                      <li>
                        <span>Favorites:</span> Just a general list for parts
                        you are interested in or like
                      </li>
                      <li>
                        <span>Top 5:</span> This is for your top 5 most wanted
                        parts, you can only add 5 parts to this at ta time.
                      </li>
                      <li>
                        <span>Other:</span> Just a generic list for you to keep
                        track of, and referrence parts if you choose
                      </li>
                    </ul>
                  </div>
                }
                id="faveTip"
              />
            </label>
            <select
              name="favesDrop"
              id="favesDrop"
              className="w-50 formInput"
              onChange={(e) =>
                setWantedObj((wantedObj) => ({
                  ...wantedObj,
                  ...{ type: e.target.value },
                }))
              }
              value={wantedObj.type}
            >
              <option value="wanted">Wanted List</option>
              <option value="favorite">Favorites</option>
              <option value="topfive">Top 5</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <button
              className="formInputNM"
              onClick={() => {
                if (wantedObj.userId != -1 && wantedObj.qpartId != -1) {
                  console.log("adding...");
                  wantedMutation.mutate(wantedObj);
                } else {
                  showToast(
                    `Error adding to your ${wantedObj.type} list.`,
                    Mode.Error
                  );
                }
              }}
            >
              Add Part
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
