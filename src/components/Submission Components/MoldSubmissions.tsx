import { useState } from "react";
import { IPartMoldDTO } from "../../interfaces/general";
import { paginate } from "../../utils/utils";
import PaginationControl from "../PaginationControl";
import RecentGeneric from "../RecentGeneric";

interface IProps {
  molds: IPartMoldDTO[];
}

export default function MoldSubmissions({ molds }: IProps) {
  if (molds.length == 0)
    return <div className="grey-txt">No Part Molds submitted</div>;

  molds.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(molds.length / itemsPerPage);

  const paginatedItems =
    molds.length > itemsPerPage
      ? paginate(molds, currentPage, itemsPerPage)
      : molds;

  return (
    <div className="rib-container">
      {paginatedItems.map((mold) => {
        let ribbonStyles =
          mold.approvalDate == null
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
            key={mold.id}
            mainText={`PN: ${mold.number}`}
            subText={mold.parentPart.name}
            link={`/part/${mold.parentPart.id}`}
            ribbonOverride={ribbonStyles}
          />
        );
      })}
      {molds.length > itemsPerPage && (
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
