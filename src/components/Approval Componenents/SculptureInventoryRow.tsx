import { IQPartDTOInclude } from "../../interfaces/general";
import { useEffect, useState } from "react";
import RecentQPart from "../RecentQPart";
import { Checkbox } from "@mui/material";

interface IProps {
  qpart: IQPartDTOInclude;
  // refetchFn: () => void;
  sculptureId: number;
  addFn: (sculptureId: number, qpartId: number, type: string) => void;
  removeFn: (sculptureId: number, qpartId: number, type: string) => void;
}

export default function SculptureInventoryRow({
  qpart,
  sculptureId,
  addFn,
  removeFn,
}: IProps) {
  const [checkedForApproval, setCheckedForApproval] = useState<boolean>(false);
  const [checkedForDeletion, setCheckedForDeletion] = useState<boolean>(false);

  useEffect(() => {
    if (checkedForApproval && checkedForDeletion) {
      setCheckedForApproval(false);
      setCheckedForDeletion(false);
    }
    if (checkedForApproval) addFn(sculptureId, qpart.id, "app");
    else removeFn(sculptureId, qpart.id, "app");
  }, [checkedForApproval]);

  useEffect(() => {
    if (checkedForApproval && checkedForDeletion) {
      setCheckedForApproval(false);
      setCheckedForDeletion(false);
    }
    if (checkedForDeletion) addFn(sculptureId, qpart.id, "del");
    else removeFn(sculptureId, qpart.id, "del");
  }, [checkedForDeletion]);

  if (qpart) {
    return (
      <div className="rib-container fg-child d-flex">
        <RecentQPart qpart={qpart} />
        <Checkbox
          checked={checkedForApproval}
          disabled={checkedForDeletion}
          onChange={(e) => setCheckedForApproval(e.target.checked)}
          disableRipple
          color="success"
        />
        <Checkbox
          checked={checkedForDeletion}
          disabled={checkedForApproval}
          onChange={(e) => setCheckedForDeletion(e.target.checked)}
          disableRipple
          color="error"
        />
      </div>
    );
  } else return <p>Loading</p>;
}
