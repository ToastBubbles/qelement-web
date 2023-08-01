import axios from "axios";
import { useMutation } from "react-query";
import { IPartMoldDTO } from "../interfaces/general";
import showToast, { Mode } from "../utils/utils";

interface IProps {
  mold: IPartMoldDTO;
  refetchFn: () => void;
}

export default function PartMoldDetails({ mold, refetchFn }: IProps) {
  const partMutation = useMutation({
    mutationFn: (id: number) =>
      axios
        .post<number>(`http://localhost:3000/partMold/approve`, { id })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err)),
    onSuccess: () => {
      refetchFn();
      showToast("Part Mold approved!", Mode.Success);
    },
  });

  return (
    <div className="coldeet">
      <div>
        <div>For:</div>
        <div>{mold.parentPart.name}</div>
      </div>
      <div>
        <div>Number:</div>
        <div>{mold.number}</div>
      </div>

      <section>
        Note:
        <div className="wrapbreak">{mold.note}</div>
      </section>
      {mold.parentPart.approvalDate == null ? (
        <div style={{ color: "red", float: "right" }}>
          Please approve parent part first
        </div>
      ) : (
        <button onClick={() => partMutation.mutate(mold.id)}>Approve</button>
      )}
    </div>
  );
  //   else return <p>Loading</p>;
}
