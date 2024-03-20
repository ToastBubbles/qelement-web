import { IWantedDTOGET } from "../interfaces/general";
import { useState } from "react";
import RecentQPart from "./RecentQPart";
import OnHoverX from "./OnHoverX";
import showToast, { Mode } from "../utils/utils";

interface IProps {
  item: IWantedDTOGET;
}

export default function MyWantedItem({ item }: IProps) {
  const [isHovered, setHovered] = useState(false);
  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="rib-container"
      style={{ position: "relative" }}
    >
      {isHovered && (
        <OnHoverX
          onClickFn={() => removeFromWanted(item.id)}
          xOffest={8}
          yOffest={6}
        />
      )}
      <RecentQPart qpart={item.qpart} hideDate={true} />
    </div>
  );
  function removeFromWanted(id: number) {
    showToast(`removing ${id}`, Mode.Info);
  }
}
