import axios from "axios";
import { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import AllColorParts from "../../components/AllColorParts";
import LoadingPage from "../../components/LoadingPage";
import SimilarColorBanner from "../../components/SimilarColorBanner";
import {
  IAPIResponse,
  ISimilarColor,
  ISimilarColorDTO,
  colorWSimilar,
} from "../../interfaces/general";
import { useEffect } from "react";
import MyToolTip from "../../components/MyToolTip";
import { AppContext } from "../../context/context";
import showToast, {
  Mode,
  getPrefColorName,
  getTextColor,
} from "../../utils/utils";
import ColorTextField from "../../components/ColorTextField";

export default function SingleColorView() {
  const {
    state: {
      jwt: { token, payload },
    },
  } = useContext(AppContext);
  // let color = colors.find((x) => x.Lid == ColorId());
  const { colorId } = useParams();
  const navigate = useNavigate();
  const [similarColorToAdd, setSimilarColorToAdd] = useState<number>(0);
  const [resetColorComponent, setResetColorComponent] = useState(false);
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

  const similarColorMutation = useMutation({
    mutationFn: ({ color_one, color_two }: ISimilarColor) =>
      axios.post<IAPIResponse>(
        `http://localhost:3000/similarColor/add`,
        {
          color_one,
          color_two,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onSuccess: (e) => {
      console.log(e.data);

      if (e.data.code == 200) {
        showToast("Similar Color Pair added!", Mode.Success);
        colRefetch();
        handleResetComponent();
      } else if (e.data.code == 201) {
        showToast("Similar Color Pair restored!", Mode.Success);
        colRefetch();
        handleResetComponent();
      } else if (e.data.code == 202) {
        showToast("Similar Color Pair submitted!", Mode.Success);
        handleResetComponent();
      } else if (e.data.code == 501) {
        showToast(
          "Similar Color Relationship already exist between these colors, it may be pending approval",
          Mode.Warning
        );
      } else if (e.data.code == 502) {
        showToast(
          "Color does not exist, please make sure you are using the QID",
          Mode.Error
        );
      } else {
        showToast(
          "Failed to add Similar Color. Make sure you are using the QID",
          Mode.Error
        );
      }
    },
  });
  const handleResetComponent = () => {
    setResetColorComponent(true);
    setTimeout(() => {
      setResetColorComponent(false);
    }, 0);
  };
  if (colError) {
    navigate("/404");
  }
  const color = colData?.data;
  const hex = "#" + color?.hex;
  // console.log(color);

  // console.log(similarColorToAdd);
  if (color)
    return (
      <>
        <div className="mx-w">
          <div className="colorTop">
            <div className="colorName">
              {getPrefColorName(color, prefPayload.prefName)}
            </div>
            <div
              className="hexbar"
              style={{
                backgroundColor: hex,
                color: getTextColor(hex, false, true),
                textShadow: `${getTextColor(hex, true)} 1px 1px 0`,
              }}
            >
              {hex}
            </div>
          </div>
          <div className="fake-hr"></div>
          <SimilarColorBanner similarColors={color.similar} />
          <div className="jc-end">
            <div className="d-flex jc-end" style={{ marginBottom: "1em" }}>
              <ColorTextField
                setter={setSimilarColorToAdd}
                reset={resetColorComponent}
              />
              <button
                onClick={() => {
                  // console.log(Number(colorId), similarColorToAdd);

                  if (
                    Number(colorId) != similarColorToAdd &&
                    payload.id &&
                    payload.id != -1
                  ) {
                    similarColorMutation.mutate({
                      color_one: Number(colorId),
                      color_two: similarColorToAdd,
                    });
                  } else {
                    showToast(`Error`, Mode.Info);
                  }
                }}
              >
                Add similarity
              </button>
            </div>
          </div>
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
              <Link className="link" to={`/edit/color/${color?.id}`}>Edit this color</Link>
            </section>
          </div>
        </div>
      </>
    );
  else return <LoadingPage />;
}
