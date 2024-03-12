import { useState } from "react";
import { IPartDTO } from "../../interfaces/general";
import { paginate } from "../../utils/utils";
import PaginationControl from "../PaginationControl";
import RecentGeneric from "../RecentGeneric";

interface IProps {
  parts: IPartDTO[];
}

export default function PartSubmissions({ parts }: IProps) {
  if (parts.length == 0)
    return <div className="grey-txt">No Parts submitted</div>;

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
          <RecentGeneric
            key={part.id}
            mainText={part.name}
            subText={part.category.name}
            link={`/part/${part.id}`}
            ribbonOverride={ribbonStyles}
          />
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
