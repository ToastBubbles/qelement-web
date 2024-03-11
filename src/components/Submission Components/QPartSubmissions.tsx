import { useState } from "react";
import { IQPartDTOIncludeLess } from "../../interfaces/general";
import { paginate } from "../../utils/utils";
import RecentQPart from "../RecentQPart";
import PaginationControl from "../PaginationControl";

interface IProps {
  qparts: IQPartDTOIncludeLess[];
}

export default function QPartSubmissions({ qparts }: IProps) {
  if (qparts.length == 0)
    return <div className="grey-txt">No QParts submitted</div>;

  qparts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(qparts.length / itemsPerPage);

  const paginatedItems =
    qparts.length > itemsPerPage
      ? paginate(qparts, currentPage, itemsPerPage)
      : qparts;

  return (
    <div className="rib-container">
      {paginatedItems.map((qpart) => (
        <RecentQPart
          key={qpart.id}
          qpartl={qpart}
          ribbonOverride={
            qpart.approvalDate == null
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
                }
          }
        />
      ))}
      {qparts.length > itemsPerPage && (
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
