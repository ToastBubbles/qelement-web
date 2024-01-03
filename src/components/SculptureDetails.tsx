import axios from "axios";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import { IQPartDTOInclude, ISculptureDTO } from "../interfaces/general";
import showToast, { Mode } from "../utils/utils";

interface IProps {
  sculpture: ISculptureDTO;
  refetchFn: () => void;
}

export default function SculptureDetails({ sculpture, refetchFn }: IProps) {
  const sculptureMutation = useMutation({
    mutationFn: (id: number) =>
      axios
        .post<number>(`http://localhost:3000/sculpture/approve`, { id })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err)),
    onSuccess: () => {
      refetchFn();
      showToast("Sculpture approved!", Mode.Success);
    },
  });

  if (sculpture) {
    console.log(sculpture);

    return (
      <div className="coldeet">
        <div>
          <div>Name:</div>
          <div>{sculpture.name}</div>
        </div>
        <div>
          <div>System:</div>
          <div>{sculpture.brickSystem}</div>
        </div>

        <div>
          <div>Year Made:</div>
          <div>{sculpture.yearMade}</div>
        </div>
        <div>
          <div>Tear Retired:</div>
          <div>{sculpture.yearRetired}</div>
        </div>
        <div>
          <div>Location:</div>
          <div>{sculpture.location}</div>
        </div>
        {/* <div>
          <div>Name:</div>
          <div>{sculpture.name}</div>
        </div> */}

        <div>
          <div>Requestor:</div>
          <div>
            {sculpture.creator.name} ({sculpture.creator.email})
          </div>
        </div>

        {/* <section>
          Note:
          <div className="wrapbreak">{sculpture.note}</div>
        </section> */}
        <button onClick={() => sculptureMutation.mutate(sculpture.id)}>
          Approve
        </button>
      </div>
    );
  } else return <p>Loading</p>;
}
