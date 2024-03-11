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
  delayBtn?: boolean;
  content: string;
  closePopup: () => void;
  fn: () => void;
}

export default function ConfirmPopup({
  delayBtn = true,
  content,
  closePopup,
  fn,
}: IProps) {
  const [btnReady, setBtnReady] = useState<boolean>(false);
  if (delayBtn && !btnReady) {
    setTimeout(() => {
      setBtnReady(true);
    }, 1500);
  }
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
          <h3>{content}</h3>
          <div>
            <button
              disabled={delayBtn && !btnReady}
              className="formInputNM"
              onClick={() => {
                fn();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
