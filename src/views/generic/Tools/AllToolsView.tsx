import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { AppContext } from "../../../context/context";
import { Link } from "react-router-dom";
import { IAPIResponse } from "../../../interfaces/general";
import { red } from "@mui/material/colors";
import GenericPopup from "../../../components/GenericPopup";
import showToast, { Mode } from "../../../utils/utils";

export default function AllToolsView() {
  const {
    state: {
      jwt: { token, payload },
    },
  } = useContext(AppContext);

  const [showPopup, setShowPopup] = useState<boolean>(false);

  const { data: adminData } = useQuery({
    queryKey: "isAdmin",
    queryFn: () =>
      axios.get<IAPIResponse>(
        `http://localhost:3000/user/checkIfAdmin/${payload.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    retry: false,
    // refetchInterval: 30000,
    enabled: !!payload.id,
  });

  const colorsMutation = useMutation({
    mutationFn: () =>
      axios.post(
        `http://localhost:3000/extra/addAllColors`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onSuccess: (e) => {
      if (e.data.code == 200) {
        showToast("Colors seeded!", Mode.Success);
        closePopup();
      } else {
        showToast("error", Mode.Error);
      }
    },
  });
  if (adminData) {
    let isAdmin = adminData.data.code == 200;
    return (
      <>
        <div className="formcontainer">
          <h1>tools</h1>
          <div className="mainform">
            <div className="w-100 d-flex flex-col ai-center">
              <Link className="link" to="/tools/compare">
                Image Comparison Tool
              </Link>
              <Link className="link" to="/tools/userLookup">
                User lookup
              </Link>
              <Link className="link" to="/tools/resources">
                Resources/External Websites
              </Link>
              {isAdmin && showPopup && (
                <GenericPopup
                  content={
                    <>
                      <div>Are you sure you want to seed colors?</div>
                      <div style={{ marginTop: "1em" }}>
                        <button onClick={() => seedColors()}>Confirm</button>
                      </div>
                    </>
                  }
                  closePopup={closePopup}
                />
              )}
              {isAdmin && (
                <div
                  className="clickable"
                  onClick={() => setShowPopup(true)}
                  style={{ color: "red", marginTop: "10em" }}
                >
                  Seed Colors
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  function seedColors() {
    colorsMutation.mutate();
  }
  function closePopup() {
    setShowPopup(false);
  }
}
