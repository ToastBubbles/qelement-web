import axios from "axios";
import { useQuery } from "react-query";
import { IQPartDTOInclude } from "../interfaces/general";

export default function SiteStats() {
  const { data } = useQuery({
    queryKey: "qpartoftheday",
    queryFn: () => {
      return axios.get<IQPartDTOInclude>(`http://localhost:3000/qpart/qpotd`);
    },
    staleTime: 1000 * 60 * 30,
    // enabled: partData?.data !== "" && !partIsLoading,
  });

  if (data) {
    // const qpart = data.data;
    return (
      <>
        <div className="qpotd" style={{ marginTop: "1em" }}>
          Site Stats
        </div>
        <div className="listing recent-change"></div>
      </>
    );
  } else return <div className="listing new-listing">Loading...</div>;
}
