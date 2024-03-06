import { ReactNode, useContext } from "react";
import { AppContext } from "../../context/context";
import ProfileButton from "../../components/ProfileButton";
import ColorLink from "../../components/ColorLink";
import {
  IAPIResponse,
  IQPartDTOIncludeLess,
  ISubmissions,
  IUserDTO,
  ImageDTO,
} from "../../interfaces/general";
import axios from "axios";
import showToast, {
  formatDate,
  getProfilePicture,
  imagePath,
} from "../../utils/utils";
import LoadingPage from "../../components/LoadingPage";
import { useQuery } from "react-query";
import CollapsibleSection from "../../components/CollapsibleSection";
import RecentQPart from "../../components/RecentQPart";

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
          content={genQPartContent(submissions.qparts)}
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
          content={<></>}
          pending={0}
          approved={0}
        />
        <CollapsibleSection
          title="Molds"
          content={<></>}
          pending={0}
          approved={0}
        />
        <CollapsibleSection
          title="Colors"
          content={<></>}
          pending={0}
          approved={0}
        />
        <CollapsibleSection
          title="Similar Colors"
          content={<></>}
          pending={0}
          approved={0}
        />
        <CollapsibleSection
          title="QPart Statuses"
          content={<></>}
          pending={0}
          approved={0}
        />
        <CollapsibleSection
          title="Element IDs"
          content={<></>}
          pending={0}
          approved={0}
        />
        <CollapsibleSection
          title="Sculptures"
          content={<></>}
          pending={0}
          approved={0}
        />
        <CollapsibleSection
          title="Sculpture Inventories"
          content={<></>}
          pending={0}
          approved={0}
        />
      </div>
    );
  } else return <LoadingPage />;

  function genQPartContent(qparts: IQPartDTOIncludeLess[]): ReactNode {
    if (qparts.length == 0)
      return <div className="grey-txt">No QParts submitted</div>;
    qparts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return (
      <div className="rib-container">
        {qparts.map((qpart) => (
          <RecentQPart
            key={qpart.id}
            qpartl={qpart}
            ribbonOverride={
              qpart.approvalDate == null
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
    );
  }

  function genImageContent(images: ImageDTO[]): ReactNode {
    if (images.length == 0)
      return <div className="grey-txt">No Images submitted</div>;
    return (
      <div className="admin-image-container d-flex  w-100">
        {images.map((image) => (
          <div className="admin-image-card">
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
