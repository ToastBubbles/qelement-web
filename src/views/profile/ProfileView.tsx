import { useContext } from "react";
import { AppContext } from "../../context/context";
import ProfileButton from "../../components/ProfileButton";
import ColorLink from "../../components/ColorLink";
import { IAPIResponse, IUserDTO } from "../../interfaces/general";
import axios from "axios";
import showToast, { formatDate, getProfilePicture } from "../../utils/utils";
import LoadingPage from "../../components/LoadingPage";
import { useQuery } from "react-query";

export default function ProfileView() {
  const {
    state: {
      jwt: { payload },
    },
  } = useContext(AppContext);

  const { data: userData } = useQuery({
    queryKey: `userId${payload.id}`,
    queryFn: () =>
      axios.get<IUserDTO>(`http://localhost:3000/user/id/${payload.id}`),
    // onSuccess: (resp) => {
    //   if ("code" in resp.data && resp.data?.code == 404) {
    //     showToast("Recipient does not exist", Mode.Error);

    //   } else if ("id" in resp.data) {

    //     setIsUsernameBad(false);
    //   }
    // },
    retry: false,
    // refetchInterval: 30000,
    enabled: !!payload && payload.id > 0,
  });
  if (userData) {
    let me = userData.data;
    let myTitle = me.titles.find((x) => x.id == me.selectedTitleId);
    return (
      <div className="formcontainer">
        <div className="profile-container" style={{ marginTop: "3em" }}>
          <div className=" profile-header">
            <img
              className="pfp"
              src={getProfilePicture(me.profilePicture, true)}
            />
            <div
              style={{ marginLeft: "0.5em" }}
              className="d-flex flex-col jc-center"
            >
              <div className="profile-name">{me.name}</div>
              {myTitle && (
                <div className={myTitle.cssClasses}>{myTitle.title}</div>
              )}
            </div>
          </div>
          <div className="profile-lower-container">
            <div
              className={"tabcontent profile-tab-content"}
              style={{
                overflowY: "auto",
                height: "30em",
                margin: "0",
                borderRight: "none",
                borderLeft: "none",
              }}
            >
              <div className="profile-overview">
                <span>Date joined: {formatDate(me.createdAt, "short")}</span>
                <div>Submissions:</div>
                <div
                  className="d-flex flex-col"
                  style={{ marginBottom: "1em" }}
                >
                  <span style={{ marginLeft: "1.5em" }}>
                    Pending:{" "}
                    {me.submissionCount.totalPending > 0 ? (
                      <span className="red-txt">
                        {me.submissionCount.totalPending}
                      </span>
                    ) : (
                      <span className="grey-txt">None</span>
                    )}
                  </span>
                  <span style={{ marginLeft: "1.5em" }}>
                    Approved:{" "}
                    {me.submissionCount.totalApproved > 0 ? (
                      <span>{me.submissionCount.totalApproved}</span>
                    ) : (
                      <span className="grey-txt">None</span>
                    )}
                  </span>
                </div>

                <span>Role: {me.role}</span>
                <span className="d-flex ai-center">
                  <span style={{ marginRight: "0.5em" }}>Favorite Color:</span>
                  {me.favoriteColor ? (
                    <ColorLink color={me.favoriteColor} />
                  ) : (
                    <>none</>
                  )}
                </span>

                <div className="w-100" style={{ marginTop: "2em" }}>
                  <div className="d-flex profile-btn-container">
                    <ProfileButton
                      link="/profile/collection"
                      content="My Collection"
                      imgPath="/img/goal.png"
                    />
                    <ProfileButton
                      link="/profile/wanted"
                      content="My Wanted Lists"
                      imgPath="/img/wanted.png"
                    />
                    <ProfileButton
                      link="/profile/submissions"
                      content="My Submissions"
                      imgPath="/img/submission.png"
                    />
                    <ProfileButton
                      link="/profile/settings"
                      content="My Settings"
                      imgPath="/img/settings.png"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else return <LoadingPage />;
}
