import { useState } from "react";
import { IMarbledPart, IPartDTO } from "../../interfaces/general";
import { paginate } from "../../utils/utils";
import PaginationControl from "../PaginationControl";
import RecentGeneric from "../RecentGeneric";
import ColorPieChart from "../ColorPieChart";
import ColorLink from "../ColorLink";

interface IProps {
  parts: IMarbledPart[];
}

export default function MarbledPartSubmissions({ parts }: IProps) {
  if (parts.length == 0)
    return <div className="grey-txt">No Marbled Parts submitted</div>;

  parts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(parts.length / itemsPerPage);

  const paginatedItems =
    parts.length > itemsPerPage
      ? paginate(parts, currentPage, itemsPerPage)
      : parts;

  return (
    <div className="rib-container">
      {paginatedItems.map((part) => {
        let ribbonStyles =
          part.approvalDate == null
            ? {
                content: "Pending",
                bgColor: "#aaa",
                fgColor: "#000",
                fontSize: "1em",
              }
            : {
                content: "Approved",
                bgColor: "#00FF99",
                fgColor: "#000",
                fontSize: "1em",
              };

        return (
          <div className=" d-flex ai-center">
            <div className="rib-container w-33">
              <RecentGeneric
                key={part.id}
                mainText={"Marbled Part"}
                subText={`${part.mold.parentPart.name} (${part.mold.number})`}
                link={`/part/${part.mold.parentPart.id}`}
                ribbonOverride={ribbonStyles}
              />
            </div>
            <div style={{ margin: "0 1em" }}>
              <ColorPieChart colorsWPercent={part.colors} radius={50} />
            </div>
            <div className="d-flex w-33 flex-wrap">
              {part.colors.map((colObj) => (
                <div
                  className="d-flex ai-center"
                  style={{
                    border: "solid 1px var(--lt-grey)",
                    borderRadius: "5px",
                    marginRight: "5px",
                    marginBottom: "5px",
                  }}
                >
                  <ColorLink color={colObj.color} />
                  {colObj.percent ? colObj.percent : "U"}%
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {parts.length > itemsPerPage && (
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
