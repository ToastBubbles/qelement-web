import { useContext } from "react";
import { AppContext } from "../../context/context";

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
      </div>
    </>
  );
}