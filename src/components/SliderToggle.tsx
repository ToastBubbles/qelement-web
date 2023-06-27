import { useState } from "react";

export default function SliderToggle() {
  const [value, setValue] = useState<number>(0);
  return (
    <div>
      <input
        id="conditionslider"
        className={"conditionSlider" + (!value ? " slide-disabled" : "")}
        type="range"
        min={0}
        value={value}
        max={1}
        step={1}
        onClick={() => {
          if (value == 0) setValue(1);
          else setValue(0);
        }}
        onDrag={() => {
          if (value == 0) setValue(1);
          else setValue(0);
        }}
      />
    </div>
  );
}
