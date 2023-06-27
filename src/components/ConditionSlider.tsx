import { useState } from "react";

export enum Condition {
  Damaged,
  Used,
  New,
}

export default function ConditionSlider() {
  const [value, setValue] = useState<number>(1);
  return (
    <div>
      <input
        id="conditionslider"
        className={"conditionSlider slider-" + (Condition[value])}
        type="range"
        min={0}
        value={value}
        max={2}
        step={1}
        onChange={(e) => setValue(Number(e.target.value))}
      />
      <div>{Condition[value]}</div>
      {/* <datalist id="conditions">
        <option>damaged</option>
        <option>used</option>
        <option>new</option>
      </datalist>
      <output id="rangevalue">used</output> */}
    </div>
  );
}
