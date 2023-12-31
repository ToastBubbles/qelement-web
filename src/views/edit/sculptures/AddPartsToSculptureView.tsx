import axios from "axios";
import { CSSProperties, useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMutation, useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import MyToolTip from "../../../components/MyToolTip";
import { AppContext } from "../../../context/context";
import showToast, { Mode } from "../../../utils/utils";
import {
  IAPIResponse,
  ICreateSculptureDTO,
  IQPartDTOInclude,
  ISculptureDTO,
  category,
  part,
} from "../../../interfaces/general";
import RecentQPart from "../../../components/RecentQPart";

export default function AddPartsToSculptureView() {
  const {
    state: {
      jwt: { payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);

  const { sculptId } = useParams();
  const [category, setCategory] = useState<number>(-1);
  const [partId, setPartId] = useState<number>(-1);
  const [qPartId, setQPartId] = useState<number>(-1);

  const [qparts, setQparts] = useState<IQPartDTOInclude[]>([]);

  const {
    data: sculptData,
    error: sculptError,
    refetch: sculptRefetch,
  } = useQuery({
    queryKey: `sculpt${sculptId}`,
    queryFn: () => {
      return axios.get<ISculptureDTO>(
        `http://localhost:3000/sculpture/byId/${sculptId}`
      );
    },

    staleTime: 0,
    enabled: !!sculptId,
    // retry: false,
  });

  const {
    data: qpartData,
    error: qpartError,
    refetch: qpartRefetch,
  } = useQuery({
    queryKey: `qpart${partId}`,
    queryFn: () => {
      return axios.get<IQPartDTOInclude[]>(
        `http://localhost:3000/qpart/matchesByPartId/${partId}`
      );
    },

    staleTime: 0,
    enabled: !!partId,
    // retry: false,
  });

  const { data: partsData, refetch: partsRefetch } = useQuery({
    queryKey: "singleCatPartsAdd",
    queryFn: () =>
      axios.get<part[]>(`http://localhost:3000/parts/byCatId/${category}`),
    enabled: category != -1,
  });

  const { data: catData, isFetched: catIsFetched } = useQuery("todos", () =>
    axios.get<category[]>("http://localhost:3000/categories")
  );

  useEffect(() => {
    partsRefetch();
    setPartId(-1);
  }, [category, partsRefetch]);

  useEffect(() => {
    qpartRefetch();
    setQPartId(-1);
  }, [partId, qpartRefetch]);
  if (sculptData && catData) {
    let sculpture = sculptData.data;
    return (
      <>
        <div className="formcontainer">
          <h1>add parts to sculpture</h1>
          <div className="mainform">
            <div
              className="w-100 d-flex jc-space-b"
              style={{ marginBottom: "1em" }}
            >
              <div>Sculpture:</div>
              <div>{sculpture.name}</div>
            </div>
            <div className="mainform" style={{ paddingTop: "2em" }}>
              <div style={{ marginBottom: "1em" }}>
                If you can't find a part, it probably does not exist in our
                database, please submit it <Link to={"/add/qpart"}>here.</Link>
              </div>
              <div className="w-100 d-flex jc-space-b">
                <label htmlFor="cat">Category</label>
                <select
                  name="cat"
                  id="cat"
                  className="w-50 formInput"
                  onChange={(e) => setCategory(Number(e.target.value))}
                  value={category}
                >
                  <option value="-1">--</option>
                  {catData.data.map((cat) => (
                    <option key={cat.id} value={`${cat.id}`}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-100 d-flex jc-space-b">
                <label htmlFor="par">Part</label>
                <select
                  name="par"
                  id="par"
                  className="w-50 formInput"
                  onChange={(e) => setPartId(Number(e.target.value))}
                  value={partId}
                >
                  <option value="-1">--</option>
                  {partsData?.data.map((part) => (
                    <option key={part.id} value={`${part.id}`}>
                      {part.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-100 d-flex jc-space-b">
                <label htmlFor="element">Element</label>
                <select
                  name="element"
                  id="element"
                  className="w-50 formInput"
                  onChange={(e) => setQPartId(Number(e.target.value))}
                  value={qPartId}
                >
                  <option value="-1">--</option>
                  {qpartData?.data.map((qpart) => (
                    <option key={qpart.id} value={`${qpart.id}`}>
                      {qpart.mold.number}
                      {qpart.isMoldUnknown ? "*" : ""} {qpart.color.bl_name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="formInputNM"
                onClick={() => {
                  if (qPartId != -1) {
                    addQPart(qPartId);
                  } else
                    showToast("Please select an element first", Mode.Error);
                }}
              >
                Add Part
              </button>
            </div>
            <div className="w-100" style={{ height: "20em", margin: "2em 0" }}>
              <div className="w-100 d-flex jc-space-b">
                <div className="w-100">Parts to Add:</div>
                <div className="w-100">Existing Parts:</div>
              </div>
              <div className="w-100 d-flex jc-space-b h-100">
                <div
                  className="secondaryform rib-container"
                  style={{
                    borderTopRightRadius: "0",
                    borderBottomRightRadius: "0",
                  }}
                >
                  {qparts.map((qpart) => {
                    return (
                      <RecentQPart
                        qpart={qpart}
                        hideDate={true}
                        disableLinks={true}
                      />
                    );
                  })}
                </div>{" "}
                <div
                  className="secondaryform"
                  style={{
                    borderTopLeftRadius: "0",
                    borderBottomLeftRadius: "0",
                    borderLeft: "none",
                  }}
                ></div>
              </div>
            </div>
            <div>
              <button
                className="formInputNM"
                //   onClick={() => {
                //     if (validateDTO()) {
                //       sculptureMutation.mutate(newSculpture);
                //     }
                //   }}
              >
                Submit Parts
              </button>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    console.log(sculptId);

    return <p>Loading...</p>;
  }

  function addQPart(id: number) {
    if (id != -1) {
      let qpart = qpartData?.data.find((x) => x.id == id);
      if (qpart) {
        if (!qparts.includes(qpart)) setQparts([...qparts, qpart]);
        else showToast("You have already added this part below.", Mode.Error);
      } else showToast("Error finding part", Mode.Error);
    }
  }
}
