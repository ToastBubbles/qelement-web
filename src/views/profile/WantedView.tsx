import { useContext } from "react";
import { AppContext } from "../../context/context";

export default function WantedView() {
  const {
    state: {
      jwt: { token, payload },
    },
    dispatch,
  } = useContext(AppContext);
  return (
    <>
      <div className="padded-container">
        <h1>Your Wanted Items</h1>
      </div>
    </>
  );
}
