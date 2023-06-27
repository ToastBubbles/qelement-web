import axios from "axios";
import { useQuery, useMutation } from "react-query";
import showToast, { Mode } from "../../../utils/utils";
import {
  IAPIResponse,
  category,
  color,
  iIdOnly,
} from "../../../interfaces/general";

export default function ApproveCatView() {
  const {
    data: catData,
    isFetched,
    refetch,
  } = useQuery("notApprovedCats", () =>
    axios.get<category[]>("http://localhost:3000/categories/notApproved")
  );
  const catMutation = useMutation({
    mutationFn: (id: number) =>
      axios
        .post<IAPIResponse>(`http://localhost:3000/categories/approve`, { id })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err)),
    onSuccess: () => {
      refetch();
      showToast("Category approved!", Mode.Success);
    },
  });

  const catDeleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios.post<IAPIResponse>(`http://localhost:3000/categories/delete`, {
        id,
      }),
    onSuccess: (e) => {
      if (e.data.code == 200) {
        refetch();
        showToast("Category deleted...", Mode.Info);
      } else {
        showToast("Error deleting category", Mode.Error);
      }
    },
  });

  if (isFetched && catData) {
    let cats = catData.data;
    return (
      <>
        <div className="formcontainer">
          <h1>approve categories</h1>
          <div className="mainform">
            {cats.length > 0 ? (
              cats.map((cat) => {
                return (
                  <div
                    key={cat.id}
                    className="d-flex jc-space-b w-100 p-1 alternating-children"
                  >
                    <div>{cat.name}</div>
                    <div>
                      <button onClick={() => catMutation.mutate(cat.id)}>
                        Approve
                      </button>
                      <div className="button-spacer">|</div>
                      <button onClick={() => catDeleteMutation.mutate(cat.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center p-1">
                nothing to approve right now!
              </div>
            )}
          </div>
        </div>
      </>
    );
  } else {
    return <p>Loading...</p>;
  }
}
