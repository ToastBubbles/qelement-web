import axios from "axios";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { IQPartDTOInclude, IQPartDTOIncludeLess } from "../interfaces/general";
import LoadingPage from "./LoadingPage";
import { filterImages, imagePath } from "../utils/utils";
import RecentQPart from "./RecentQPart";

interface iProps {
  colorId: number;
}
export default function AllColorParts({ colorId }: iProps) {
  const { data: qpartsData, error: qpartsError } = useQuery({
    queryKey: "qpartColors" + colorId,
    queryFn: () =>
      axios.get<IQPartDTOInclude[]>(
        `http://localhost:3000/qpart/colorMatches/${colorId}`
      ),
    enabled: !!colorId,
    retry: false,
  });

  if (qpartsData) {
    let qparts = qpartsData.data;
    return (
      <div>
        
        {qparts.length ? (
          qparts.map((qpart) => <RecentQPart qpart={qpart} />)
        ) : (
          <div>No parts found</div>
        )}
      </div>
    );
  } else {
    return <LoadingPage />;
  }
}
