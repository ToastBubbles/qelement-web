import { IQPartDTOInclude } from "../interfaces/general";
import ConditionSlider from "./ConditionSlider";
import MyToolTip from "./MyToolTip";
import SliderToggle from "./SliderToggle";

interface IProps {
  qpart: IQPartDTOInclude;
  closePopup: () => void;
}

export default function PopupCollection({ qpart, closePopup }: IProps) {
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
        <h1 style={{ marginBottom: "0.5em" }}>Add to my Collection:</h1>
        <h3 style={{ marginBottom: "1.5em" }}>
          {qpart.color.bl_name ? qpart.color.bl_name : qpart.color.tlg_name}{" "}
          {qpart.mold.parentPart.name} ({qpart.mold.number})
        </h3>
        <div className="w-100 d-flex jc-space-b my-1">
          <div>
            Available for trade?{" "}
            <MyToolTip
              content={
                <div style={{ maxWidth: "20em" }}>
                  This just let's other users know that you are willing to trade
                  this item, other users may reach out to you inquiring about
                  trading for this item. theqelement.com does not facilitate
                  trades, so it is your responsibility to coordinate any
                  potential trades. We recommend trading/selling through trusted
                  mediums to avoid scams.
                </div>
              }
              id="col-trade"
            />
          </div>
          <div>
            <SliderToggle />
          </div>
        </div>
        <div className="w-100 d-flex jc-space-b my-1">
          <div>
            Available for sale?{" "}
            <MyToolTip
              content={
                <div style={{ maxWidth: "20em" }}>
                  This just let's other users know that you are willing to sell
                  this item, other users may reach out to you inquiring about
                  purchasing this item. theqelement.com does not facilitate
                  sales, so it is your responsibility to coordinate any
                  potential sales. We recommend trading/selling through trusted
                  mediums to avoid scams.
                </div>
              }
              id="col-sale"
            />
          </div>
          {/* <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label> */}
          <SliderToggle />
        </div>
        <div className="w-100 d-flex jc-space-b my-1">
          <div>Condition: </div>
          <div>
            <ConditionSlider />
          </div>
        </div>
        <div className="w-100 d-flex jc-space-b my-1">
          <div>Quantity:</div>
          <input className="showSpinner w-20" type="number" defaultValue={1} />
        </div>
        <div className="w-100 d-flex jc-start">Note</div>
        <div className="w-100 d-flex">
          <textarea
            maxLength={255}
            id="collectionNote"
            className="fg-1 formInput"
            rows={5}
            placeholder="Optional"
            // onChange={(e) =>
            //   setNewPart((newPart) => ({
            //     ...newPart,
            //     ...{ partNote: e.target.value },
            //   }))
            // }
            // value={newPart.partNote}
          />
        </div>
      </div>
    </div>
  );
}
