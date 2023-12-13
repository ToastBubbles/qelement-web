import { ICommentDTO } from "../interfaces/general";
import { formatDate } from "../utils/utils";
import { IRowVals } from "../views/edit/parts/AddKnownView";
import ColorTextField from "./ColorTextField";

interface IProps {
  id: number;
  index: number;
  showElementID: boolean;
  values: IRowVals;
  onChange: (newValues: IRowVals) => void;
  onRemove: () => void;
}

function KnownPartRow({
  id,
  showElementID,
  index,
  values,
  onChange,
  onRemove,
}: IProps) {
  return (
    <div className="w-100 d-flex jc-space-b" style={{ marginBottom: "1em" }}>
      <div>{index + 1}</div>
      <ColorTextField data="s" />
      <input
        type="text"
        placeholder="Optional"
        value={values.elementId}
        onChange={(e) =>
          onChange({ colorId: values.colorId, elementId: e.target.value })
        }
      />
      <button onClick={onRemove}>Remove</button>
    </div>
  );
}

export default KnownPartRow;
