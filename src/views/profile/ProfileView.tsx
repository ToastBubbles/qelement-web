import { useContext } from "react";
import { AppContext } from "../../context/context";
import ProfileButton from "../../components/ProfileButton";

export default function ProfileView() {
  const {
    state: {
      jwt: { payload },
    },
  } = useContext(AppContext);
  return (
    <>
      <div className="mx-w">
        <h1>Welcome {payload.username as string}</h1>
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
    </>
  );
}
