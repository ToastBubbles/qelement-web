import axios from "axios";
import { useMutation, useQuery } from "react-query";
import showToast, { Mode } from "../utils/utils";
import {
  IQPartDTO,
  IQPartDTOInclude,
  color,
  part,
  user,
} from "../interfaces/general";
import { Link } from "react-router-dom";

interface IProps {
  qpart: IQPartDTOInclude;
  refetchFn: () => void;
}

export default function QPartDetails({ qpart, refetchFn }: IProps) {
  console.log(qpart);

  const qpartMutation = useMutation({
    mutationFn: (id: number) =>
      axios
        .post<number>(`http://localhost:3000/qpart/approve`, { id })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err)),
    onSuccess: () => {
      refetchFn();
      showToast("Qelement approved!", Mode.Success);
    },
  });
  // const { data: partData } = useQuery(`part${qpart.partId}`, () =>
  //   axios.get<part>(`http://localhost:3000/parts/id/${qpart.partId}`)
  // );

  // const { data: colData } = useQuery("allColors", () =>
  //   axios.get<color[]>("http://localhost:3000/color")
  // );

  // const { data: creatorData } = useQuery(`user${qpart.creatorId}`, () =>
  //   axios.get<user>(`http://localhost:3000/user/id/${qpart.creatorId}`)
  // );

  if (qpart) {
    return (
      <div className="coldeet">
        <div>
          <div>Part:</div>
          <Link to={`/part/${qpart.mold.parentPart.id}`}>
            {qpart.mold.parentPart.name} ({qpart.mold.number})
          </Link>
        </div>
        <div>
          <div>Color:</div>
          <Link to={`/color/${qpart.color.id}`}>
            {qpart.color?.bl_name ? qpart.color.bl_name : qpart.color?.tlg_name}
          </Link>
        </div>
        <div>
          <div>Type:</div>
          <div>{qpart.type}</div>
        </div>
        <div>
          <div>Element ID:</div>
          <div>{qpart.elementId}</div>
        </div>

        <div>
          <div>Requestor:</div>
          <div>
            {qpart.creator.name} ({qpart.creator.email})
          </div>
        </div>

        <section>
          Note:
          <div className="wrapbreak">{qpart.note}</div>
        </section>
        <button onClick={() => qpartMutation.mutate(qpart.id)}>Approve</button>
      </div>
    );
  } else return <p>Loading</p>;
}
