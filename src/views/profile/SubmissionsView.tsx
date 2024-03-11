import { ReactNode, useContext } from "react";
import { AppContext } from "../../context/context";
import ProfileButton from "../../components/ProfileButton";
import ColorLink from "../../components/ColorLink";
import {
  IAPIResponse,
  IElementID,
  IElementIDWQPartLESS,
  IPartDTO,
  IPartMoldDTO,
  IPartStatusDTO,
  IQPartDTOIncludeLess,
  ISculptureDTO,
  ISculptureInventory,
  ISculptureInventoryItem,
  ISculptureWithImages,
  ISimilarColorDTO,
  ISubmissions,
  IUserDTO,
  ImageDTO,
  color,
  part,
  user,
} from "../../interfaces/general";
import axios from "axios";
import showToast, {
  formatDate,
  getProfilePicture,
  imagePath,
  paginate,
} from "../../utils/utils";
import LoadingPage from "../../components/LoadingPage";
import { useQuery } from "react-query";
import CollapsibleSection from "../../components/CollapsibleSection";
import RecentQPart from "../../components/RecentQPart";
import RecentSculpture from "../../components/RecentSculpture";
import QPartSubmissions from "../../components/Submission Components/QPartSubmissions";

export default function SubmissionsView() {
  const {
    state: {
      jwt: { payload, token },
    },
  } = useContext(AppContext);

  const { data: userData } = useQuery({
    queryKey: `userId${payload.id}`,
    queryFn: () =>
      axios.get<IUserDTO>(`http://localhost:3000/user/id/${payload.id}`),
    retry: false,
    enabled: !!payload,
  });

  const { data: submissionData } = useQuery({
    queryKey: `submissions${payload.id}`,
    queryFn: () =>
      axios.get<ISubmissions>(`http://localhost:3000/extra/getSubmissions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    retry: false,
    enabled: !!payload,
  });
  if (userData && submissionData) {
    let me = userData.data;
    let submissions = submissionData.data;
    console.log(submissions);

    return (
      <div className="submission-container">
        <h1>My submissions</h1>
        <div className="d-flex jc-end" style={{ marginBottom: "1.5em" }}>
          <div className="rotated-text red-txt">Pending</div>
          <div className="rotated-text">Approved</div>
        </div>
        <CollapsibleSection
          title="QParts"
          content={<QPartSubmissions qparts={submissions.qparts} />}
          pending={countApprovalDates(submissions.qparts, true)}
          approved={countApprovalDates(submissions.qparts, false)}
        />
        <CollapsibleSection
          title="Images"
          content={genImageContent(submissions.images)}
          pending={countApprovalDates(submissions.images, true)}
          approved={countApprovalDates(submissions.images, false)}
        />
        <CollapsibleSection
          title="Parts"
          content={genPartContent(submissions.parts)}
          pending={countApprovalDates(submissions.parts, true)}
          approved={countApprovalDates(submissions.parts, false)}
        />
        <CollapsibleSection
          title="Molds"
          content={genPartMoldContent(submissions.molds)}
          pending={countApprovalDates(submissions.molds, true)}
          approved={countApprovalDates(submissions.molds, false)}
        />
        <CollapsibleSection
          title="Colors"
          content={genColorContent(submissions.colors)}
          pending={countApprovalDates(submissions.colors, true)}
          approved={countApprovalDates(submissions.colors, false)}
        />
        <CollapsibleSection
          title="Similar Colors"
          content={genSimilarColorContent(submissions.similarColors)}
          pending={countApprovalDates(submissions.similarColors, true)}
          approved={countApprovalDates(submissions.similarColors, false)}
        />
        <CollapsibleSection
          title="QPart Statuses"
          content={genStatusContent(submissions.statuses)}
          pending={countApprovalDates(submissions.statuses, true)}
          approved={countApprovalDates(submissions.statuses, false)}
        />
        <CollapsibleSection
          title="Element IDs"
          content={genEIDContent(submissions.eIDs)}
          pending={countApprovalDates(submissions.eIDs, true)}
          approved={countApprovalDates(submissions.eIDs, false)}
        />
        <CollapsibleSection
          title="Sculptures"
          content={genSculptureContent(submissions.sculptures)}
          pending={countApprovalDates(submissions.sculptures, true)}
          approved={countApprovalDates(submissions.sculptures, false)}
        />
        <CollapsibleSection
          title="Sculpture Inventories"
          content={genSculptureInventoryContent(
            submissions.sculptureInventories
          )}
          pending={countApprovalDates(submissions.sculptureInventories, true)}
          approved={countApprovalDates(submissions.sculptureInventories, false)}
        />
      </div>
    );
  } else return <LoadingPage />;

  function genImageContent(images: ImageDTO[]): ReactNode {
    if (images.length == 0)
      return <div className="grey-txt">No Images submitted</div>;
    return (
      <div className="admin-image-container d-flex  w-100">
        {images.map((image) => (
          <div key={image.id} className="admin-image-card">
            <div>
              <div className="admin-image-div">
                <img src={imagePath + image.fileName} alt="brick" />
              </div>
              <div className="d-flex flex-col ai-start">
                <div className={"status-tag img-" + image.type}>
                  {image.type}
                </div>
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
      </div>
    );
  }

  function genPartContent(parts: IPartDTO[]): ReactNode {
    if (parts.length == 0)
      return <div className="grey-txt">No Parts submitted</div>;
  }
  function genPartMoldContent(molds: IPartMoldDTO[]): ReactNode {
    if (molds.length == 0)
      return <div className="grey-txt">No Part Molds submitted</div>;
    return molds.map((mold) => <></>);
  }

  function genColorContent(colors: color[]): ReactNode {
    if (colors.length == 0)
      return <div className="grey-txt">No Colors submitted</div>;
    return colors.map((color) => (
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
    ));
  }

  function genSimilarColorContent(simColors: ISimilarColorDTO[]): ReactNode {
    if (simColors.length == 0)
      return <div className="grey-txt">No Similar Colors submitted</div>;
    return simColors.map((simColor) => <></>);
  }

  function genStatusContent(statuses: IPartStatusDTO[]): ReactNode {
    if (statuses.length == 0)
      return <div className="grey-txt">No QPart Statuses submitted</div>;
    return statuses.map((status) => <></>);
  }

  function genEIDContent(eIDs: IElementIDWQPartLESS[]): ReactNode {
    if (eIDs.length == 0)
      return <div className="grey-txt">No Element IDs submitted</div>;

    interface IQPartWithEIDS {
      qpart: IQPartDTOIncludeLess;
      eIDs: IElementID[];
    }
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
    return objArr.map((qpartObj) => (
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
    ));
  }
  function genSculptureContent(sculptures: ISculptureWithImages[]): ReactNode {
    if (sculptures.length == 0)
      return <div className="grey-txt">No Sculptures submitted</div>;

    console.log(sculptures);

    return sculptures.map((sculpture) => (
      <RecentSculpture
        key={sculpture.id}
        sculpture={sculpture}
        ribbonOverride={
          sculpture.approvalDate == null
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
    ));
  }
  function genSculptureInventoryContent(
    sculpInv: ISculptureInventoryItem[]
  ): ReactNode {
    if (sculpInv.length == 0)
      return <div className="grey-txt">No Sculpture Parts submitted</div>;

    interface ISculpPart {
      part: IQPartDTOIncludeLess;
      approvalDate: string;
    }
    interface ISortedSculpInvParts {
      sculpture: ISculptureWithImages;
      creator: user;
      parts: ISculpPart[];
    }
    let invArray: ISortedSculpInvParts[] = [];

    sculpInv.forEach((entry) => {
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
          parts: [{ part: entry.qpart, approvalDate: entry.approvalDate }],
        });
      }
    });

    return invArray.map((sculpObj) => (
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
          {sculpObj.parts.map((partObj) => (
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
          ))}
        </div>
      </fieldset>
    ));
  }

  interface CommonInterface {
    approvalDate: string | null;
  }

  // Define the generic function
  function countApprovalDates<T extends CommonInterface>(
    items: T[],
    countNull: boolean
  ): number {
    // Count the number of items with approvalDate equal to null
    if (countNull)
      return items.filter((item) => item.approvalDate === null).length;
    return items.filter((item) => item.approvalDate !== null).length;
  }
}
