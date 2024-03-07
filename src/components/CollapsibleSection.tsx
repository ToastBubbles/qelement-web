import React, { ReactNode, useState } from "react";
interface iProps {
  title: string;
  content: ReactNode;
  pending: number;
  approved: number;
}
const CollapsibleSection = ({ title, content, pending, approved }: iProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="collapsible-btn" onClick={toggleCollapse}>
        {title}{" "}
        <span style={{ color: "var(--dk-grey)", margin: '0 0.25em' }}>{isOpen ? "▼" : "▶"}</span>
        <div className="line fg-1" style={{ marginLeft: "0.25em" }}></div>
        <div
          className={
            "submission-number" + (pending > 0 ? " red-txt" : " grey-txt")
          }
        >
          {pending}
        </div>
        <div className="line" style={{ width: "1.5em" }}></div>
        <div
          className={"submission-number" + (approved > 0 ? "" : " grey-txt")}
        >
          {approved}
        </div>
        <div className="line" style={{ width: "2.5em" }}></div>
      </div>
      {isOpen && <div>{content}</div>}
    </div>
  );
};

export default CollapsibleSection;
