import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

interface IProps {
  status: string;
  date: string;
  isPrimary: boolean;
}

export default function QPartStatusDate({ status, date, isPrimary }: IProps) {
  let classType: string = isPrimary ? status : "grey";
  return (
    <div
      style={{ marginBottom: "0.5em" }}
      className="d-flex flex-text-center jc-space-b"
    >
      <div className={"status-tag tag-" + classType}>
        {status.toUpperCase()}
      </div>
      <div className="status-date">{date}</div>
    </div>
  );
}
