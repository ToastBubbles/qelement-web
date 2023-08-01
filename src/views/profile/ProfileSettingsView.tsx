import { useContext } from "react";
import { AppContext } from "../../context/context";
import axios from "axios";
import { useQuery } from "react-query";
import { IUserDTO } from "../../interfaces/general";
import LoadingPage from "../../components/LoadingPage";
import { formatDate } from "../../utils/utils";

export default function ProfileSettingsView() {
  const {
    state: {
      jwt: {  payload },
    },
  
  } = useContext(AppContext);

  const { data } = useQuery({
    queryKey: `user${payload.id}`,
    queryFn: () =>
      axios.get<IUserDTO>(`http://localhost:3000/user/id/${payload.id}`),
    // onSuccess() {
    // },
    enabled: !!payload.id,
  });

  if (data) {
    const me = data.data;
    return (
      <>
        <div className="formcontainer">
          <h1>Settings</h1>
          <div className="mainform">
            <div className="w-100 d-flex jc-space-b">
              <div>Username:</div>
              <div>{payload.username}</div>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <div>Email:</div>
              <div>{me.email}</div>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <div>Role:</div>
              <div>{me.role}</div>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <div>Date Joined:</div>
              <div>{formatDate(me.createdAt)}</div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <LoadingPage />;
  }
}
