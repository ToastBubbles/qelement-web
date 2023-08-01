import { Dispatch, SetStateAction } from "react";
import { IQPartDTOInclude } from "../interfaces/general";
import QPartDropdownRow from "./QPartDorpdownRow";

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
