import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { IQPartDTOInclude } from "../interfaces/general";
import { Dispatch, SetStateAction, useContext } from "react";
import { AppContext } from "../context/context";
interface iProps {
  qpart: IQPartDTOInclude;
  setter: Dispatch<SetStateAction<number>>;
  close: Dispatch<SetStateAction<boolean>>;
  //  refetchFn: () => void;
}
export default function QPartDropdownRow({ qpart, setter, close }: iProps) {
  const {
    state: {
      jwt: { token, payload },
    },
    dispatch,
  } = useContext(AppContext);
  return (
    <div
      className="qpart-dd-row clickable"
      onClick={() => {
        setter(qpart.id);
        close(false);
      }}
    >
      <div
        className={"qpart-dd-row-swatch " + qpart.color.type}
        style={{ backgroundColor: "#" + qpart.color.hex }}
      ></div>
      <div>
        <div className="d-flex">
          <div style={{ width: "2em" }}>BL:</div>
          {qpart.color.bl_name ? qpart.color.bl_name : "Unknown"}
        </div>
        <div
          className="d-flex"
          style={{ fontSize: "0.75em", color: "var(--lt-grey)" }}
        >
          <div style={{ width: "2.75em" }}>TLG:</div>
          {qpart.color.tlg_name}
        </div>
      </div>
    </div>
  );
}
