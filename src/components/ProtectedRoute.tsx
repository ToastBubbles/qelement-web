import { useContext } from "react";
import { Navigate } from "react-router";
import { AppContext } from "../context/context";
import { useQuery } from "react-query";
import axios from "axios";
import { IAPIResponse } from "../interfaces/general";

export const ProtectedRoute = ({ level = "user", children }: any) => {
  const {
    state: {
      jwt: { token, payload },
    },
    dispatch,
  } = useContext(AppContext);

  const {
    data: adminData,
    isLoading: adminIsLoading,
    error: adminError,
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
    return <Navigate to="/" replace />;
  }

  if (level == "admin" && adminData?.data.code != 200) {
    return <Navigate to="/" replace />;
  }

  return children;
};
