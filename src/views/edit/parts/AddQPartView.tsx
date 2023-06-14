import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import {
  iPartDTO,
  category,
  part,
  iQPartDTO,
  color,
  IQPartDTO,
  IPartStatusDTO,
  IAPIResponse,
} from "../../../interfaces/general";
import { Link } from "react-router-dom";
import MyToolTip from "../../../components/MyToolTip";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { AppContext } from "../../../context/context";
import showToast, { Mode } from "../../../utils/utils";

export default function AddQPartView() {
  const {
    state: {
      jwt: { token, payload },
    },
    dispatch,
  } = useContext(AppContext);
  const defaultValues: iQPartDTO = {
    partId: -1,
    colorId: -1,
    elementId: "",
    secondaryElementId: "",
    creatorId: -1,
    note: "",
  };
  const defaultStatusValues: IPartStatusDTO = {
    status: "unknown",
    date: "",
    location: "",
    note: "",
    creatorId: -1,
    qpartId: -1,
  };
  const [newQPart, setNewQPart] = useState<iQPartDTO>(defaultValues);
  const [newStatus, setNewStatus] =
    useState<IPartStatusDTO>(defaultStatusValues);
  const [category, setCategory] = useState<number>(-1);
  const [startDate, setStartDate] = useState<Date>(new Date());

  const {
    data: colData,
    isLoading: colIsLoading,
    error: colError,
  } = useQuery("allColors", () =>
    axios.get<color[]>("http://localhost:3000/color")
  );

  const {
    data: partsData,
    error: partsError,
    refetch: partsRefetch,
  } = useQuery({
    queryKey: "singleCatPartsAdd",
    queryFn: () =>
      axios.get<part[]>(`http://localhost:3000/parts/byCatId/${category}`),
    enabled: category != -1,
  });
  useEffect(() => {
    partsRefetch();
    setNewQPart((newQPart) => ({
      ...newQPart,
      ...{ partId: -1 },
    }));
  }, [category]);

  const {
    data: catData,
    isLoading: catIsLoading,
    error: catError,
    isFetched: catIsFetched,
  } = useQuery("todos", () =>
    axios.get<category[]>("http://localhost:3000/categories")
  );

  const partMutation = useMutation({
    mutationFn: (qpart: iQPartDTO) =>
      axios.post<IAPIResponse>(`http://localhost:3000/qpart`, qpart),
    onSuccess: (data) => {
      if (data.data?.code == 200 && payload) {
        partStatusMutation.mutate({
          status: newStatus.status,
          date: startDate.toDateString(),
          location: newStatus.location,
          note: newStatus.note,
          qpartId: Number(data.data.message),
          creatorId: payload?.id || 1,
        });
      }
      // partStatusMutation.mutate({
      //   status: "",
      //   date: "",
      //   location: "",
      //   note: "",
      //   qpartId: 1,
      //   creatorId: 1,
      // });
    },
  });

  const partStatusMutation = useMutation({
    mutationFn: (status: IPartStatusDTO) =>
      axios.post<IPartStatusDTO>(`http://localhost:3000/partStatus`, status),
    onSuccess: () => {
      showToast("QElement Succesfully added!", Mode.Success);
      setNewStatus(defaultStatusValues);
      setStartDate(new Date());
    },
  });

  if (catIsFetched && catData && colData) {
    return (
      <>
        <div className="formcontainer">
          <h1>add new qelement</h1>
          <div className="mainform">
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
                onChange={(e) =>
                  setNewQPart((newQPart) => ({
                    ...newQPart,
                    ...{ partId: Number(e.target.value) },
                  }))
                }
                value={newQPart.partId}
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
              <label htmlFor="par">Color</label>
              <select
                name="par"
                id="par"
                className="w-50 formInput"
                onChange={(e) =>
                  setNewQPart((newQPart) => ({
                    ...newQPart,
                    ...{ colorId: Number(e.target.value) },
                  }))
                }
                value={newQPart.colorId}
              >
                <option value="-1">--</option>
                {colData?.data.map((col) => (
                  <option
                    key={col.id}
                    className="even-nums"
                    value={`${col.id}`}
                  >
                    {col.tlg_id
                      ? col.tlg_id
                          .toString()
                          .padStart(4, String.fromCharCode(160)) +
                        String.fromCharCode(160)
                      : "".padEnd(5, String.fromCharCode(160))}
                    | {col.bl_name ? col.bl_name : col.tlg_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="eid">Element ID</label>
              <input
                id="eid"
                className="formInput w-50"
                placeholder="Optional"
                onChange={(e) =>
                  setNewQPart((newQPart) => ({
                    ...newQPart,
                    ...{ elementId: e.target.value },
                  }))
                }
                value={newQPart.elementId}
              />
            </div>
            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="seid">Secondary Element ID</label>
              <input
                id="seid"
                className="formInput w-50"
                placeholder="Optional"
                onChange={(e) =>
                  setNewQPart((newQPart) => ({
                    ...newQPart,
                    ...{ secondaryElementId: e.target.value },
                  }))
                }
                value={newQPart.secondaryElementId}
              />
            </div>

            <label htmlFor="partnote" style={{ marginRight: "auto" }}>
              Note for qelement
            </label>
            <div className="w-100 d-flex">
              <textarea
                id="partnote"
                className="fg-1 formInput"
                rows={5}
                placeholder="Optional"
                onChange={(e) =>
                  setNewQPart((newQPart) => ({
                    ...newQPart,
                    ...{ note: e.target.value },
                  }))
                }
                value={newQPart.note}
              />
            </div>

            <h3>Status</h3>
            <div className="w-100 d-flex jc-space-b">
              <div>
                <label htmlFor="seid">Status</label>
                <MyToolTip
                  content={
                    <ul className="tt-list">
                      <li>
                        <span>found:</span> you or another collecter has
                        collected this element
                      </li>
                      <li>
                        <span>seen:</span> this element has been seen, but no
                        one has collected one
                      </li>
                      <li>
                        <span>nightshift:</span> produced by rogue LEGO Factory
                        employees
                      </li>
                      <li>
                        <span>prototype:</span> a developmental prototype
                      </li>
                      <li>
                        <span>employee:</span> an element made as an employee
                        gift
                      </li>
                      <li>
                        <span>known:</span> This element has been released in a
                        set or Pick a Brick
                      </li>
                      <li>
                        <span>unknown:</span> this element may exist, it might
                        have an element ID, but it has never been seen
                      </li>
                      <li>
                        <span>other:</span> doesn't fit the other categories
                      </li>
                    </ul>
                  }
                  id="status"
                />
              </div>
              <select
                className="formInput w-50"
                onChange={(e) =>
                  setNewStatus((newStatus) => ({
                    ...newStatus,
                    ...{ status: e.target.value },
                  }))
                }
                value={newStatus.status}
              >
                <option value={"unknown"}>unknown</option>
                <option value={"found"}>found</option>
                <option value={"seen"}>seen</option>
                <option value={"nightshift"}>nightshift</option>
                <option value={"prototype"}>prototype</option>
                <option value={"employee"}>employee</option>
                <option value={"known"}>known</option>
                <option value={"other"}>other</option>
              </select>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <div>
                <label htmlFor="location">Location</label>
                <MyToolTip
                  content={
                    <ul className="tt-list">
                      Location that this element is known to exist, examples:
                      <li>LEGOLAND Discovery Center, New York, USA</li>
                      <li>LEGOLAND, Florida, USA, Pick-a-Brick Wall</li>
                      <li>Germany</li>
                      <li>Europe</li>
                      If found in more than one loaction, list addition in the
                      Note
                    </ul>
                  }
                  id="location"
                />
              </div>
              <input
                id="location"
                className="formInput w-50"
                placeholder="Optional"
                onChange={(e) =>
                  setNewStatus((newStatus) => ({
                    ...newStatus,
                    ...{ location: e.target.value },
                  }))
                }
                value={newStatus.location}
              />
            </div>
            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="date">Date</label>
              <div className="w-50">
                <DatePicker
                  className="w-100 formInput"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                />
              </div>
            </div>
            <label htmlFor="satusnote" style={{ marginRight: "auto" }}>
              Note for Status
            </label>
            <div className="w-100 d-flex">
              <textarea
                id="satusnote"
                className="fg-1 formInput"
                rows={5}
                placeholder="Optional"
                onChange={(e) =>
                  setNewStatus((newStatus) => ({
                    ...newStatus,
                    ...{ note: e.target.value },
                  }))
                }
                value={newStatus.note}
              />
            </div>
            <div>
              <button
                className="formInputNM"
                onClick={() => {
                  // {
                  //   partId: -1,
                  //   colorId: -1,
                  //   elementId: "",
                  //   secondaryElementId: "",
                  //   creatorId: -1,
                  //   note: "",
                  // }
                  if (newQPart.partId != -1 && newQPart.colorId != -1) {
                    console.log("adding...");
                    partMutation.mutate(newQPart);
                    setNewQPart(defaultValues);
                  } else {
                    showToast(
                      "Please make sure you have filled out the form properly",
                      Mode.Error
                    );
                  }
                }}
              >
                Add QElement
              </button>
            </div>
            <div className="w-100 d-flex flex-col flex-center">
              <div className="fake-hr-form"></div>
              <div style={{ marginBottom: "1em" }}>
                can't find the category or part? add it here:
              </div>
              <Link to={"/add/part"}>Add Parts</Link>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <p>Loading...</p>;
  }
}
