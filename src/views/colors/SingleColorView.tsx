import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import SimilarColorBanner from "../../components/SimilarColorBanner";
import { similarColor } from "../../interfaces/general";
import { useQuery } from "react-query";
import { color } from "../../interfaces/general";

export default function SingleColorView() {
  // let color = colors.find((x) => x.Lid == ColorId());
  const { colorId } = useParams();
  const navigate = useNavigate();

  const [similarColorToAdd, setSimilarColorToAdd] = useState<number>(0);

  // const queryClient = new QueryClient({
  //   defaultOptions: {
  //     queries: {
  //       // ✅ turns retries off
  //       retry: false,
  //     },
  //   },
  // })

  const {
    data: colData,
    isLoading: colIsLoading,
    error: colError,
  } = useQuery({
    queryKey: "color",
    queryFn: () => axios.get<color>(`http://localhost:3000/color/${colorId}`),
    enabled: true,
    retry: false,
  });
  const {
    data: simData,
    isLoading: simIsLoading,
    error: simError,
  } = useQuery({
    queryKey: "similarColors",
    queryFn: () =>
      axios.get<similarColor[]>(
        `http://localhost:3000/similarColor/${colorId}`
      ),
    enabled: true,
    retry: false,
  });
  // console.log(sdata);
  // console.log(simData?.data);

  // const similarColorMutation = useMutation({
  //   mutationFn: ({ color_one, color_two }: ISimilarColorDTO) =>
  //     axios.post<color>(`http://localhost:3000/similarColor`, {
  //       color_one,
  //       color_two,
  //     }),
  //   onSuccess: () => {},
  // });

  if (colError || simError) {
    navigate("/404");
  }
  let color = colData?.data;
  let hex = "#" + color?.hex;

  // console.log(similarColorToAdd);
  return (
    <>
      {}

      <div className="colorTop">
        <div className="colorName">
          {!colIsLoading && colData ? (
            color?.bl_name.length == 0 ? (
              color.tlg_name
            ) : (
              color?.bl_name
            )
          ) : (
            <p>loading...</p>
          )}
        </div>
        <div className="hexbar" style={{ backgroundColor: hex }}>
          {hex}
        </div>
      </div>
      <div className="fake-hr"></div>
      {!simIsLoading && simData ? (
        // console.log("data:", simData)
        <SimilarColorBanner similarColors={simData.data} />
      ) : (
        // <SimilarColorBanner {...simData.data} />
        // simData.data.length > 0 ? (
        //   simData?.data.forEach((c) => {
        //     console.log(c);

        //     <span>{c.colorId1}</span>;
        //   })
        // ) : (
        //   <div>no similarities</div>
        // )
        <p>loading...</p>
      )}

      {/* <input
        onChange={(e) => setSimilarColorToAdd(Number(e.target.value))}
        type="number"
        id="similarId"
        name="similarId"
        placeholder="color id"
      />
      <button
        onClick={() => {
          similarColorMutation.mutate({
            color_one: Number(colorId),
            color_two: similarColorToAdd,
          });
        }}
      >
        Add similarity
      </button> */}
      <div className="color-container">
        <section></section>
        <section>
          <div className="color-details-container">
            <div className="color-details-banner">color details</div>

            <div className="color-detail-header">
              <span>ID</span>
            </div>
            <div className="color-subdetails-id">
              <div>
                <div className="color-id">
                  {color?.bl_id == 0 ? "UNK" : color?.bl_id}
                </div>
                <div>Bricklink</div>
              </div>
              <div>
                <div className="color-id">
                  {color?.tlg_id == 0 ? "UNK" : color?.tlg_id}
                </div>
                <div>LEGO</div>
              </div>
              <div>
                <div className="color-id">
                  {color?.bl_id == 0 ? "UNK" : color?.bl_id}
                </div>
                <div>Brickowl</div>
              </div>
              <div>
                <div className="color-id">{color?.id}</div>
                <div>QID</div>
              </div>
            </div>
            <div className="color-detail-header">
              <span>Name</span>
            </div>
            <div style={{ width: "90%" }}>
              <div className="d-flex align-center">
                <div className="col-det-name ">Bricklink</div>
                <div className=" col-det-colname">
                  {color?.bl_name ? color.bl_name : "Unknown"}
                </div>
              </div>
              <div className="d-flex align-center">
                <div className="col-det-name ">LEGO</div>
                <div className=" col-det-colname">
                  {color?.tlg_name ? color.tlg_name : "Unknown"}
                </div>
              </div>
              <div className="d-flex align-center">
                <div className="col-det-name ">Brickowl</div>
                <div className=" col-det-colname">
                  {color?.bo_name ? color.bo_name : "Unknown"}
                </div>
              </div>
            </div>
            <div className="color-detail-header">
              <span>Note</span>
            </div>
            <div className="col-det-note">
              {color?.note ? color.note : "No additional notes"}
            </div>
          </div>
          <Link to={`/edit/colors/${color?.id}`}>Edit this color</Link>
        </section>
      </div>
    </>
  );
}
