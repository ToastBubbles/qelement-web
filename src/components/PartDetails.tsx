import axios from "axios";
import { useMutation, useQuery } from "react-query";
import showToast, { Mode } from "../utils/utils";
import { IPartDTO, category, part } from "../interfaces/general";

interface IProps {
  part: IPartDTO;
  refetchFn: () => void;
}

export default function PartDetails({ part, refetchFn }: IProps) {
  const partMutation = useMutation({
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
    axios.get<category>(`http://localhost:3000/categories/id/${part.CatId}`)
  );
  if (catData)
    return (
      <div className="coldeet">
        <div>
          <div>Name:</div>
          <div>{part.name}</div>
        </div>
        <div>
          <div>Category:</div>
          <div>{catData.data.name}</div>
        </div>

        <section>
          Note:
          <div className="wrapbreak">{part.note}</div>
        </section>
        <button onClick={() => partMutation.mutate(part.id)}>Approve</button>
      </div>
    );
  else return <p>Loading</p>;
}
