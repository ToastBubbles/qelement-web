import { useState } from "react";
import { IMarbledPart, IPartDTO } from "../../interfaces/general";
import { paginate } from "../../utils/utils";
import PaginationControl from "../PaginationControl";
import RecentGeneric from "../RecentGeneric";
import ColorPieChart from "../ColorPieChart";
import ColorLink from "../ColorLink";
import MarbledImageUploader from "../MarbledImageUploader";
import GenericPopup from "../GenericPopup";

interface IProps {
  parts: IMarbledPart[];
}

export default function MarbledPartSubmissions({ parts }: IProps) {
  const [showImagePopup, setShowImagePopup] = useState<boolean>(false);
  const [selectedPartId, setSelectedPartId] = useState<number>(-1);
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
      {showImagePopup && (
        <GenericPopup
          closePopup={closePopup}
          content={<MarbledImageUploader partId={selectedPartId} />}
        />
      )}
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
            <div className="rib-container w-33" style={{ minWidth: "33.3%" }}>
              <RecentGeneric
                key={part.id}
                imageName={part.images.length > 0 ? part.images[0].fileName : undefined}
                mainText={`Marbled Part ${part.id}`}
                subText={`${part.mold.parentPart.name} (${part.mold.number}${
                  part.isMoldUnknown ? "*" : ""
                })`}
                link={`/part/${part.mold.parentPart.id}`}
                ribbonOverride={ribbonStyles}
              />
            </div>
            <div style={{ margin: "0 1em" }}>
              <ColorPieChart colorsWPercent={part.colors} radius={50} />
            </div>
            <div
              className="d-flex flex-wrap fg-1 overflow-y-auto"
              style={{ maxHeight: "5em" }}
            >
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
            <button
              style={{ minWidth: "8em" }}
              onClick={() => {
                setSelectedPartId(part.id);
                setShowImagePopup(true);
              }}
            >
              Add Image
            </button>
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
  function closePopup() {
    setShowImagePopup(false);
  }
}
