import { useState } from "react";
import {
  ISculptureWithImages,
} from "../../interfaces/general";
import { paginate } from "../../utils/utils";
import PaginationControl from "../PaginationControl";
import RecentSculpture from "../RecentSculpture";

interface IProps {
  sculptures: ISculptureWithImages[];
}

export default function SculptureSubmissions({ sculptures }: IProps) {
  if (sculptures.length == 0)
    return <div className="grey-txt">No Sculptures submitted</div>;

  sculptures.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(sculptures.length / itemsPerPage);

  const paginatedItems =
    sculptures.length > itemsPerPage
      ? paginate(sculptures, currentPage, itemsPerPage)
      : sculptures;

  return (
    <div className="rib-container">
      {paginatedItems.map((sculpture) => (
        <RecentSculpture
          key={sculpture.id}
          sculpture={sculpture}
          ribbonOverride={
            sculpture.approvalDate == null
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
      {sculptures.length > itemsPerPage && (
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
