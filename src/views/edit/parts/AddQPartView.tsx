import axios from "axios";
import { CSSProperties, useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMutation, useQuery } from "react-query";
import { Link } from "react-router-dom";
import MyToolTip from "../../../components/MyToolTip";
import {
  IAPIResponse,
  ICategory,
  IElementIDCreationDTO,
  IPartMoldDTO,
  IPartStatusDTO,
  IQPartVerifcation,
  color,
  iQPartDTO,
  part,
} from "../../../interfaces/general";
import { AppContext } from "../../../context/context";
import showToast, { Mode, testStatus } from "../../../utils/utils";
import ColorTextField from "../../../components/ColorTextField";

export default function AddQPartView() {
  const {
    state: {
      jwt: { token, payload },
      // userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const defaultValues: iQPartDTO = {
    partId: -1,
    colorId: -1,
    moldId: -1,
    isMoldUnknown: false,
    type: "unknown",
    material: "",
    creatorId: -1,
    note: "",
  };
  const defaultStatusValues: IPartStatusDTO = {
    id: -1,
    status: "",
    date: "",
    location: "",
    note: "",
    creatorId: -1,
    qpartId: -1,
    approvalDate: "",
    createdAt: "",
  };
  const [hasPC, setHasPC] = useState(false);
  const [hasMABS, setHasMABS] = useState(false);
  const [hasPP, setHasPP] = useState(false);
  const [hasOther, setHasOther] = useState(false);
  const [selectedColor, setSelectedColor] = useState<color | null>(null);
  const [resetColorComponent, setResetColorComponent] = useState(false);
  const [elementId, setElementId] = useState<number>(-1);
  const [newQPart, setNewQPart] = useState<iQPartDTO>(defaultValues);
  const [newStatus, setNewStatus] =
    useState<IPartStatusDTO>(defaultStatusValues);
  const [category, setCategory] = useState<number>(-1);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [molds, setMolds] = useState<IPartMoldDTO[]>();

  const [qpartExistenceCode, setQpartExistenceCode] = useState<number>(-1);

  const { data: colData } = useQuery("allColors", () =>
    axios.get<color[]>("http://localhost:3000/color")
  );

  const { data: partsData, refetch: partsRefetch } = useQuery({
    queryKey: `partsWithCat${category}`,
    queryFn: () =>
      axios.get<part[]>(`http://localhost:3000/parts/byCatId/${category}`),
    enabled: category != -1,
  });

  const handleResetComponent = () => {
    setResetColorComponent(true);
    setTimeout(() => {
      setResetColorComponent(false);
    }, 0);
  };

  const { refetch: matchRefetch } = useQuery({
    queryKey: `match-p${newQPart.partId}-m${newQPart.moldId}-c${newQPart.colorId}`,
    queryFn: () =>
      axios.get<IAPIResponse>(`http://localhost:3000/qpart/checkIfExists`, {
        params: {
          moldId: newQPart.moldId,
          colorId: newQPart.colorId,
        } as IQPartVerifcation,
      }),
    onSuccess: (resp) => {
      const code = resp.data.code;
      setQpartExistenceCode(code);
      if (code == 200) {
        showToast(
          `QPart does not exist in database yet, you're good to go!`,
          Mode.Success
        );
      } else if (code == 201) {
        showToast(
          `QPart already exists. It may be pending approval.`,
          Mode.Warning
        );
      } else if (code == 500) {
        showToast(`Error checking part`, Mode.Error);
      }
    },
    enabled: false,
  });

  useEffect(() => {
    let matString: string[] = [];

    if (hasPC) matString.push("pc");
    if (hasMABS) matString.push("mabs");
    if (hasPP) matString.push("pp");
    if (hasOther) matString.push("other");

    setNewQPart((newQPart) => ({
      ...newQPart,
      ...{ material: matString.length > 0 ? matString.join(";") : "" },
    }));
  }, [hasPC, hasMABS, hasPP, hasOther]);

  useEffect(() => {
    setNewQPart((newQPart) => ({
      ...newQPart,
      ...{ colorId: selectedColor ? selectedColor.id : -1 },
    }));
    setHasMABS(false);
    setHasPC(false);
    setHasPP(false);
    setHasOther(false);
  }, [selectedColor]);

  useEffect(() => {
    partsRefetch();
    setNewQPart((newQPart) => ({
      ...newQPart,
      ...{ partId: -1, moldId: -1 },
    }));
  }, [category, partsRefetch]);

  useEffect(() => {
    setNewQPart((newQPart) => ({
      ...newQPart,
      ...{ creatorId: payload.id },
    }));
  }, [payload]);

  useEffect(() => {
    if (newQPart.moldId != -1 && newQPart.colorId != -1) {
      matchRefetch();
    }
  }, [newQPart.moldId, newQPart.colorId, matchRefetch]);

  useEffect(() => {
    if (partsData) {
      const thesemolds = partsData.data.find((x) => x.id == newQPart.partId);
      if (thesemolds) setMolds(thesemolds.molds);
    }
  }, [newQPart.partId, partsData]);

  const { data: catData } = useQuery("todos", () =>
    axios.get<ICategory[]>("http://localhost:3000/categories")
  );

  const partMutation = useMutation({
    mutationFn: (qpart: iQPartDTO) =>
      axios.post<IAPIResponse>(`http://localhost:3000/qpart/add`, qpart, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (data) => {
      console.log(data);

      if ((data.data?.code == 200 || data.data?.code == 201) && payload) {
        if (testStatus(newStatus.status)) {
          partStatusMutation.mutate({
            id: -1,
            status: newStatus.status,
            date: startDate.toDateString(),
            location: newStatus.location,
            note: newStatus.note,
            qpartId: Number(data.data.message),
            creatorId: payload.id,
            approvalDate: "",
            createdAt: "",
          });
        } else {
          if (data.data.code == 201) {
            showToast("QElement added!", Mode.Success);
          } else {
            showToast("QElement submitted for approval!", Mode.Success);
          }
        }
        handleResetComponent();

        if (elementId && elementId > 999 && elementId < 999999999) {
          elementIDMutation.mutate({
            number: elementId,
            creatorId: payload.id,
            qpartId: Number(data.data.message),
          });
        }
      }
    },
  });

  const partStatusMutation = useMutation({
    mutationFn: (status: IPartStatusDTO) =>
      axios.post<IPartStatusDTO>(
        `http://localhost:3000/partStatus/add`,
        status,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onSuccess: () => {
      console.log("listen", partMutation.isSuccess, partMutation.data);
      if (partMutation.data?.data.code == 201) {
        showToast("QElement added!", Mode.Success);
        // setWasApproved(false);
      } else {
        showToast("QElement submitted for approval!", Mode.Success);
      }
      setNewStatus(defaultStatusValues);
      setStartDate(new Date());
    },
  });

  const elementIDMutation = useMutation({
    mutationFn: (eIdData: IElementIDCreationDTO) =>
      axios.post<IAPIResponse>(`http://localhost:3000/elementID/add`, eIdData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: () => {
      // showToast("Element ID submitted for approval!", Mode.Success);
      setElementId(-1);
    },
  });
  const colorInputSyles: CSSProperties = {
    width: "50%",
    marginBottom: "1.75em",
  };
  const checkboxStyles: CSSProperties = {
    transform: "scale(1.5)", // Adjust the scale factor as needed
    marginRight: "8px", // Add some spacing if desired
  };
  if (catData && colData) {
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
                disabled={category <= 0}
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
              <label htmlFor="par">Part Number</label>
              <select
                disabled={newQPart.partId <= 0}
                name="partmold"
                id="partmold"
                className="w-50 formInput"
                style={{ marginBottom: "1em" }}
                onChange={(e) =>
                  setNewQPart((newQPart) => ({
                    ...newQPart,
                    ...{ moldId: Number(e.target.value) },
                  }))
                }
                value={newQPart.moldId}
              >
                <option value="-1">--</option>
                {molds?.map((mold) => (
                  <option key={mold.id} value={`${mold.id}`}>
                    {mold.number}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="par">
                Is Part Number Unknown?{" "}
                <MyToolTip
                  content={
                    <div style={{ maxWidth: "20em" }}>
                      For Part Number, please pick your best guess if clicking
                      this checkbox. The selected Part Number will be used as a
                      fallback.
                    </div>
                  }
                  id="pnunk"
                />
              </label>
              <input
                type="checkbox"
                className="formInput"
                style={checkboxStyles}
                checked={newQPart.isMoldUnknown}
                onChange={(e) => {
                  setNewQPart((newQPart) => ({
                    ...newQPart,
                    ...{ isMoldUnknown: e.target.checked },
                  }));
                }}
              ></input>
            </div>

            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="par">Color</label>
              <ColorTextField
                setterObj={setSelectedColor}
                customStyles={colorInputSyles}
                reset={resetColorComponent}
              />
            </div>
            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="eid">
                Element ID
                <MyToolTip
                  content={
                    <div style={{ maxWidth: "20em" }}>
                      Please only add one element ID for now, you can add more
                      once the q-element is approved.
                    </div>
                  }
                  id="eId"
                />
              </label>

              <input
                maxLength={10}
                type="number"
                id="eid"
                className="formInput w-50"
                placeholder="Optional"
                onChange={(e) => {
                  if (Number(e.target.value) == 0) {
                    setElementId(-1);
                  } else setElementId(Number(e.target.value));
                }}
                value={elementId == -1 || elementId == 0 ? "" : elementId}
              />
            </div>
            <div className="w-100 d-flex jc-space-b">
              <div>
                <label htmlFor="qtype">Type</label>
                <MyToolTip
                  content={
                    <ul className="tt-list">
                      <li>
                        <span>unknown:</span> this element may exist, but not
                        much is known
                      </li>
                      <li>
                        <span>Q-Element:</span> internal parts used mainly by
                        model builders for scupltures and models
                      </li>
                      <li>
                        <span>prototype:</span> a developmental prototype
                      </li>
                      <li>
                        <span>test part:</span> a test part, see about page for
                        more info
                      </li>
                      <li>
                        <span>employee gift:</span> an element made as an
                        employee gift
                      </li>
                      <li>
                        <span>nightshift:</span> produced by rogue LEGO Factory
                        employees
                      </li>
                      <li>
                        <span>other:</span> doesn't fit the other categories,
                        please leave a note if using this option
                      </li>
                    </ul>
                  }
                  id="type"
                />
              </div>
              <select
                className="formInput w-50"
                id="qtype"
                onChange={(e) =>
                  setNewQPart((newQPart) => ({
                    ...newQPart,
                    ...{ type: e.target.value },
                  }))
                }
                value={newQPart.type}
              >
                <option value={"unknown"}>Unknown</option>
                <option value={"qelement"}>Q-Element</option>
                <option value={"prototype"}>Prototype</option>
                <option value={"test"}>Test part</option>
                <option value={"employee"}>Employee Gift</option>
                <option value={"nightshift"}>Nightshift</option>
                <option value={"other"}>Other</option>
              </select>
            </div>
            {selectedColor &&
              (selectedColor.type == "transparent" ||
                selectedColor.type == "glitter" ||
                selectedColor.type == "unreleased") && (
                <div className="w-100">
                  <div className="w-100 d-flex jc-space-b">
                    <div className="w-30">
                      <label htmlFor="qmat">Materials</label>
                      <MyToolTip
                        content={
                          <div style={{ maxWidth: "22em" }}>
                            This is where you can specify if the QPart is
                            available in Polycarbonate (PC), Methylmethacrylate
                            acrylonitrile butadiene styrene (MABS), the less
                            common Polypropylene (PP), or if the part has had
                            multiple iterations available in different
                            materials, an example of this would be the 2x2 tile,
                            since it was used on internal LEGO Designer color
                            palettes, some colors of this part, like
                            Trans-Orange, are available in PC, MABS, and PP! For
                            transparent parts, MABS replaced PC around 2019.{" "}
                            <span
                              style={{
                                fontWeight: "800",
                                textDecoration: "underline",
                              }}
                            >
                              If you are unsure, just leave blank.
                            </span>{" "}
                            Read more about materials by visiting our resources
                            page: /tools/resources
                          </div>
                        }
                        id="material"
                      />
                    </div>
                    <div className="d-flex fg-1 jc-end">
                      <div className="w-50">
                        <input
                          type="checkbox"
                          className="formInput"
                          style={checkboxStyles}
                          checked={hasMABS}
                          onChange={(e) => {
                            setHasMABS(e.target.checked);
                          }}
                        ></input>{" "}
                        <label>MABS</label>
                      </div>
                      <div className="w-50">
                        <input
                          type="checkbox"
                          className="formInput"
                          style={checkboxStyles}
                          checked={hasPC}
                          onChange={(e) => {
                            setHasPC(e.target.checked);
                          }}
                        ></input>{" "}
                        <label>Polycarbonate (PC)</label>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex jc-end w-100">
                    <div className="w-35">
                      <input
                        type="checkbox"
                        className="formInput"
                        style={checkboxStyles}
                        checked={hasOther}
                        onChange={(e) => {
                          setHasOther(e.target.checked);
                        }}
                      ></input>{" "}
                      <label>Other</label>
                    </div>
                    <div className="w-35">
                      <input
                        type="checkbox"
                        className="formInput"
                        style={checkboxStyles}
                        checked={hasPP}
                        onChange={(e) => {
                          setHasPP(e.target.checked);
                        }}
                      ></input>{" "}
                      <label>Polypropylene (PP)</label>
                    </div>
                  </div>
                </div>
              )}

            <label htmlFor="partnote" style={{ marginRight: "auto" }}>
              Note for qelement
            </label>
            <div className="w-100 d-flex">
              <textarea
                maxLength={255}
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
                        <span>unknown:</span> this element may exist, but not
                        much is known
                      </li>
                      <li>
                        <span>element ID only:</span> we have an element ID for
                        this part, but it has yet to be seen/found
                      </li>
                      <li>
                        <span>seen:</span> this element has been seen, but no
                        one has collected one
                      </li>
                      <li>
                        <span>found:</span> you or another collecter has
                        collected this element
                      </li>
                      <li>
                        <span>known:</span> This element has been released in a
                        set or Pick a Brick
                      </li>
                      <li>
                        <span>other:</span> doesn't fit the other categories,
                        please leave a note if using this option
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
                <option value={""}>--</option>
                <option value={"unknown"}>Unknown</option>
                <option value={"idOnly"}>Element ID Only</option>
                <option value={"seen"}>Seen</option>
                <option value={"found"}>Found</option>
                <option value={"known"}>Known/Released</option>
                <option value={"other"}>Other</option>
              </select>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <div>
                <label htmlFor="location">Location</label>
                <MyToolTip
                  content={
                    <ul className="tt-list">
                      Location that this element was seen, or is known to exist,
                      examples:
                      <li>LEGOLAND Discovery Center, New York, USA</li>
                      <li>LEGOLAND, Florida, USA, Pick-a-Brick Wall</li>
                      <li>Germany</li>
                      <li>Europe</li>
                      If found in more than one loaction, list additional in the
                      Note
                    </ul>
                  }
                  id="location"
                />
              </div>
              <input
                disabled={newStatus.status == ""}
                maxLength={100}
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
                  disabled={newStatus.status == ""}
                  className="w-100 formInput"
                  selected={startDate}
                  onChange={(date) => {
                    if (date != null) setStartDate(date);
                  }}
                />
              </div>
            </div>
            <label htmlFor="satusnote" style={{ marginRight: "auto" }}>
              Note for Status
            </label>
            <div className="w-100 d-flex">
              <textarea
                disabled={newStatus.status == ""}
                maxLength={255}
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
                  if (
                    newQPart.partId != -1 &&
                    newQPart.colorId != -1 &&
                    qpartExistenceCode == 200 &&
                    newQPart.creatorId != -1 &&
                    newQPart.moldId != -1
                  ) {
                    console.log("adding...");
                    partMutation.mutate(newQPart);

                    setNewQPart((prevVals) => ({
                      ...defaultValues,
                      ...{ creatorId: prevVals.creatorId },
                    }));

                    setSelectedColor(null);
                  } else {
                    if (qpartExistenceCode == 201) {
                      showToast(
                        "This part already exists in the database, it may be pending approval",
                        Mode.Warning
                      );
                    } else if (newQPart.creatorId == -1) {
                      showToast("User ID Error!", Mode.Error);
                    } else {
                      console.log(qpartExistenceCode);

                      showToast(
                        "Please make sure you have filled out the form properly",
                        Mode.Error
                      );
                    }
                  }
                }}
              >
                Add QElement
              </button>
            </div>
            <div className="w-100 d-flex flex-col flex-center">
              <div className="fake-hr-form"></div>
              <div style={{ marginBottom: "1em" }}>
                Can't find the category or part? Add it here:
              </div>
              <Link className="link" to={"/add/part"}>
                Add Parts
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <p>Loading...</p>;
  }
}
