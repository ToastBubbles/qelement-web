import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";

interface IProps {
  content: React.ReactNode;
  id: string;
}

export default function MyToolTip({ content, id }: IProps) {
  return (
    <>
      <div data-tooltip-id={id} className="mytooltip">
        ?
      </div>
      {/* <Tooltip id={id} /> */}
      <Tooltip id={id}>{content}</Tooltip>
    </>
  );
}
