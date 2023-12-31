import { Dispatch, SetStateAction } from "react";
import { IQPartDTOInclude } from "../interfaces/general";
import QPartDropdownRow from "./QPartDorpdownRow";

interface iProps {
  qparts: IQPartDTOInclude[];
  moldId: number;

  setter: Dispatch<SetStateAction<number>>;
  close: Dispatch<SetStateAction<boolean>>;
  //  refetchFn: () => void;
}
export default function QPartDropdown({
  qparts,
  moldId,
  setter,
  close,
}: iProps) {
  const filteredQParts: IQPartDTOInclude[] = [];

  qparts.forEach((qpart) => {
    if (moldId == -1) {
      filteredQParts.push(qpart);
    } else {
      if (qpart.mold.id == moldId) {
        filteredQParts.push(qpart);
      }
    }
  });
  return (
    <div className="qpart-dropdown">
      {filteredQParts.map((qpart) => (
        <QPartDropdownRow
          key={qpart.id}
          qpart={qpart}
          setter={setter}
          close={close}
        />
      ))}
    </div>
  );
}
