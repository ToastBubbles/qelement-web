import { Dispatch, SetStateAction, useState } from "react";

interface IProps {
  getter: boolean;
  setter: Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
}
export default function SliderToggle2({ getter, setter, disabled }: IProps) {
  // const [value, setValue] = useState<number>(Number(getter));

  return (
    <div>
      <label className="switch">
        <input
          // onClick={() => {
          //   if (value == 0) setValue(1);
          //   else setValue(0);
          //   setter(!getter);
          // }}
          defaultChecked={getter}
          checked={getter}
          onChange={(e) => setter(e.target.checked)}
          type="checkbox"
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
}
