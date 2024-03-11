import { useState } from "react";
import {
  IQPartDTOIncludeLess,
  ISculpPart,
  ISculptureInventoryItem,
  ISculptureWithImages,
  user,
} from "../../interfaces/general";
import { paginate } from "../../utils/utils";
import PaginationControl from "../PaginationControl";
import RecentSculpture from "../RecentSculpture";
import RecentQPart from "../RecentQPart";
import QPartSubmissions from "./QPartSubmissions";

interface IProps {
  sculpInventories: ISculptureInventoryItem[];
}

interface ISortedSculpInvParts {
  sculpture: ISculptureWithImages;
  creator: user;
  parts: ISculpPart[];
}

export default function SculptureInventoriesSubmissions({
  sculpInventories,
}: IProps) {
  if (sculpInventories.length == 0)
    return <div className="grey-txt">No Sculpture Inventories submitted</div>;

  sculpInventories.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const itemsPerPage = 2;
  const [currentPage, setCurrentPage] = useState(1);

  let invArray: ISortedSculpInvParts[] = [];

  sculpInventories.forEach((entry) => {
    let existingSculpture = invArray.find(
      (x) => x.sculpture.id == entry.sculpture.id
    );
    if (existingSculpture) {
      existingSculpture.parts.push({
        part: entry.qpart,
        approvalDate: entry.approvalDate,
      } as ISculpPart);
    } else {
      invArray.push({
        sculpture: entry.sculpture,
        creator: entry.creator,
        parts: [
          {
            part: entry.qpart,
            approvalDate: entry.approvalDate,
            createdAt: entry.createdAt,
          },
        ],
      });
    }
  });

  const totalPages = Math.ceil(invArray.length / itemsPerPage);

  const paginatedItems =
    invArray.length > itemsPerPage
      ? paginate(invArray, currentPage, itemsPerPage)
      : invArray;
  return (
    <div className="rib-container">
      {paginatedItems.map((sculpObj) => (
        <fieldset key={sculpObj.sculpture.id} style={{ margin: "1em 0" }}>
          <legend className="w-33">
            <RecentSculpture
              sculpture={sculpObj.sculpture}
              hidePartCount={true}
              hideDate={true}
              hideRibbon={true}
            />
          </legend>
          <div className="rib-container">
            <QPartSubmissions qparts={sculpObj.parts} />
            {/* {sculpObj.parts.map((partObj) => (
              <RecentQPart
                key={partObj.part.id}
                qpartl={partObj.part}
                ribbonOverride={
                  partObj.approvalDate == null
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
            ))} */}
          </div>
        </fieldset>
      ))}
      {invArray.length > itemsPerPage && (
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
