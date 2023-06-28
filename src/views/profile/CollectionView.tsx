import { useContext } from "react";
import { AppContext } from "../../context/context";

export default function CollectionView() {
  const {
    state: {
      jwt: { token, payload },
    },
    dispatch,
  } = useContext(AppContext);
  return (
    <>
      <div className="padded-container">
        <h1>Your Collection</h1>
      </div>
    </>
  );
}
