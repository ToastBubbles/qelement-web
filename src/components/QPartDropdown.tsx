import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { IQPartDTOInclude, IQPartDTOIncludeLess } from "../interfaces/general";
import QPartDropdownRow from "./QPartDorpdownRow";
import { Dispatch, SetStateAction } from "react";

interface iProps {
  qparts: IQPartDTOInclude[];
  setter: Dispatch<SetStateAction<number>>;
  close: Dispatch<SetStateAction<boolean>>;
  //  refetchFn: () => void;
}
export default function QPartDropdown({ qparts, setter, close }: iProps) {
  return (
    <div className="qpart-dropdown">
      {qparts.map((qpart) => (
        <QPartDropdownRow qpart={qpart} setter={setter} close={close} />
      ))}
    </div>
  );
}
