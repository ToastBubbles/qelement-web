import axios from "axios";
import { useQuery, useMutation } from "react-query";
import showToast, { Mode } from "../../../utils/utils";
import { category, color, iIdOnly } from "../../../interfaces/general";

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
        .post<number>(`http://localhost:3000/categories/approve`, { id })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err)),
    onSuccess: () => {
      refetch();
      showToast("Category approved!", Mode.Success);
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
                  <div key={cat.id} className="d-flex jc-space-b w-100 my-1">
                    <div>{cat.name}</div>
                    <button onClick={() => catMutation.mutate(cat.id)}>
                      Approve
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-center my-1">
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
