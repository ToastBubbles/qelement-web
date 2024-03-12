import { useState } from "react";
import {
  ISimilarColorDetailed,
} from "../../interfaces/general";
import { paginate } from "../../utils/utils";

import PaginationControl from "../PaginationControl";
import ColorLink from "../ColorLink";

interface IProps {
  simColors: ISimilarColorDetailed[];
}

export default function SimilarColorSubmissions({ simColors }: IProps) {
  if (simColors.length == 0)
    return <div className="grey-txt">No Color Relationships submitted</div>;

  simColors.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  let filteredArr: ISimilarColorDetailed[] = [];

  simColors.forEach((simCol) => {
    if (filteredArr.length == 0) {
      filteredArr.push(simCol);
    } else {
      let checkForInverted = filteredArr.find(
        (x) =>
          x.color1.id == simCol.color2.id && x.color2.id == simCol.color1.id
      );
      if (!checkForInverted) {
        filteredArr.push(simCol);
      }
    }
  });

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredArr.length / itemsPerPage);

  const paginatedItems =
    filteredArr.length > itemsPerPage
      ? paginate(filteredArr, currentPage, itemsPerPage)
      : filteredArr;

  return (
    <div className="d-flex flex-col w-100">
      {paginatedItems.map((simCol) => (
        <div key={simCol.id} className="d-flex w-100 jc-space-b">
          <div
            className="w-100 d-flex"
            style={{ justifyContent: "center", margin: "0 2em" }}
          >
            <div style={{ flex: "1" }}>
              <ColorLink color={simCol.color1} centerText={true} />
            </div>
            <div className="d-flex ai-center" style={{ padding: "0 1em" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"
                />
              </svg>
            </div>
            <div style={{ flex: "1" }}>
              <ColorLink color={simCol.color2} centerText={true} />
            </div>
          </div>
          <div
            className={
              "status-tag " +
              (simCol.approvalDate == null ? "tag-grey" : "tag-approved")
            }
          >
            {simCol.approvalDate == null ? "Pending" : "Approved"}
          </div>
        </div>
      ))}

      {filteredArr.length > itemsPerPage && (
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
