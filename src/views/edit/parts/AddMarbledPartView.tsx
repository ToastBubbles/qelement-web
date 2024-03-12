import axios from "axios";
import { CSSProperties, useContext, useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import {
  part,
  IPartWithMoldDTO,
  IAPIResponse,
  ICategoryWParts,
  ICategory,
  IElementIDCreationDTO,
  IPartMoldDTO,
  IPartStatusDTO,
  IQPartVerifcation,
  color,
  iQPartDTO,
} from "../../../interfaces/general";
import showToast, { Mode, testStatus } from "../../../utils/utils";
import MyToolTip from "../../../components/MyToolTip";
import { AppContext } from "../../../context/context";
import { Link } from "react-router-dom";
import ColorTextField from "../../../components/ColorTextField";
import ColorLink from "../../../components/ColorLink";

export default function AddMarbledPartView() {
  const {
    state: {
      jwt: { token, payload },
    },
  } = useContext(AppContext);

  const defaultValues: iQPartDTO = {
    partId: -1,
    colorId: -1,
    moldId: -1,
    isMoldUnknown: false,
    type: "unknown",
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
  const [resetColorComponent, setResetColorComponent] = useState(false);
  const [newQPart, setNewQPart] = useState<iQPartDTO>(defaultValues);
  const [category, setCategory] = useState<number>(-1);
  const [molds, setMolds] = useState<IPartMoldDTO[]>();
  const [colors, setColors] = useState<color[]>([]);
  const [selectedColor, setSelectedColor] = useState<color | null>(null);
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
        if (data.data.code == 201) {
          showToast("QElement added!", Mode.Success);
        } else {
          showToast("QElement submitted for approval!", Mode.Success);
        }

        handleResetComponent();
      }
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
          <h1>add new marbled part</h1>
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
              <div className="d-flex jc-end ai-start w-100">
                <ColorTextField
                  setterObj={setSelectedColor}
                  customStyles={colorInputSyles}
                  reset={resetColorComponent}
                />
                <button
                  style={{ height: "24px" }}
                  onClick={() => {
                    if (selectedColor && !colors.includes(selectedColor)) {
                      setColors((prevColors) => [...prevColors, selectedColor]);
                      handleResetComponent();
                    } else if (selectedColor == null) {
                      showToast("Please select a color first!", Mode.Warning);
                    } else if (colors.includes(selectedColor)) {
                      showToast(
                        "This color has already been added!",
                        Mode.Warning
                      );
                    }
                  }}
                >
                  Add
                </button>
              </div>
            </div>
            <div className="w-100 d-flex flex-col">
              <label>Colors to add:</label>
              <div className="d-flex" style={{ marginBottom: "1.5em" }}>
                {colors.length > 0 ? (
                  colors.map((color) => <ColorLink color={color} />)
                ) : (
                  <div className="grey-txt">No colors added</div>
                )}
              </div>
            </div>

            <label htmlFor="partnote" style={{ marginRight: "auto" }}>
              Note
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

            <div>
              <button
                className="formInputNM"
                style={{ marginTop: "1.5em" }}
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
                Add Marbled Part
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
