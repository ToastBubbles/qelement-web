import axios from "axios";

import { useParams, useNavigate, useLocation } from "react-router";
import AllColorStatus from "../../components/AllColorStatus";
import { MentionsInput, Mention } from "react-mentions";
import RatingCard from "../../components/RatingCard";
import {
  IQPartDTOInclude,
  rating,
  IPartMoldDTO,
  ICommentCreationDTO,
  IAPIResponse,
  ImageDTO,
  user,
  ICommentDTO,
  part,
  IPartStatusDTO,
} from "../../interfaces/general";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import QPartStatusDate from "../../components/QPartStatusDate";
import showToast, {
  Mode,
  filterImages,
  formatDate,
  getPrefColorName,
  sortCommentsByDate,
  sortStatus,
} from "../../utils/utils";
import LoadingPage from "../../components/LoadingPage";
import ExpandingTextbox from "../../components/ExpandingTextbox";
import { AppContext } from "../../context/context";
import Comment from "../../components/Comment";
import PopupCollection from "../../components/PopupCollection";
import PopupFavorites from "../../components/PopupFavorites";
import QPartDropdown from "../../components/QPartDropdown";
import PopupElementID from "../../components/PopupElementID";
import RecentSculpture from "../../components/RecentSculpture";
import AdminTabPart from "../../components/AdminTabPart";
import PseudoInput from "../../components/PseudoInput";
import { useMutation, useQuery } from "react-query";

export default function SinglePartView() {
  const imagePath = "http://localhost:9000/q-part-images/";

  const {
    state: {
      jwt: { token, payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);

  const { data: adminData } = useQuery({
    queryKey: "isAdmin",
    queryFn: () =>
      axios.get<IAPIResponse>(
        `http://localhost:3000/user/checkIfAdmin/${payload.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    retry: false,
    enabled: !!payload.id,
  });

  const [sortedStatuses, setSortedStatuses] = useState<IPartStatusDTO[]>([])
  const [urlColorId, setUrlColorId] = useState<number | undefined>(undefined);
  const [urlMoldId, setUrlMoldId] = useState<number | undefined>(undefined);
  const [urlHasChanged, setUrlHasChanged] = useState<boolean>(false);

  const [selectedQPartid, setSelectedQPartid] = useState<number>(-1);
  const [multiMoldPart, setMultiMoldPart] = useState<boolean>(false);
  const [selectedQPartMold, setSelectedQPartMold] = useState<number>(-1);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  const [noQParts, setNoQParts] = useState(false);
  const [eIDOpen, setEIDOpen] = useState(false);

  const [detailsTabActive, setDetailsTabActive] = useState<boolean>(true);
  const [imageTabActive, setImageTabActive] = useState<boolean>(false);
  const [commentTabActive, setCommentTabActive] = useState<boolean>(false);
  const [sculptureTabActive, setSculptureTabActive] = useState<boolean>(false);
  const [adminTabActive, setAdminTabActive] = useState<boolean>(false);

  const [commentColorTabActive, setCommentColorTabActive] =
    useState<boolean>(true);
  const [commentPartTabActive, setCommentPartTabActive] =
    useState<boolean>(false);

  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>("");
  const [searchColor, setSearchColor] = useState<string>("");

  const { partId } = useParams();
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const mold = searchParams.get("mold");
    const color = searchParams.get("color");

    // Use id and color here as needed
    console.log(mold);
    console.log(color);
    setUrlHasChanged(true);
    setUrlColorId(Number(color));
    setUrlMoldId(Number(mold));
  }, [location]);

  useEffect(() => {
    if (noQParts) partRefetch();
  }, [noQParts]);

  const {
    data: partData,
    error: partError,
    refetch: partRefetch,
  } = useQuery({
    queryKey: `part${partId}`,
    queryFn: () => {
      return axios.get<part>(`http://localhost:3000/parts/id/${partId}`);
    },

    staleTime: 0,
    enabled: false,
    // retry: false,
  });

  const {
    data: qpartData,
    error: qpartError,
    refetch: qpartRefetch,
  } = useQuery({
    queryKey: `qpart${partId}`,
    queryFn: () => {
      return axios.get<IQPartDTOInclude[]>(
        `http://localhost:3000/qpart/matchesByPartId/${partId}`
      );
    },

    staleTime: 0,
    enabled: !!partId,
    // retry: false,
  });


  const mypart = qpartData?.data.find((x) => x.id == selectedQPartid);

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
    if (qpartData && qpartData.data.length > 0) {
      const type1 = qpartData?.data[0].type;
      qpartData?.data.forEach(
        (qpart) => qpart.type != type1 && setMultiMoldPart(true)
      );
    }
  }, [qpartData]);

  useEffect(() => {
    if(mypart){
      
      setSortedStatuses(sortStatus(mypart.partStatuses, false))
    }else{
      setSortedStatuses([])
    }
  }, [selectedQPartid]);

  if (qpartError) navigate("/404");

  const commentMutation = useMutation({
    mutationFn: (data: ICommentCreationDTO) =>
      axios.post(`http://localhost:3000/comment/add`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: () => {
      showToast("Comment Added", Mode.Success);
      setCommentContent("");
      if (noQParts) {
        partRefetch();
      } else qpartRefetch();
    },
  });
  function getUnique(qpts: IQPartDTOInclude[]): IPartMoldDTO[] {
    const output: IPartMoldDTO[] = [];
    qpts.forEach((qpart) => {
      if (output.length == 0) {
        output.push(qpart.mold);
      } else {
        const checker = output.find((x) => x.id == qpart.mold.id);
        if (!checker) output.push(qpart.mold);
      }
    });
    return output;
  }

  function formatURL(): string {
    if (mypart && mypart?.images?.length > 0) {
      const images = filterImages(mypart?.images);
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

  if (qpartData && qpartData.data.length > 0) {
    let isAdmin = adminData?.data.code == 200;
  
    const qparts = qpartData?.data;

    if (selectedQPartid == -1 || urlHasChanged) {
      console.log("Checking URL");
      setUrlHasChanged(false);
      if (urlColorId) {
        console.log(`Got URL Color: ${urlColorId}`);

        let targetQPartId: number | undefined = undefined;
        if (urlMoldId) {
          console.log(`Got URL Mold: ${urlMoldId}`);

          targetQPartId = qparts.find(
            (x) =>
              x.color.id == Number(urlColorId) && x.mold.id == Number(urlMoldId)
          )?.id;
        } else {
          targetQPartId = qparts.find(
            (x) => x.color.id == Number(urlColorId)
          )?.id;
        }
        if (targetQPartId) setSelectedQPartid(targetQPartId);
        else setSelectedQPartid(qparts[0].id);
      } else {
        setSelectedQPartid(qparts[0].id);
      }
    }
    let filteredImages: ImageDTO[] = [];
    if (mypart) filteredImages = filterImages(mypart.images);
    // console.log(mypart);

   


    return (
      <div className="mx-w">
        <div className="page-content-wrapper">
          <div className="page-content-wide">
            <div className="right-col">
              <div className="top">
                <ul className="breadcrumb">
                  <li>
                    <Link to={"/part-categories"} className="link">Parts</Link>
                  </li>
                  <li>{"\u00A0>\u00A0"}</li>
                  <li>
                    <Link
                    className="link"
                      to={`/part-categories/${mypart?.mold.parentPart.category.id}`}
                    >
                      {mypart?.mold.parentPart.category.name}
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
                    {getUnique(qparts).map((mold) => (
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
                          {mypart?.isMoldUnknown
                            ? mypart?.mold.number + "*"
                            : mypart?.mold.number}{" "}
                          {getPrefColorName(
                            mypart?.color,
                            prefPayload.prefName
                          )}
                        </div>
                        <div
                          className="d-flex"
                          style={{
                            fontSize: "0.75em",
                            color: "var(--lt-grey)",
                          }}
                        >
                          {getPrefColorName(
                            mypart?.color,
                            prefPayload.prefName,
                            true
                          )}
                        </div>
                      </div>
                      <svg
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                        />
                      </svg>
                    </div>
                    {dropdownVisible && (
                      <QPartDropdown
                        qparts={qparts}
                        moldId={selectedQPartMold}
                        setter={setSelectedQPartid}
                        close={setDropdownVisible}
                      />
                    )}
                  </div>
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
                {eIDOpen && mypart && payload.id && (
                  <PopupElementID
                    refetchFn={qpartRefetch}
                    qpart={mypart}
                    closePopup={() => setEIDOpen(false)}
                  />
                )}
                <div className="d-flex flex-col jc-space-b border-left action-container">
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
                        Add to Wanted List
                      </a>
                    </li>
                    <li>
                      <Link
                        to={`/add/image/?qpartId=${mypart?.id}`}
                        className="link"
                      >
                        Add Photo
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`/add/qpart/status/${selectedQPartid}`}
                        className="link"
                      >
                        Add New Status
                      </Link>
                    </li>
                    <li>
                      <a
                        className="clickable"
                        onClick={() => {
                          if (payload.id) {
                            setEIDOpen(true);
                          } else {
                            showToast(
                              "You must be logged in to do this!",
                              Mode.Warning
                            );
                          }
                        }}
                      >
                        Add Element ID
                      </a>
                    </li>
                  </ul>
                  <ul className="actions">
                    <span>Links:</span>

                    <li>
                      <a
                        href={`https://www.bricklink.com/v2/catalog/catalogitem.page?P=${mypart?.mold.parentPart.blURL}&C=${mypart?.color.bl_id}`}
                        className="link"
                      >
                        bricklink
                      </a>
                    </li>
                    <li>
                      <a href="#" className="link">
                        brickowl
                      </a>
                    </li>
                    <li>
                      <a href="#" className="link">
                        rebrickable
                      </a>
                    </li>
                  </ul>
                </div>
                <fieldset className="status">
                  <legend>Status History</legend>
                  {mypart?.partStatuses && mypart.partStatuses.length > 0 ? (
                    sortedStatuses.map((status) => (
                      <QPartStatusDate
                        key={status.id}
                        status={status.status}
                        date={formatDate(status.date)}
                        isPrimary={sortedStatuses.indexOf(status) == 0}
                      />
                    ))
                  ) : (
                    <div>
                      <div>No status yet!</div>{" "}
                      <div>Please consider adding one!</div>
                    </div>
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
                          "tablinks" + (detailsTabActive ? " active" : "")
                        }
                        onClick={() => {
                          setDetailsTabActive(true);
                          setImageTabActive(false);
                          setCommentTabActive(false);
                          setSculptureTabActive(false);
                          setAdminTabActive(false);
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
                          setSculptureTabActive(false);
                          setAdminTabActive(false);
                        }}
                      >
                        <div className="comment-tab">
                          Comments{" "}
                          {mypart?.comments &&
                            mypart.comments.length > 0 &&
                            `(${mypart?.comments.length})`}
                          {mypart &&
                            mypart?.mold.parentPart.comments.length > 0 && (
                              <span>
                                Parent Part (
                                {mypart?.mold.parentPart.comments.length})
                              </span>
                            )}
                        </div>
                      </button>
                      <button
                        className={
                          "tablinks" + (imageTabActive ? " active" : "")
                        }
                        onClick={() => {
                          setDetailsTabActive(false);
                          setCommentTabActive(false);
                          setSculptureTabActive(false);
                          setImageTabActive(true);
                          setAdminTabActive(false);
                        }}
                        disabled={mypart?.images.length == 0}
                      >
                        Images{" "}
                        {mypart?.images &&
                          filterImages(mypart?.images).length > 0 &&
                          `(${filterImages(mypart?.images).length})`}
                      </button>
                      <button
                        className={
                          "tablinks" + (sculptureTabActive ? " active" : "")
                        }
                        onClick={() => {
                          setDetailsTabActive(false);
                          setCommentTabActive(false);
                          setSculptureTabActive(true);
                          setImageTabActive(false);
                          setAdminTabActive(false);
                        }}
                        disabled={mypart?.sculptureInventories.length == 0}
                      >
                        Sculptures{" "}
                        {mypart?.sculptureInventories &&
                          mypart.sculptureInventories.length > 0 &&
                          `(${mypart.sculptureInventories.length})`}
                      </button>
                      <button
                        className={
                          "tablinks" +
                          (adminTabActive ? " active" : "") +
                          (isAdmin ? "" : " tabhidden")
                        }
                        onClick={() => {
                          setDetailsTabActive(false);
                          setCommentTabActive(false);
                          setSculptureTabActive(false);
                          setImageTabActive(false);
                          setAdminTabActive(true);
                        }}
                      >
                        Admin
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
                          {mypart?.elementIDs && mypart?.elementIDs.length > 0
                            ? mypart.elementIDs
                                .map((eId) => eId.number)
                                .join(", ")
                            : "No IDs found"}
                        </div>
                      </div>
                      <div>Note:</div>
                      <div>{mypart?.note ? mypart.note : "No note"}</div>
                    </div>
                    <div
                      className={
                        "tabcontent" + (commentTabActive ? "" : " tabhidden")
                      }
                    >
                      <div>
                        <div className="sub-tab-container">
                          {/* <div className="sub-tab">Color</div>
                          <div className="sub-tab">Part</div> */}

                          <button
                            className={commentColorTabActive ? " active" : ""}
                            onClick={() => {
                              setCommentColorTabActive(true);
                              setCommentPartTabActive(false);
                            }}
                          >
                            This QPart{" "}
                            {mypart?.comments &&
                              mypart?.comments.length > 0 &&
                              `(${mypart?.comments.length})`}
                          </button>

                          <button
                            className={commentPartTabActive ? " active" : ""}
                            onClick={() => {
                              setCommentColorTabActive(false);
                              setCommentPartTabActive(true);
                            }}
                            style={{ left: "135px", width: "auto" }}
                          >
                            {mypart?.mold.parentPart.name}{" "}
                            {mypart?.mold.parentPart.comments &&
                              mypart?.mold.parentPart.comments.length > 0 &&
                              `(${mypart?.mold.parentPart.comments.length})`}
                          </button>
                        </div>
                        {commentColorTabActive && (
                          <div style={{ padding: "0 1em 0 1em" }}>
                            {mypart?.comments.length == 0 ? (
                              <div
                                style={{
                                  paddingBottom: "2em",
                                  paddingTop: "1em",
                                }}
                              >
                                No comments yet
                              </div>
                            ) : (
                              sortCommentsByDate(mypart?.comments).map(
                                (comment) => {
                                  return (
                                    <Comment
                                      key={comment.id}
                                      data={comment}
                                      isAdmin={isAdmin}
                                      viewerId={payload.id}
                                      getter={commentContent}
                                      setter={setCommentContent}
                                      refetchFn={qpartRefetch}
                                    />
                                  );
                                }
                              )
                            )}
                          </div>
                        )}
                        {commentPartTabActive && (
                          <div style={{ padding: "0 1em 0 1em" }}>
                            {mypart?.mold.parentPart.comments.length == 0 ? (
                              <div
                                style={{
                                  paddingBottom: "2em",
                                  paddingTop: "1em",
                                }}
                              >
                                No comments yet
                              </div>
                            ) : (
                              sortCommentsByDate(
                                mypart?.mold.parentPart.comments
                              ).map((comment) => {
                                return (
                                  <Comment
                                    key={comment.id}
                                    data={comment}
                                    isAdmin={isAdmin}
                                    viewerId={payload.id}
                                    getter={commentContent}
                                    setter={setCommentContent}
                                    refetchFn={qpartRefetch}
                                  />
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                      <div
                        className="w-100 d-flex"
                        style={{ padding: "0 1em 1em 1em" }}
                      >
                        {/* <PseudoInput /> */}

                        <ExpandingTextbox
                          getter={commentContent}
                          setter={setCommentContent}
                        />
                        <button
                          className="comment-btn"
                          onClick={() => {
                            if (payload.id && commentContent.length > 1) {
                              if (commentColorTabActive) {
                                commentMutation.mutate({
                                  content: commentContent,
                                  userId: payload.id,
                                  qpartId: selectedQPartid,
                                });
                              } else if (mypart) {
                                commentMutation.mutate({
                                  content: commentContent,
                                  userId: payload.id,
                                  partId: mypart?.mold.parentPart.id,
                                });
                              }
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
                      {filteredImages.length > 0 ? (
                        filteredImages.map((image) => {
                          return (
                            <div key={image.id}>
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
                        })
                      ) : (
                        <p>No Images</p>
                      )}
                    </div>
                    <div
                      className={
                        "tabcontent tab-sculp" +
                        (sculptureTabActive ? "" : " tabhidden")
                      }
                    >
                      {mypart?.sculptureInventories &&
                      mypart?.sculptureInventories.length > 0 ? (
                        mypart.sculptureInventories.map((sculp) => {
                          return (
                            <RecentSculpture sculpture={sculp} key={sculp.id} />
                          );
                        })
                      ) : (
                        <p>No Images</p>
                      )}
                    </div>
                    <div
                      className={
                        "tabcontent tab-details pricehistory" +
                        (isAdmin && adminTabActive ? "" : " tabhidden")
                      }
                    >
                      {mypart && (
                        <AdminTabPart part={mypart} refetchFn={qpartRefetch} />
                      )}
                    </div>
                  </div>
                  <div className="lower-center-right">
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
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                            }
                          }}
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
      </div>
    );
  } else {
    if (qpartData?.data && qpartData.data.length == 0) {
      if (!noQParts) setNoQParts(true);

      if (partData) {
        console.log("showing part data");
        let thisPart = partData.data;
        let isAdmin = adminData?.data.code == 200;
        return (
          <div className="mx-w">
            <div className="page-content-wrapper">
              <div className="page-content-wide">
                <div className="right-col">
                  <div className="top">
                    <ul className="breadcrumb">
                      <li>
                        <Link to={"/part-categories"} className="link">Parts</Link>
                      </li>
                      <li>{"\u00A0>\u00A0"}</li>
                      <li>
                        <Link to={`/part-categories/${thisPart.category.id}`} className="link">
                          {thisPart.category.name}
                        </Link>
                      </li>
                    </ul>

                    <div className="element-name">{thisPart.name}</div>
                    <div className="d-flex flex-col">
                      <select
                        name="qpartmolds"
                        id="qpartmolds"
                        className="qpart-color-dropdown"
                        disabled={true}
                      >
                        <option key={-1} value="-1">
                          --Show All Part Variations--
                        </option>
                      </select>
                      <div>
                        <div className="qpart-dropdown-btn">
                          <div className={"qpart-dd-row-swatch "}></div>
                          <div style={{ flexGrow: "1" }}>
                            <div className="d-flex"></div>
                            <div
                              className="d-flex"
                              style={{
                                fontSize: "0.75em",
                                color: "var(--lt-grey)",
                              }}
                            ></div>
                          </div>
                          <svg
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="center">
                    <div className="element-image">
                      <img
                        className="element-image-actual"
                        src="https://via.placeholder.com/1024x768/eee?text=4:3"
                        alt="placeholder"
                      />
                    </div>
                    <div
                      style={{
                        width: "8em",
                        fontSize: "1.25em",
                        fontWeight: "700",
                        textAlign: "center",
                        margin: "auto",
                      }}
                    >
                      No QParts Exist for this Part yet!
                    </div>

                    <div
                      className="d-flex flex-col jc-space-b border-left action-container"
                      style={{ width: "25%" }}
                    >
                      <ul className="actions">
                        <span>Actions:</span>
                        <li>
                          <Link className="link" to={"/add/part"}>
                            Add Molds
                          </Link>
                        </li>
                        <li>
                          <Link className="link" to={"/add/qpart"}>
                            Add QParts
                          </Link>
                        </li>
                      </ul>
                      <ul className="actions">
                        <span>Links:</span>
                        <li>
                          <a
                            href={`https://www.bricklink.com/v2/catalog/catalogitem.page?P=${thisPart.blURL}`}
                            className="link"
                          >
                            bricklink
                          </a>
                        </li>
                      </ul>
                    </div>
                    <fieldset className="status">
                      <legend>Status History</legend>

                      <div>
                        <div className="grey-txt">
                          Cannot display status information!
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  <div className="lower-center">
                    <div className="fake-hr"></div>
                    <div className="lower-container">
                      <div className="lower-center-left">
                        <div className="tab">
                          <button
                            className={"tablinks active"}
                            style={{ cursor: "default" }}
                          >
                            <div>
                              Comments{" "}
                              {thisPart.comments &&
                                thisPart.comments.length > 0 &&
                                `(${thisPart.comments.length})`}
                            </div>
                          </button>
                        </div>

                        <div className={"tabcontent"}>
                          <div>
                            <div className="sub-tab-container">
                              <button className={" active"}>
                                {thisPart.name}{" "}
                                {thisPart.comments &&
                                  thisPart.comments.length > 0 &&
                                  `(${thisPart.comments.length})`}
                              </button>
                            </div>
                            {commentColorTabActive && (
                              <div style={{ padding: "0 1em 0 1em" }}>
                                {thisPart.comments.length == 0 ? (
                                  <div
                                    style={{
                                      paddingBottom: "2em",
                                      paddingTop: "1em",
                                    }}
                                  >
                                    No comments yet
                                  </div>
                                ) : (
                                  sortCommentsByDate(thisPart.comments).map(
                                    (comment) => {
                                      return (
                                        <Comment
                                          key={comment.id}
                                          data={comment}
                                          isAdmin={isAdmin}
                                          viewerId={payload.id}
                                          getter={commentContent}
                                          setter={setCommentContent}
                                          refetchFn={partRefetch}
                                        />
                                      );
                                    }
                                  )
                                )}
                              </div>
                            )}
                            {commentPartTabActive && (
                              <div style={{ padding: "0 1em 0 1em" }}>
                                {thisPart.comments.length == 0 ? (
                                  <div
                                    style={{
                                      paddingBottom: "2em",
                                      paddingTop: "1em",
                                    }}
                                  >
                                    No comments yet
                                  </div>
                                ) : (
                                  sortCommentsByDate(thisPart.comments).map(
                                    (comment) => {
                                      return (
                                        <Comment
                                          key={comment.id}
                                          data={comment}
                                          isAdmin={isAdmin}
                                          viewerId={payload.id}
                                          getter={commentContent}
                                          setter={setCommentContent}
                                          refetchFn={qpartRefetch}
                                        />
                                      );
                                    }
                                  )
                                )}
                              </div>
                            )}
                          </div>
                          <div
                            className="w-100 d-flex"
                            style={{ padding: "0 1em 1em 1em" }}
                          >
                            {/* <PseudoInput /> */}

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
                                    partId: thisPart.id,
                                  });
                                } else
                                  showToast(
                                    "Error adding comment.",
                                    Mode.Error
                                  );
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
                      </div>
                      <div className="lower-center-right">
                        <fieldset className="other-colors">
                          <legend>Colors</legend>
                          <div className="grey-txt">
                            Cannot show Color data!
                          </div>
                        </fieldset>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return <LoadingPage />;
      }
    } else {
      return <LoadingPage />;
    }
  }
}
