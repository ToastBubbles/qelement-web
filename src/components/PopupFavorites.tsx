import { IQPartDTOInclude } from "../interfaces/general";
import ConditionSlider from "./ConditionSlider";
import MyToolTip from "./MyToolTip";
import SliderToggle from "./SliderToggle";

interface IProps {
  qpart: IQPartDTOInclude;
  closePopup: () => void;
}

export default function PopupFavorites({ qpart, closePopup }: IProps) {
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
        <h1 style={{ marginBottom: "0.5em" }}>Add to my Favorites:</h1>
        <h3 style={{ marginBottom: "1.5em" }}>
          {qpart.color.bl_name ? qpart.color.bl_name : qpart.color.tlg_name}{" "}
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
                    This allows you to add parts to your lists. As of right now,
                    lists are only for your referrence and to allow others to
                    see what parts you are interested in (you can disable
                    visibility of this feature in your settings). Currently
                    there is no functionality built for this yet, so no
                    notifications sadly.
                  </div>
                  <div>See below for a guide:</div>
                  <ul className="tt-list">
                    <li>
                      <span>Wanted:</span> Use this to keep track of parts you
                      are trying to collect, can be viewed by others if allowed
                    </li>
                    <li>
                      <span>Favorites:</span> Just a general list for parts you
                      are interested in or like
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
            // onChange={(e) =>

            // }
            // value={newPart.id}
            // disabled={newPart.CatId == -1}
          >
            <option value="0">Wanted List</option>
            <option value="1">Favorites</option>
            <option value="2">Top 5</option>
            <option value="3">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}
