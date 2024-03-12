import { useState } from "react";
import {
  IPartMoldDTO,
  IPartStatusDTO,
  IPartStatusWQPart,
  IPartStatusWQPartLess,
  IQPartDTOIncludeLess,
} from "../../interfaces/general";
import { paginate } from "../../utils/utils";
import PaginationControl from "../PaginationControl";
import RecentGeneric from "../RecentGeneric";
import RecentQPart from "../RecentQPart";

interface IProps {
  statuses: IPartStatusWQPartLess[];
}

interface IQPartStatusConversion {
  qpart: IQPartDTOIncludeLess;
  statuses: IPartStatusDTO[];
}

export default function StatusSubmissions({ statuses }: IProps) {
  if (statuses.length == 0)
    return <div className="grey-txt">No QPart Statuses submitted</div>;

  statuses.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  let conversion: IQPartStatusConversion[] = [];

  statuses.forEach((statusObj) => {
    const existingConversion = conversion.find(
      (conv) => conv.qpart.id === statusObj.qpart.id
    );
    if (existingConversion) {
      existingConversion.statuses.push(statusObj as IPartStatusDTO);
    } else {
      conversion.push({
        qpart: statusObj.qpart,
        statuses: [statusObj as IPartStatusDTO],
      });
    }
  });

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(conversion.length / itemsPerPage);

  const paginatedItems =
    conversion.length > itemsPerPage
      ? paginate(conversion, currentPage, itemsPerPage)
      : conversion;

  return (
    <div className="rib-container">
      {paginatedItems.map((statusObj) => {
        return (
          <div key={statusObj.qpart.id} className="d-flex">
            <div className="w-33 rib-container">
              <RecentQPart
                qpartl={statusObj.qpart}
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
                  fillRule="evenodd"
                  d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                />
              </svg>
            </div>

            <div style={{ width: "62%" }}>
              {statusObj.statuses.map((status) => (
                <div
                  key={status.id}
                  className={
                    `status-tag tag-${status.status} ` +
                    (status.approvalDate == null
                      ? "outline-grey"
                      : "outline-approved")
                  }
                  style={{ textShadow: "0 0 3px #000", margin: "0.25em" }}
                >
                  {status.status}
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {conversion.length > itemsPerPage && (
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
