import { useEffect, useState } from "react";
import ColorTextField from "./ColorTextField";
import { IKnownRow } from "../interfaces/general";

interface IProps {
  index: number;
  values: IKnownRow;
  onChange: (newValues: IKnownRow) => void;
  onRemove: () => void;
}

function KnownPartRow({ index, values, onChange, onRemove }: IProps) {
  const [colorId, setColorId] = useState<number>(-1);

  useEffect(() => {
    if (colorId != -1)
      onChange({ colorId: colorId, elementId: values.elementId });
  }, [colorId]);
  return (
    <div className="w-100 d-flex jc-space-b" style={{ marginBottom: "1em" }}>
      <div>{index + 1}</div>
      <ColorTextField setter={(newColorId) => setColorId(newColorId)} />
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
