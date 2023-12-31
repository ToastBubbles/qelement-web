import axios from "axios";
import { useQuery } from "react-query";
import { IQPartDTOInclude } from "../interfaces/general";
import LoadingPage from "./LoadingPage";
import RecentQPart from "./RecentQPart";

interface iProps {
  colorId: number;
}
export default function AllColorParts({ colorId }: iProps) {
  const { data: qpartsData } = useQuery({
    queryKey: "qpartColors" + colorId,
    queryFn: () =>
      axios.get<IQPartDTOInclude[]>(
        `http://localhost:3000/qpart/colorMatches/${colorId}`
      ),
    enabled: !!colorId,
    retry: false,
  });

  if (qpartsData) {
    const qparts = qpartsData.data;
    return (
      <div className="rib-container">
        {qparts.length ? (
          qparts.map((qpart) => <RecentQPart key={qpart.id} qpart={qpart} />)
        ) : (
          <div>No parts found</div>
        )}
      </div>
    );
  } else {
    return <LoadingPage />;
  }
}
