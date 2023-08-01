import { useContext } from "react";
import { Navigate } from "react-router";
import { AppContext } from "../context/context";
import { useQuery } from "react-query";
import axios from "axios";
import { IAPIResponse } from "../interfaces/general";
import showToast, { Mode } from "../utils/utils";

export const ProtectedRoute = ({ level = "user", children }: any) => {
  const {
    state: {
      jwt: {  payload },
    },

  } = useContext(AppContext);

  const {
    data: adminData,
  
  } = useQuery({
    queryKey: "isAdmin",
    queryFn: () =>
      axios.get<IAPIResponse>(
        `http://localhost:3000/user/checkIfAdmin/${payload.id}`
      ),
    retry: false,
    // refetchInterval: 30000,
    enabled: !!payload.id && level == "admin",
  });

  if (!payload || payload.id == 0 || payload.id == undefined) {
    showToast("You must be logged in to visit this page!", Mode.Warning);
    return <Navigate to="/" replace />;
  }

  if (level == "admin" && adminData?.data.code != 200) {
    showToast(
      "You do not have the correct privileges to view this page",
      Mode.Warning
    );
    return <Navigate to="/" replace />;
  }

  return children;
};
