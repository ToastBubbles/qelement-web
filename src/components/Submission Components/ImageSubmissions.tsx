import { useState } from "react";
import { ImageDTO } from "../../interfaces/general";
import { imagePath, paginate } from "../../utils/utils";

import PaginationControl from "../PaginationControl";

interface IProps {
  images: ImageDTO[];
}

export default function ImageSubmissions({ images }: IProps) {
  if (images.length == 0)
    return <div className="grey-txt">No Images submitted</div>;

  images.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(images.length / itemsPerPage);

  const paginatedItems =
    images.length > itemsPerPage
      ? paginate(images, currentPage, itemsPerPage)
      : images;

  return (
    <div className="admin-image-container d-flex  w-100 jc-center">
      {paginatedItems.map((image) => (
        <div key={image.id} className="admin-image-card">
          <div>
            <div className="admin-image-div">
              <img src={imagePath + image.fileName} alt="brick" />
            </div>
            <div className="d-flex flex-col ai-start">
              <div className={"status-tag img-" + image.type}>{image.type}</div>
              {image.approvalDate == null ? (
                <div
                  className="status-tag tag-grey"
                  style={{ fontSize: "0.55em" }}
                >
                  Pending
                </div>
              ) : (
                <div
                  className="status-tag tag-approved"
                  style={{ fontSize: "0.55em", backgroundColor: "#00FF55" }}
                >
                  Approved
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      {images.length > itemsPerPage && (
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
