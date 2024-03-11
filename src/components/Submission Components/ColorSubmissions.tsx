import { useState } from "react";
import { ImageDTO, color } from "../../interfaces/general";
import { imagePath, paginate } from "../../utils/utils";

import PaginationControl from "../PaginationControl";
import ColorLink from "../ColorLink";

interface IProps {
  colors: color[];
}

export default function ColorSubmissions({ colors }: IProps) {
  if (colors.length == 0)
    return <div className="grey-txt">No Colors submitted</div>;

  colors.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(colors.length / itemsPerPage);

  const paginatedItems =
    colors.length > itemsPerPage
      ? paginate(colors, currentPage, itemsPerPage)
      : colors;

  return (
    <>
      {paginatedItems.map((color) => (
        <div className="d-flex w-100">
          <div className="fg-1">
            <ColorLink color={color} />
          </div>
          <div
            className={
              "status-tag " +
              (color.approvalDate == null ? "tag-grey" : "tag-approved")
            }
          >
            {color.approvalDate == null ? "Pending" : "Approved"}
          </div>
        </div>
      ))}

      {colors.length > itemsPerPage && (
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}
