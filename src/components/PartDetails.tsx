import axios from "axios";
import { useMutation, useQuery } from "react-query";
import showToast, { Mode } from "../utils/utils";
import { IPartDTO, part } from "../interfaces/general";

interface IProps {
  part: IPartDTO;
  refetchFn: () => void;
}

export default function PartDetails({ part, refetchFn }: IProps) {
  const colMutation = useMutation({
    mutationFn: (id: number) =>
      axios
        .post<number>(`http://localhost:3000/parts/approve`, { id })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err)),
    onSuccess: () => {
      refetchFn();
      showToast("Part approved!", Mode.Success);
    },
  });
  const { data: catData } = useQuery(`cat${part.CatId}`, () =>
    axios.get<part[]>(`http://localhost:3000/categories/id/${part.CatId}`)
  );
  if (catData)
    return (
      <div className="coldeet">
        <div>
          <div>Name:</div>
          <div>{part.name}</div>
        </div>
        <div>
          <div>Number:</div>
          <div>{part.number}</div>
        </div>
        <div>
          <div>2nd Number:</div>
          <div>{part.secondaryNumber}</div>
        </div>

        <section>
          Note:
          <div className="wrapbreak">{part.note}</div>
        </section>
        <button onClick={() => colMutation.mutate(part.id)}>Approve</button>
      </div>
    );
  else return <p>Loading</p>;
}
