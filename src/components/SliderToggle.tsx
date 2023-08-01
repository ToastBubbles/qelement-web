import { Dispatch, SetStateAction, useState } from "react";


interface IProps {
  getter: boolean;
  setter: Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
}
export default function SliderToggle({ getter, setter, disabled }: IProps) {
  const [value, setValue] = useState<number>(0);
  return (
    <div>
      <input
        id="conditionslider"
        className={
          "conditionSlider" +
          (disabled ? " slide-disabled-fr" : !value ? " slide-disabled" : "")
        }
        type="range"
        min={0}
        value={value}
        max={1}
        step={1}
        disabled={disabled}
        onClick={() => {
          if (value == 0) setValue(1);
          else setValue(0);
          setter(!getter);
        }}
        onDrag={() => {
          if (value == 0) setValue(1);
          else setValue(0);
          setter(!getter);
        }}
      />
    </div>
  );
}
