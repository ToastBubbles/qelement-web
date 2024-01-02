import axios from "axios";
import { useQuery } from "react-query";
import {
  IQPartDTOInclude,
  ISculptureDTO,
  ImageDTO,
  category,
  color,
} from "../../interfaces/general";
import { Link, useParams } from "react-router-dom";
import { useState, useContext } from "react";
import ExpandingTextbox from "../../components/ExpandingTextbox";
import { AppContext } from "../../context/context";
import ColorLink from "../../components/ColorLink";
import RecentQPart from "../../components/RecentQPart";
import { filterImages } from "../../utils/utils";

export default function SingleSculptureView() {
  const imagePath = "http://localhost:9000/q-part-images/";
  const {
    state: {
      jwt: { payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);

  const { sculptId } = useParams();
  const [partsTabActive, setPartsTabActive] = useState<boolean>(true);
  const [imageTabActive, setImageTabActive] = useState<boolean>(false);
  const [commentTabActive, setCommentTabActive] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>("");
  function formatURL(imagesIn: ImageDTO[]): string {
    if (imagesIn.length > 0) {
      const images = filterImages(imagesIn);
      if (images.length > 0) {
        let selectedImage = images[images.length - 1];
        for (let i = images.length - 1; i >= 0; i--) {
          if (images[i].type == "part") {
            selectedImage = images[i];
          }
          if (images[i].isPrimary) {
            selectedImage = images[i];
            break;
          }
        }
        return imagePath + selectedImage.fileName;
      }
    }
    return "https://via.placeholder.com/1024x768/eee?text=4:3";
  }

  const {
    data: sculptData,
    error: sculptError,
    refetch: sculptRefetch,
  } = useQuery({
    queryKey: `sculpt${sculptId}`,
    queryFn: () => {
      return axios.get<ISculptureDTO>(
        `http://localhost:3000/sculpture/byId/${sculptId}`
      );
    },

    staleTime: 0,
    enabled: !!sculptId,
    // retry: false,
  });
  if (sculptData) {
    let sculpture = sculptData.data;
    let colorsUsed = getAllColorsUsed(sculpture.inventory);
    return (
      <div className="mx-w">
        <div className="page-content-wrapper">
          <div className="page-content-wide">
            <div className="right-col">
              <div className="top">
                <div className="element-name">{sculpture.name}</div>
              </div>
              <div className="center">
                <div className="d-flex">
                  <div className="element-image">
                    <img
                      className="element-image-actual"
                      src={formatURL(sculpture.images)}
                      alt="placeholder"
                    />
                  </div>

                  <div className="d-flex flex-col jc-space-b  action-container">
                    <ul className="actions">
                      <span>Details:</span>
                      <li>Type: {sculpture.brickSystem}</li>
                      <li>Location: {sculpture.location}</li>
                      <li>Made: {sculpture.yearMade}</li>
                      <li>Retired: {sculpture.yearRetired}</li>
                    </ul>
                    <ul className="actions">
                      <span>Keywords:</span>

                      <li>
                        <a href="#">test</a>
                      </li>
                      <li>
                        <a href="#">test</a>
                      </li>
                    </ul>
                  </div>

                  <div className="d-flex flex-col   action-container">
                    <Link to={`/add/sculpture/parts/${sculpture.id}`}>
                      Add Parts
                    </Link>
                    <Link to={`/add/image/?sculptureId=${sculpture.id}`}>
                      Add Photo
                    </Link>
                  </div>
                </div>
                <fieldset className="colors-used">
                  <legend>Colors used</legend>
                  {/* {mypart?.partStatuses &&
                    sortStatus(mypart?.partStatuses).map((status) => (
                      <QPartStatusDate
                        key={status.id}
                        status={status.status}
                        date={status.date}
                        isPrimary={mypart?.partStatuses.indexOf(status) == 0}
                      />
                    ))} */}

                  {colorsUsed.length == 0 ? (
                    <p>No parts added yet!</p>
                  ) : (
                    colorsUsed.map((color) => (
                      <ColorLink key={color.id} color={color} />
                    ))
                  )}
                </fieldset>
              </div>
              <div className="lower-center">
                <div className="fake-hr"></div>
                <div className="lower-container">
                  <div className="lower-center-left">
                    <div className="tab">
                      <button
                        className={
                          "tablinks" + (partsTabActive ? " active" : "")
                        }
                        onClick={() => {
                          setPartsTabActive(true);
                          setImageTabActive(false);
                          setCommentTabActive(false);
                        }}
                      >
                        Parts
                      </button>
                      <button
                        className={
                          "tablinks" + (commentTabActive ? " active" : "")
                        }
                        onClick={() => {
                          setPartsTabActive(false);
                          setImageTabActive(false);
                          setCommentTabActive(true);
                        }}
                      >
                        Comments{" "}
                        {/* {mypart?.comments &&
                          mypart?.comments.length > 0 &&
                          `(${mypart?.comments.length})`} */}
                      </button>
                      <button
                        className={
                          "tablinks" + (imageTabActive ? " active" : "")
                        }
                        onClick={() => {
                          setPartsTabActive(false);
                          setCommentTabActive(false);
                          setImageTabActive(true);
                        }}
                        // disabled={mypart?.images.length == 0}
                      >
                        Images{" "}
                        {/* {mypart?.images &&
                          filterImages(mypart?.images).length > 0 &&
                          `(${filterImages(mypart?.images).length})`} */}
                      </button>
                    </div>
                    <div
                      className={
                        "tabcontent rib-container tab-parts" +
                        (partsTabActive ? "" : " tabhidden")
                      }
                      style={{ overflowY: "auto" }}
                    >
                      {sculpture.inventory.map((qpart) => (
                        <RecentQPart
                          key={qpart.id}
                          qpart={qpart}
                          hideDate={true}
                        />
                      ))}
                    </div>
                    <div
                      className={
                        "tabcontent commenttab" +
                        (commentTabActive ? "" : " tabhidden")
                      }
                    >
                      <div>
                        {/* {mypart?.comments.length == 0 ? (
                          <div
                            style={{
                              paddingBottom: "2em",
                              paddingTop: "1em",
                            }}
                          >
                            No comments yet
                          </div>
                        ) : (
                          mypart?.comments.map((comment) => {
                            return <Comment key={comment.id} data={comment} />;
                          })
                        )} */}
                      </div>
                      <div className="w-100 d-flex">
                        <ExpandingTextbox
                          getter={commentContent}
                          setter={setCommentContent}
                        />
                        <button
                          className="comment-btn"
                          // onClick={() => {
                          //   if (payload.id && commentContent.length > 1) {
                          //     commentMutation.mutate({
                          //       content: commentContent,
                          //       userId: payload.id,
                          //       qpartId: selectedQPartid,
                          //     });
                          //     setCommentContent("");
                          //   } else
                          //     showToast("Error adding comment.", Mode.Error);
                          // }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div
                      className={
                        "tabcontent tab-images" +
                        (imageTabActive ? "" : " tabhidden")
                      }
                    >
                      {/* {mypart?.images &&
                        filterImages(mypart.images).map((image) => {
                          return (
                            <div>
                              <img
                                src={imagePath + image.fileName}
                                alt="brick"
                              />
                              <div className="d-flex jc-space-b">
                                <div>
                                  Type:{" "}
                                  <div
                                    className={"status-tag img-" + image.type}
                                  >
                                    {image.type}
                                  </div>
                                </div>
                                <div>Uploader: {image.uploader.name}</div>
                              </div>
                            </div>
                          );
                        })} */}
                    </div>
                  </div>
                  {/* <div className="lower-center-right">
                    <fieldset className="other-colors">
                      <legend>
                        other colors for{" "}
                        {selectedQPartMold == -1
                          ? "all molds"
                          : getUnique(qparts).find(
                              (x) => x.id == selectedQPartMold
                            )?.number}
                      </legend>
                      <form id="search-form" style={{ margin: "0 0 1em 0" }}>
                        <input
                          id="searchbar"
                          name="searchbar"
                          type="text"
                          placeholder="Search..."
                          onChange={(e) => setSearchColor(e.target.value)}
                        />
                      </form>
                      <AllColorStatus
                        qparts={qparts}
                        moldId={selectedQPartMold}
                        search={searchColor}
                      />
                    </fieldset>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <p>loading</p>;
  }

  function getAllColorsUsed(parts: IQPartDTOInclude[]): color[] {
    let output: color[] = [];
    parts.forEach((part) => {
      if (!output.includes(part.color)) {
        output.push(part.color);
      }
    });
    output.sort((a, b) => a.swatchId - b.swatchId);
    return output;
  }
}
