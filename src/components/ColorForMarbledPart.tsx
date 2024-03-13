import { IColorWithPercent, color } from "../interfaces/general";
import { useContext, useState } from "react";
import { AppContext } from "../context/context";
import ColorLink from "./ColorLink";

interface IProps {
  colorObj: IColorWithPercent;
  onChange: (color: color, percent: number | null) => void;
}

export default function ColorForMarbledPart({ colorObj, onChange }: IProps) {
  const {
    state: {
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const [value, setValue] = useState<number | string>(colorObj.percent || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Allow only digits from 1 to 99
    if (newValue == "") {
        setValue(newValue);
        onChange(colorObj.color, null); // Update parent state
    } else if (
      /^\d{0,2}$/.test(newValue) &&
      parseInt(newValue, 10) >= 1 &&
      parseInt(newValue, 10) <= 99
    ) {
      setValue(newValue);
      onChange(colorObj.color, parseInt(newValue, 10)); // Update parent state
    }
  };

  return (
    <div className="w-100 d-flex ai-base">
      <div className="fg-1">
        <ColorLink color={colorObj.color} />
      </div>
      <input
        style={{ width: "3em", height: "2em", marginRight: "3px" }}
        type="number"
        placeholder="Opt"
        onChange={handleChange}
        value={value}
        onKeyDown={(e) => {
          if (e.key == "e" || e.key == ".") e.preventDefault();
        }}
      />
      <span>%</span>
    </div>
  );
}
