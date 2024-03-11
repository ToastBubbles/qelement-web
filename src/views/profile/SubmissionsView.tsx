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
import ImageSubmissions from "../../components/Submission Components/ImageSubmissions";
import ColorSubmissions from "../../components/Submission Components/ColorSubmissions";
import SculptureSubmissions from "../../components/Submission Components/SculptureSubmissions";
import EIDsubmissions from "../../components/Submission Components/EIDSubmissions";
import SculptureInventoriesSubmissions from "../../components/Submission Components/SculptureInventoriesSubmissions";
import SimilarColorSubmissions from "../../components/Submission Components/SimilarColorSubmissions";

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
    // console.log(submissions);

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
          content={<ImageSubmissions images={submissions.images} />}
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
          content={<ColorSubmissions colors={submissions.colors} />}
          pending={countApprovalDates(submissions.colors, true)}
          approved={countApprovalDates(submissions.colors, false)}
        />
        <CollapsibleSection
          title="Similar Colors"
          content={
            <SimilarColorSubmissions simColors={submissions.similarColors} />
          }
          pending={Math.ceil(
            countApprovalDates(submissions.similarColors, true) / 2
          )}
          approved={Math.ceil(
            countApprovalDates(submissions.similarColors, false) / 2
          )}
        />
        <CollapsibleSection
          title="QPart Statuses"
          content={genStatusContent(submissions.statuses)}
          pending={countApprovalDates(submissions.statuses, true)}
          approved={countApprovalDates(submissions.statuses, false)}
        />
        <CollapsibleSection
          title="Element IDs"
          content={<EIDsubmissions eIDs={submissions.eIDs} />}
          pending={countApprovalDates(submissions.eIDs, true)}
          approved={countApprovalDates(submissions.eIDs, false)}
        />
        <CollapsibleSection
          title="Sculptures"
          content={<SculptureSubmissions sculptures={submissions.sculptures} />}
          pending={countApprovalDates(submissions.sculptures, true)}
          approved={countApprovalDates(submissions.sculptures, false)}
        />
        <CollapsibleSection
          title="Sculpture Inventories"
          content={
            <SculptureInventoriesSubmissions
              sculpInventories={submissions.sculptureInventories}
            />
          }
          pending={countApprovalDates(submissions.sculptureInventories, true)}
          approved={countApprovalDates(submissions.sculptureInventories, false)}
        />
      </div>
    );
  } else return <LoadingPage />;

  function genPartContent(parts: IPartDTO[]): ReactNode {
    if (parts.length == 0)
      return <div className="grey-txt">No Parts submitted</div>;
  }
  function genPartMoldContent(molds: IPartMoldDTO[]): ReactNode {
    if (molds.length == 0)
      return <div className="grey-txt">No Part Molds submitted</div>;
    return molds.map((mold) => <></>);
  }

  // function genSimilarColorContent(simColors: ISimilarColorDTO[]): ReactNode {
  //   console.log(simColors);

  //   if (simColors.length == 0)
  //     return <div className="grey-txt">No Similar Colors submitted</div>;
  //   return simColors.map((simColor) => <></>);
  // }

  function genStatusContent(statuses: IPartStatusDTO[]): ReactNode {
    if (statuses.length == 0)
      return <div className="grey-txt">No QPart Statuses submitted</div>;
    return statuses.map((status) => <></>);
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
