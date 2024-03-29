import { useMutation } from "react-query";
import { ICollectionDTO, IQPartDTOInclude } from "../interfaces/general";
import ConditionSlider from "./ConditionSlider";
import MyToolTip from "./MyToolTip";
import SliderToggle from "./SliderToggle";
import axios from "axios";
import { useContext, useState } from "react";
import showToast, { Mode, getPrefColorName } from "../utils/utils";
import { AppContext } from "../context/context";

interface IProps {
  qpart: IQPartDTOInclude;
  closePopup: () => void;
}

export default function PopupCollection({ qpart, closePopup }: IProps) {
  const {
    state: {
      jwt: { token, payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const initialValues: ICollectionDTO = {
    forTrade: false,
    forSale: false,
    qpartId: qpart.id || -1,
    userId: payload.id || -1,
    quantity: 1,
    material: "",
    condition: "used",
    note: "",
    availDupes: false,
  };
  const [forTrade, setForTrade] = useState<boolean>(false);
  const [forSale, setForSale] = useState<boolean>(false);
  const [duplicatesOnly, setDuplicatesOnly] = useState<boolean>(false);

  const [collectionObj, setCollectionObj] =
    useState<ICollectionDTO>(initialValues);
  const collectionMutation = useMutation({
    mutationFn: (collectionDTO: ICollectionDTO) =>
      axios.post(`http://localhost:3000/userInventory/add`, collectionDTO, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (e) => {
      if (e.data.code == 200) {
        showToast("Added to your collection!", Mode.Success);
        closePopup();
      } else if (e.data.code == 500) {
        showToast(
          "This part already exists in your collection, to update the quantity, visit your collection page.",
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
        <h1 style={{ marginBottom: "0.5em" }}>Add to my Collection:</h1>
        <h3 style={{ marginBottom: "1.5em" }}>
          {getPrefColorName(qpart.color, prefPayload.prefName)}{" "}
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
            <SliderToggle getter={forTrade} setter={setForTrade} />
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
          <SliderToggle getter={forSale} setter={setForSale} />
        </div>
        <div className="w-100 d-flex jc-space-b my-1">
          <div>
            Availability for duplicates only?{" "}
            <MyToolTip
              content={
                <div style={{ maxWidth: "20em" }}>
                  This will only show this item for sale/trade if you have more
                  than one in your inventory. Only applies if Quantity is
                  greater than 1, if you have two of the same part, but in your
                  collection it shows as one used item, and one new item, this
                  will not apply.
                </div>
              }
              id="col-dupe"
            />
          </div>
          <div>
            <SliderToggle
              getter={duplicatesOnly}
              setter={setDuplicatesOnly}
              disabled={!forSale && !forTrade}
            />
          </div>
        </div>
        <div className="w-100 d-flex jc-space-b my-1">
          <div>Condition: </div>
          <div>
            <ConditionSlider
              // getter={collectionObj.condition}
              setter={setCollectionObj}
            />
          </div>
        </div>
        {prefPayload.differentiateMaterialsInCollection && (
          <div className="w-100 d-flex jc-space-b my-1">
            <div className="d-flex">
              <div>Material:</div>{" "}
              <MyToolTip
                content={
                  <div style={{ maxWidth: "20em" }}>
                    (15 character limit) This is where you can specify the
                    material/type of plastic your part is made of. This is only
                    be visible in your collection, and others may be able to see
                    this depending on your settings. Typical usage would be
                    "PC", "MABS", "PP", "CA", etc. Check out the resources page
                    to learn more: /tools/resources
                  </div>
                }
                id="co-mat"
              />
            </div>
            <input
              className="w-33"
              maxLength={15}
              placeholder="Optional"
              value={collectionObj.material}
              onChange={(e) =>
                setCollectionObj((collectionObj) => ({
                  ...collectionObj,
                  ...{ material: e.target.value.trim() },
                }))
              }
            />
          </div>
        )}
        <div className="w-100 d-flex jc-space-b my-1">
          <div>Quantity:</div>
          <input
            className="showSpinner w-20"
            type="number"
            value={collectionObj.quantity}
            onChange={(e) =>
              setCollectionObj((collectionObj) => ({
                ...collectionObj,
                ...{ quantity: Number(e.target.value) },
              }))
            }
          />
        </div>
        <div className="w-100 d-flex jc-start">Note</div>
        <div className="w-100 d-flex">
          <textarea
            maxLength={255}
            id="collectionNote"
            className="fg-1 formInput"
            rows={5}
            placeholder="Optional"
            value={collectionObj.note}
            onChange={(e) =>
              setCollectionObj((collectionObj) => ({
                ...collectionObj,
                ...{ note: e.target.value },
              }))
            }
          />
        </div>
        <button
          className="formInputNM"
          onClick={() => {
            collectionObj.forSale = forSale;
            collectionObj.forTrade = forTrade;
            collectionObj.availDupes = duplicatesOnly;
            console.log(collectionObj);

            if (
              collectionObj.userId != -1 &&
              collectionObj.quantity > 0 &&
              collectionObj.qpartId != -1 &&
              collectionObj.note.length <= 255
            ) {
              console.log("adding...");
              collectionMutation.mutate(collectionObj);
            } else {
              showToast("Error adding to your collection.", Mode.Error);
            }
          }}
        >
          Add Part
        </button>
      </div>
    </div>
  );
}
