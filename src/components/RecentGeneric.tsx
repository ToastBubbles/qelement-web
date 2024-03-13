import { Ribbon, RibbonContainer } from "react-ribbons";
import { Link } from "react-router-dom";
import { IRibbonOverride } from "../interfaces/general";

interface IProps {
  mainText: string;
  subText?: string;
  link?: string;

  ribbonOverride?: IRibbonOverride;
}

export default function RecentGeneric({
  mainText,
  subText,
  link,

  ribbonOverride,
}: IProps) {
  return (
    <RibbonContainer>
      {generateRibbon()}
      <Link
        to={link == undefined ? "/" : link}
        style={link == undefined ? { pointerEvents: "none" } : undefined}
        className={`listing link new-listing`}
      >
        <div className="listing-img">
          <img src={"/img/missingimage.png"} />
        </div>
        <div>
          <div>{mainText}</div>
          <div className="grey-txt">{subText}</div>
        </div>
      </Link>
    </RibbonContainer>
  );

  function generateRibbon(): React.ReactNode {
    if (ribbonOverride) {
      return (
        <Ribbon
          side="right"
          type="corner"
          size="normal"
          backgroundColor={ribbonOverride.bgColor}
          color={ribbonOverride.fgColor}
          withStripes={false}
          fontFamily="lexend"
        >
          <div style={{ fontSize: ribbonOverride.fontSize }}>
            {ribbonOverride.content}
          </div>
        </Ribbon>
      );
    }

    return <></>;
  }
}
