
import { color } from "../interfaces/general";
import axios from "axios";
import { useMutation } from "react-query";
import showToast, { Mode } from "../utils/utils";

interface IProps {
  color: color;
  refetchFn: () => void;
}

export default function ColorDetails({ color, refetchFn }: IProps) {
  const colMutation = useMutation({
    mutationFn: (id: number) =>
      axios
        .post<number>(`http://localhost:3000/color/approve`, { id })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err)),
    onSuccess: () => {
      refetchFn();
      showToast("Color approved!", Mode.Success);
    },
  });

  return (
    <div className="coldeet">
      <div>
        <div>BL:</div>
        <div>
          {color.bl_name} ({color.bl_id})
        </div>
      </div>
      <div>
        <div>TLG:</div>
        <div>
          {color.tlg_name} ({color.tlg_id})
        </div>
      </div>
      <div>
        <div>BO:</div>
        <div>
          {color.bo_name} ({color.bo_id})
        </div>
      </div>
      <div>
        <div>HEX:</div>
        <div>
          {" "}
          #{color.hex.toUpperCase()}
          <div
            className={"listing-color-swatch " + color.type}
            style={{ backgroundColor: `#${color.hex}` }}
          ></div>
        </div>
      </div>
      <div>
        <div>Type:</div>
        <div> {color.type}</div>
      </div>
      <section>
        Note:
        <div className="wrapbreak">{color.note}</div>
      </section>
      <button onClick={() => colMutation.mutate(color.id)}>Approve</button>
    </div>
  );
}
