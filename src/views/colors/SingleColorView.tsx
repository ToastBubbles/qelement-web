import axios from "axios";
import { useContext } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import AllColorParts from "../../components/AllColorParts";
import LoadingPage from "../../components/LoadingPage";
import SimilarColorBanner from "../../components/SimilarColorBanner";
import { colorWSimilar } from "../../interfaces/general";
import { useEffect } from "react";
import MyToolTip from "../../components/MyToolTip";
import { AppContext } from "../../context/context";
import { getPrefColorName } from "../../utils/utils";

export default function SingleColorView() {
  // let color = colors.find((x) => x.Lid == ColorId());
  const { colorId } = useParams();
  const navigate = useNavigate();

  // const [similarColorToAdd, setSimilarColorToAdd] = useState<number>(0);
  const {
    state: {
      // jwt: { token, payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);

  const {
    data: colData,
    error: colError,
    refetch: colRefetch,
  } = useQuery({
    queryKey: "color",
    queryFn: () =>
      axios.get<colorWSimilar>(`http://localhost:3000/color/id/${colorId}`),
    enabled: true,
    retry: false,
  });

  useEffect(() => {
    colRefetch();
  }, [colorId, colRefetch]);
  // const {
  //   data: simData,
  //   error: simError,
  // } = useQuery({
  //   queryKey: "similarColors",
  //   queryFn: () =>
  //     axios.get<similarColor[]>(
  //       `http://localhost:3000/similarColor/${colorId}`
  //     ),
  //   enabled: true,
  //   retry: false,
  // });

  if (colError) {
    navigate("/404");
  }
  const color = colData?.data;
  const hex = "#" + color?.hex;
  console.log(color);

  // console.log(similarColorToAdd);
  if (color)
    return (
      <>
        <div className="mx-w">
          <div className="colorTop">
            <div className="colorName">
              {getPrefColorName(color, prefPayload.prefName)}
            </div>
            <div className="hexbar" style={{ backgroundColor: hex }}>
              {hex}
            </div>
          </div>
          <div className="fake-hr"></div>
          <SimilarColorBanner similarColors={color.similar} />
          <div className="color-container">
            <section>
              <AllColorParts colorId={color.id} />
            </section>
            <section>
              <div className="color-details-container">
                <div className="color-details-banner">color details</div>

                <div className="color-detail-header">
                  <span>ID</span>
                </div>
                <div className="color-subdetails-id">
                  <div>
                    <div className="color-id">
                      {color?.bl_id == null ? "UNK" : color?.bl_id}
                    </div>
                    <div>Bricklink</div>
                  </div>
                  <div>
                    <div className="color-id">
                      {color.tlg_id == null ? "UNK" : color?.tlg_id}
                    </div>
                    <div>LEGO</div>
                  </div>
                  <div>
                    <div className="color-id">
                      {color?.bo_id == null ? "UNK" : color?.bo_id}
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
                  <span>Other Details</span>
                </div>
                <div
                  className="w-90 d-flex jc-space-b"
                  style={{ width: "90%", margin: "1em 0" }}
                >
                  <label htmlFor="type">Type</label>
                  <div>{color?.type}</div>
                </div>
                <div
                  className="w-90 d-flex jc-space-b"
                  style={{ width: "90%", margin: "1em 0" }}
                >
                  <label htmlFor="swatch">
                    Swatch ID{" "}
                    <MyToolTip
                      content="Strictly internal, used for organizing by shade"
                      id="1"
                    />
                  </label>

                  <div>{color.swatchId}</div>
                </div>
                <div className="color-detail-header">
                  <span>Note</span>
                </div>
                <div className="col-det-note">
                  {color?.note ? color.note : "No additional notes"}
                </div>
              </div>
              <Link to={`/edit/color/${color?.id}`}>Edit this color</Link>
            </section>
          </div>
        </div>
      </>
    );
  else return <LoadingPage />;
}
