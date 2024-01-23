import axios from "axios";
import { useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useMutation, useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { AppContext } from "../../../context/context";
import showToast, { Mode, getPrefColorName } from "../../../utils/utils";
import {
  IAPIResponse,
  IArrayOfIDs,
  ICategoryWParts,
  IQPartDTOInclude,
  ISculptureDTO,
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

  const { data: sculptData, refetch: sculptRefetch } = useQuery({
    queryKey: `sculpt${sculptId}`,
    queryFn: () => {
      return axios.get<ISculptureDTO>(
        `http://localhost:3000/sculpture/byIdWithPendingParts/${sculptId}`
      );
    },
    staleTime: 0,
    enabled: !!sculptId,
  });

  const { data: qpartData, refetch: qpartRefetch } = useQuery({
    queryKey: `qpart${partId}`,
    queryFn: () => {
      return axios.get<IQPartDTOInclude[]>(
        `http://localhost:3000/qpart/matchesByPartId/${partId}`
      );
    },
    staleTime: 0,
    enabled: !!partId,
  });

  const { data: partsData, refetch: partsRefetch } = useQuery({
    queryKey: "singleCatPartsAdd",
    queryFn: () =>
      axios.get<part[]>(`http://localhost:3000/parts/byCatId/${category}`),
    enabled: category != -1,
  });

  const { data: catData, isFetched: catIsFetched } = useQuery("todos", () =>
    axios.get<ICategoryWParts[]>("http://localhost:3000/categories")
  );

  useEffect(() => {
    partsRefetch();
    setPartId(-1);
  }, [category, partsRefetch]);

  useEffect(() => {
    qpartRefetch();
    setQPartId(-1);
  }, [partId, qpartRefetch]);

  const sculptureMutation = useMutation({
    mutationFn: (qpartIds: IArrayOfIDs) =>
      axios.post<IAPIResponse>(
        `http://localhost:3000/sculptureInventory/addParts/${sculptId}`,
        qpartIds
      ),
    onSuccess: (data) => {
      console.log(data);

      if (data.data?.code == 200) {
        showToast("Sculpture parts submitted for approval!", Mode.Success);
        setQparts([]);
        sculptRefetch();
      } else if (data.data?.code == 201) {
        showToast("Sculpture parts added!", Mode.Success);
        setQparts([]);
        sculptRefetch();
      } else {
        showToast("Something went wrong", Mode.Error);
      }
    },
  });

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
                  {qpartData?.data
                    .sort((a, b) => a.color.swatchId - b.color.swatchId)
                    .map((qpart) => (
                      <option key={qpart.id} value={`${qpart.id}`}>
                        {qpart.mold.number}
                        {qpart.isMoldUnknown ? "*" : ""}{" "}
                        {getPrefColorName(qpart.color, prefPayload.prefName)}
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
                    overflowY: "auto",
                  }}
                >
                  {qparts.map((qpart) => {
                    return (
                      <RecentQPart
                        key={qpart.id}
                        qpart={qpart}
                        hideDate={true}
                        disableLinks={true}
                      />
                    );
                  })}
                </div>{" "}
                <div
                  className="secondaryform rib-container"
                  style={{
                    borderTopLeftRadius: "0",
                    borderBottomLeftRadius: "0",
                    borderLeft: "none",
                    overflowY: "auto",
                  }}
                >
                  {sculpture.inventory.map((qpart) => {
                    if (qpart.SculptureInventory.approvalDate == null) {
                      return (
                        <RecentQPart
                          key={qpart.id}
                          qpart={qpart}
                          hideDate={true}
                          disableLinks={true}
                          ribbonOverride={{
                            content: "Pending",
                            bgColor: "#aaa",
                            fgColor: "#000",
                            fontSize: "1em",
                          }}
                        />
                      );
                    }
                    return (
                      <RecentQPart
                        key={qpart.id}
                        qpart={qpart}
                        hideDate={true}
                        disableLinks={true}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <div>
              <button
                className="formInputNM"
                onClick={() => {
                  if (qparts.length == 0) {
                    showToast(
                      "You haven't selected any parts yet!",
                      Mode.Error
                    );
                  } else if (!!sculptId && Number(sculptId) > 0) {
                    let numbers: number[] = [];

                    qparts.forEach((qpart) => numbers.push(qpart.id));
                    let output: IArrayOfIDs = {
                      ids: numbers,
                      userId: payload.id,
                    };
                    sculptureMutation.mutate(output);
                  }
                }}
              >
                Submit Parts
              </button>
            </div>
          </div>
        </div>
      </>
    );
  } else {
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
