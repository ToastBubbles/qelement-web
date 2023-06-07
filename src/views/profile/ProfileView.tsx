import { useContext } from "react";
import { AppContext } from "../../context/context";

export default function ProfileView() {
  const {
    state: {
      jwt: { token, payload },
    },
    dispatch,
  } = useContext(AppContext);
  return (
    <>
      <h1>Welcome {payload?.username as string}</h1>;
    </>
  );
}
``;
