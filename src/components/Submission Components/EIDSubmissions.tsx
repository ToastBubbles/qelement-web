import { useState } from "react";
import {
  IElementID,
  IElementIDWQPartLESS,
  IQPartDTOIncludeLess,
} from "../../interfaces/general";
import { paginate } from "../../utils/utils";
import RecentQPart from "../RecentQPart";
import PaginationControl from "../PaginationControl";

interface IProps {
  eIDs: IElementIDWQPartLESS[];
}
interface IQPartWithEIDS {
  qpart: IQPartDTOIncludeLess;
  eIDs: IElementID[];
}
export default function EIDsubmissions({ eIDs }: IProps) {
  if (eIDs.length == 0)
    return <div className="grey-txt">No Element IDS submitted</div>;

  eIDs.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  let objArr: IQPartWithEIDS[] = [];
  eIDs.forEach((eIDObj) => {
    let existingEntry = objArr.find((x) => x.qpart.id == eIDObj.qpart.id);
    let eID = {
      number: eIDObj.number,
      id: eIDObj.id,
      creator: eIDObj.creator,
      createdAt: eIDObj.createdAt,
      approvalDate: eIDObj.approvalDate,
    };
    if (existingEntry) {
      existingEntry.eIDs.push(eID);
    } else {
      objArr.push({ qpart: eIDObj.qpart, eIDs: [eID] });
    }
  });

  const totalPages = Math.ceil(objArr.length / itemsPerPage);

  const paginatedItems =
    objArr.length > itemsPerPage
      ? paginate(objArr, currentPage, itemsPerPage)
      : objArr;

  return (
    <div className="rib-container">
      {paginatedItems.map((qpartObj) => (
        <div key={qpartObj.qpart.id} className="d-flex">
          <div className="w-33 rib-container">
            <RecentQPart
              qpartl={qpartObj.qpart}
              hideDate={true}
              hideRibbon={true}
            />
          </div>
          <div className="d-flex ai-center jc-center" style={{ width: "5%" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
              />
            </svg>
          </div>
          <div style={{ width: "62%" }}>
            {qpartObj.eIDs.map((eID) => (
              <div
                key={eID.id}
                className={
                  "status-tag " +
                  (eID.approvalDate == null ? "tag-grey" : "tag-approved")
                }
                style={{ textShadow: "0 0 3px #000", margin: "0.25em" }}
              >
                {eID.number}
              </div>
            ))}
          </div>
        </div>
      ))}
      {objArr.length > itemsPerPage && (
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
