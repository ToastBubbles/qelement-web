import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { useParams, useNavigate } from "react-router";
import AllColorStatus from "../../components/AllColorStatus";
import Navpane from "../../components/Navpane";
import RatingCard from "../../components/RatingCard";
import {
  IQPartDTOInclude,
  rating,
  IPartMoldDTO,
  ICommentCreationDTO,
} from "../../interfaces/general";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import QPartStatusDate from "../../components/QPartStatusDate";
import showToast, { Mode, filterImages, sortStatus } from "../../utils/utils";
import LoadingPage from "../../components/LoadingPage";
import ExpandingTextbox from "../../components/ExpandingTextbox";
import { AppContext } from "../../context/context";
import Comment from "../../components/Comment";
import PopupCollection from "../../components/PopupCollection";
import PopupFavorites from "../../components/PopupFavorites";
import QPartDropdown from "../../components/QPartDropdown";

export default function SinglePartView() {
  const imagePath = "http://localhost:9000/q-part-images/";
  const {
    state: {
      jwt: { token, payload },
    },
    dispatch,
  } = useContext(AppContext);
  const queryParameters = new URLSearchParams(window.location.search);
  const urlColorId = queryParameters.get("color");

  const [selectedQPartid, setSelectedQPartid] = useState<number>(-1);
  const [multiMoldPart, setMultiMoldPart] = useState<boolean>(false);
  const [selectedQPartMold, setSelectedQPartMold] = useState<number>(-1);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  const [detailsTabActive, setDetailsTabActive] = useState<boolean>(true);
  const [imageTabActive, setImageTabActive] = useState<boolean>(false);
  const [commentTabActive, setCommentTabActive] = useState<boolean>(false);

  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>("");
  const [searchColor, setSearchColor] = useState<string>("");
  // console.log("color", urlColorId);

  const { partId } = useParams();
  const navigate = useNavigate();

  const {
    data: qpartData,
    error: qpartError,
    refetch: qpartRefetch,
  } = useQuery({
    queryKey: "qpart",
    queryFn: () => {
      console.log("rating fetch");
      return axios.get<IQPartDTOInclude[]>(
        `http://localhost:3000/qpart/matchesByPartId/${partId}`
      );
    },
    // onSuccess: () => {
    //   // let mypart = qpartData?.data.find((x) => x.id == selectedQPart.id);
    //   if (mypart) {
    //     setSelectedQPart(mypart);
    //   }
    // },
    staleTime: 0,
    enabled: !!partId,
    // retry: false,
  });
  let mypart = qpartData?.data.find((x) => x.id == selectedQPartid);

  if (qpartData) console.log("data", qpartData.data);

  function getRatings(ratings: rating[] | undefined): number {
    if (ratings != undefined && ratings.length > 0) {
      let count = 0;

      let output = 0;
      ratings.forEach((rating) => {
        output += rating.rating;

        count++;
      });
      return output / count;
    }
    return -1;
  }

  useEffect(() => {
    if (qpartData) {
      let type1 = qpartData?.data[0].type;
      qpartData?.data.forEach(
        (qpart) => qpart.type != type1 && setMultiMoldPart(true)
      );
    }
  }, [qpartData?.data]);

  if (qpartError) {
    console.log(qpartError);
    navigate("/404");
  }

  const commentMutation = useMutation({
    mutationFn: ({ content, userId, qpartId }: ICommentCreationDTO) =>
      axios.post(`http://localhost:3000/comment/add`, {
        content,
        userId,
        qpartId,
      }),
    onSuccess: () => {
      showToast("Comment Added", Mode.Success);
      qpartRefetch();
    },
  });

  if (qpartData) {
    let qparts = qpartData?.data;
    // let colors = colData?.data;
    console.log("here we go", qparts);

    if (selectedQPartid == -1) {
      if (urlColorId) {
        let targetQPartId = qparts.find(
          (x) => x.color.id == Number(urlColorId)
        )?.id;
        if (targetQPartId) setSelectedQPartid(targetQPartId);
        else setSelectedQPartid(qparts[0].id);
      } else {
        setSelectedQPartid(qparts[0].id);
      }
    }

    function getUnique(): IPartMoldDTO[] {
      let output: IPartMoldDTO[] = [];
      qparts.forEach((qpart) => {
        if (output.length == 0) {
          output.push(qpart.mold);
        } else {
          let checker = output.find((x) => x.id == qpart.mold.id);
          if (!checker) output.push(qpart.mold);
        }
      });
      console.log(output);
      return output;
    }

    function formatURL(): string {
      // if (qpartImageData) {
      //   let url = qpartImageData.data;
      //   const questionMarkIndex = url.indexOf("?");
      //   let formattedURL = url;

      //   if (questionMarkIndex !== -1) {
      //     formattedURL = url.substring(0, questionMarkIndex);
      //   }

      //   formattedURL = formattedURL.replace("minio", "localhost");
      //   return formattedURL;
      // }

      if (mypart && mypart?.images?.length > 0) {
        let images = filterImages(mypart?.images);
        console.log("images:", images);
        if (images.length > 0) {
          let selectedImage = images[images.length - 1];
          for (let i = images.length - 1; i >= 0; i--) {
            console.log("iterating,", images[i]);

            if (images[i].type == "part") {
              selectedImage = images[i];
            }
            if (images[i].isPrimary) {
              selectedImage = images[i];
              break;
            }
          }
          return imagePath + selectedImage.fileName;
          // return imagePath + images[0].fileName;
        }
      }
      return "https://via.placeholder.com/1024x768/eee?text=4:3";
    }
    console.log(selectedQPartid);

    return (
      <>
        <div className="page-content-wrapper">
          <div className="page-content-wide">
            <div className="right-col">
              <div className="top">
                <ul className="breadcrumb">
                  <li>
                    <Link to={"/part-categories"}>parts</Link>
                  </li>
                  <li>{">"}</li>
                  <li>
                    <Link
                      to={`/part-categories/${mypart?.mold.parentPart.CatId}`}
                    >
                      bricks
                    </Link>
                  </li>
                </ul>

                <div className="element-name">
                  {qparts[0].mold.parentPart.name}
                </div>
                <div className="d-flex flex-col">
                  <select
                    name="qpartmolds"
                    id="qpartmolds"
                    className="qpart-color-dropdown"
                    onChange={(e) =>
                      setSelectedQPartMold(Number(e.target.value))
                    }
                    value={selectedQPartMold}
                    disabled={!multiMoldPart}
                  >
                    <option key={-1} value="-1">
                      --Show All Part Variations--
                    </option>
                    {getUnique().map((mold) => (
                      <option key={mold.id} value={`${mold.id}`}>
                        {mold.number}
                      </option>
                    ))}
                  </select>
                  <div>
                    <div
                      className="qpart-dropdown-btn"
                      onClick={() => setDropdownVisible(!dropdownVisible)}
                    >
                      <div
                        className={"qpart-dd-row-swatch " + mypart?.color.type}
                        style={{ backgroundColor: "#" + mypart?.color.hex }}
                      ></div>
                      <div style={{ flexGrow: "1" }}>
                        <div className="d-flex">
                          <div style={{ width: "2em" }}>BL:</div>
                          {mypart?.color.bl_name
                            ? mypart?.color.bl_name
                            : "Unknown"}
                        </div>
                        <div
                          className="d-flex"
                          style={{
                            fontSize: "0.75em",
                            color: "var(--lt-grey)",
                          }}
                        >
                          <div style={{ width: "2.75em" }}>TLG:</div>
                          {mypart?.color.tlg_name}
                        </div>
                      </div>
                      <svg
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                        />
                      </svg>
                    </div>
                    {dropdownVisible && (
                      <QPartDropdown
                        qparts={qparts}
                        setter={setSelectedQPartid}
                        close={setDropdownVisible}
                      />
                    )}
                  </div>
                  {/* <select
                    name="qpartcolors"
                    id="qpartcolors"
                    className="qpart-color-dropdown"
                    onChange={(e) => setSelectedQPartid(Number(e.target.value))}
                    value={selectedQPartid}
                  >
                    <option value="-1">--</option>
                    {qparts.map(
                      (qpart) =>
                        (qpart.mold.id == selectedQPartMold ||
                          selectedQPartMold == -1) && (
                          <option key={qpart.id} value={`${qpart.id}`}>
                            {qpart.color.bl_name
                              ? qpart.color.bl_name
                              : qpart.color.tlg_name}{" "}
                            ({qpart.mold.number})
                          </option>
                        )
                    )}
                  </select> */}
                </div>
              </div>
              <div className="center">
                <div className="element-image">
                  <img
                    className="element-image-actual"
                    src={formatURL()}
                    alt="placeholder"
                  />
                </div>
                <RatingCard
                  rating={getRatings(mypart?.ratings)}
                  qpartId={mypart?.id as number}
                  refetchFn={qpartRefetch}

                  // rating={100}
                />
                {collectionOpen && mypart && (
                  <PopupCollection
                    qpart={mypart}
                    closePopup={() => setCollectionOpen(false)}
                  />
                )}

                {favoritesOpen && mypart && (
                  <PopupFavorites
                    qpart={mypart}
                    closePopup={() => setFavoritesOpen(false)}
                  />
                )}
                <div className="d-flex flex-col jc-space-b border-left">
                  <ul className="actions">
                    <span>Actions:</span>
                    <li>
                      <a
                        className="clickable"
                        onClick={() => setCollectionOpen(true)}
                      >
                        Add to My Collection
                      </a>
                    </li>

                    <li>
                      <a
                        className="clickable"
                        onClick={() => setFavoritesOpen(true)}
                      >
                        Add to My Favorites
                      </a>
                    </li>
                    <li>
                      <Link to={`/add/qpart/image/?qpartId=${mypart?.id}`}>
                        Add photo
                      </Link>
                    </li>
                    <li>
                      <Link to={`/add/qpart/status/${selectedQPartid}`}>
                        Add New Status
                      </Link>
                    </li>
                  </ul>
                  <ul className="actions">
                    <span>Links:</span>

                    <li>
                      <a
                        href={`https://www.bricklink.com/v2/catalog/catalogitem.page?P=${mypart?.mold.number}&C=${mypart?.color.bl_id}`}
                      >
                        bricklink
                      </a>
                    </li>
                    <li>
                      <a href="#">brickowl</a>
                    </li>
                    <li>
                      <a href="#">rebrickable</a>
                    </li>
                  </ul>
                </div>
                <fieldset className="status">
                  <legend>Status History</legend>
                  {mypart?.partStatuses &&
                    sortStatus(mypart?.partStatuses).map((status) => (
                      <QPartStatusDate
                        key={status.id}
                        status={status.status}
                        date={status.date}
                        isPrimary={mypart?.partStatuses.indexOf(status) == 0}
                      />
                    ))}
                </fieldset>
              </div>
              <div className="lower-center">
                {/* <div className="color">{color?.bl_name}</div> */}
                <div className="fake-hr"></div>
                <div className="lower-container">
                  <div className="lower-center-left">
                    <div className="tab">
                      <button
                        className={
                          "tablinks" + (detailsTabActive ? " active" : "")
                        }
                        onClick={() => {
                          setDetailsTabActive(true);
                          setImageTabActive(false);
                          setCommentTabActive(false);
                        }}
                      >
                        Details
                      </button>
                      <button
                        className={
                          "tablinks" + (commentTabActive ? " active" : "")
                        }
                        onClick={() => {
                          setDetailsTabActive(false);
                          setImageTabActive(false);
                          setCommentTabActive(true);
                        }}
                      >
                        Comments{" "}
                        {mypart?.comments &&
                          mypart?.comments.length > 0 &&
                          `(${mypart?.comments.length})`}
                      </button>
                      {/* <button
                        className={
                          "tablinks" + (priceTabActive ? " active" : "")
                        }
                        onClick={() => {
                          setDetailsTabActive(false);
                          setPriceTabActive(true);
                          setCommentTabActive(false);
                        }}
                      >
                        Price History
                      </button> */}
                      <button
                        className={
                          "tablinks" + (imageTabActive ? " active" : "")
                        }
                        onClick={() => {
                          setDetailsTabActive(false);
                          setCommentTabActive(false);
                          setImageTabActive(true);
                        }}
                        disabled={mypart?.images.length == 0}
                      >
                        Images{" "}
                        {mypart?.images &&
                          filterImages(mypart?.images).length > 0 &&
                          `(${filterImages(mypart?.images).length})`}
                      </button>
                    </div>
                    <div
                      className={
                        "tabcontent tab-details pricehistory" +
                        (detailsTabActive ? "" : " tabhidden")
                      }
                    >
                      <div>
                        <div>Element IDs:</div>
                        <div>
                          {mypart?.elementId
                            ? mypart.elementId
                            : "No IDs found"}
                        </div>
                      </div>
                      <div>Note:</div>
                      <div>{mypart?.note ? mypart.note : "No note"}</div>
                    </div>
                    {/* <div
                      className={
                        "tabcontent pricehistory" +
                        (priceTabActive ? "" : " tabhidden")
                      }
                    >
                      <img
                        className="scatter-img"
                        src="/img/scatter-example.png"
                      />
                    </div> */}
                    <div
                      className={
                        "tabcontent commenttab" +
                        (commentTabActive ? "" : " tabhidden")
                      }
                    >
                      <div>
                        {mypart?.comments.length == 0 ? (
                          <div
                            style={{ paddingBottom: "2em", paddingTop: "1em" }}
                          >
                            No comments yet
                          </div>
                        ) : (
                          mypart?.comments.map((comment) => {
                            return <Comment key={comment.id} data={comment} />;
                          })
                        )}
                      </div>
                      <div className="w-100 d-flex">
                        <ExpandingTextbox
                          getter={commentContent}
                          setter={setCommentContent}
                        />
                        <button
                          className="comment-btn"
                          onClick={() => {
                            if (payload.id && commentContent.length > 1) {
                              commentMutation.mutate({
                                content: commentContent,
                                userId: payload.id,
                                qpartId: selectedQPartid,
                              });
                              setCommentContent("");
                            } else
                              showToast("Error adding comment.", Mode.Error);
                          }}
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
                      {mypart?.images &&
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
                        })}
                    </div>
                  </div>
                  <div className="lower-center-right">
                    <fieldset className="other-colors">
                      <legend>
                        other colors for{" "}
                        {selectedQPartMold == -1
                          ? "all molds"
                          : getUnique().find((x) => x.id == selectedQPartMold)
                              ?.number}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <LoadingPage />;
  }
}
