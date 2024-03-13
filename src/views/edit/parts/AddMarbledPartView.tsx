import axios from "axios";
import { CSSProperties, useContext, useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import {
  part,
  IAPIResponse,
  ICategory,
  IPartMoldDTO,
  color,
  IColorWithPercent,
  IMarbledPartDTO,
} from "../../../interfaces/general";
import showToast, { Mode } from "../../../utils/utils";
import MyToolTip from "../../../components/MyToolTip";
import { AppContext } from "../../../context/context";
import { Link } from "react-router-dom";
import ColorTextField from "../../../components/ColorTextField";
import ColorForMarbledPart from "../../../components/ColorForMarbledPart";
import ImageUploader from "../../../components/ImageUploader";

export default function AddMarbledPartView() {
  const {
    state: {
      jwt: { token, payload },
    },
  } = useContext(AppContext);

  const defaultValues: IMarbledPartDTO = {
    moldId: -1,
    isMoldUnknown: false,
    note: "",
    colors: [],
  };

  const [resetColorComponent, setResetColorComponent] = useState(false);
  const [newMarbledPart, setNewMarbledPart] =
    useState<IMarbledPartDTO>(defaultValues);
  const [category, setCategory] = useState<number>(-1);
  const [molds, setMolds] = useState<IPartMoldDTO[]>();
  const [selectedPartId, setSelectedPartId] = useState<number>(-1);
  const [colors, setColors] = useState<IColorWithPercent[]>([]);
  const [selectedColor, setSelectedColor] = useState<color | null>(null);

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

  useEffect(() => {
    partsRefetch();
    setNewMarbledPart((newMarbledPart) => ({
      ...newMarbledPart,
      ...{ moldId: -1 },
    }));
    setSelectedPartId(-1);
  }, [category, partsRefetch]);

  useEffect(() => {
    if (colors.length > 0) {
      const convertedColors = colors.map((colorObj) => ({
        id: colorObj.color.id,
        number: colorObj.percent || -1,
      }));
      setNewMarbledPart((newMarbledPart) => ({
        ...newMarbledPart,
        ...{ colors: convertedColors },
      }));
    } else {
      setNewMarbledPart((newMarbledPart) => ({
        ...newMarbledPart,
        ...{ colors: [] },
      }));
    }
  }, [colors]);

  useEffect(() => {
    if (partsData) {
      const thesemolds = partsData.data.find((x) => x.id == selectedPartId);
      if (thesemolds) setMolds(thesemolds.molds);
      setNewMarbledPart((newMarbledPart) => ({
        ...newMarbledPart,
        ...{ moldId: -1 },
      }));
    }
  }, [selectedPartId, partsData]);

  const { data: catData } = useQuery("todos", () =>
    axios.get<ICategory[]>("http://localhost:3000/categories")
  );

  const marbleMutation = useMutation({
    mutationFn: (part: IMarbledPartDTO) =>
      axios.post<IAPIResponse>(`http://localhost:3000/marbledPart/add`, part, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (data) => {
      console.log(data);

      if ((data.data?.code == 200 || data.data?.code == 201) && payload) {
        if (data.data.code == 201) {
          showToast("Marbled part added!", Mode.Success);
          setNewMarbledPart(defaultValues);
        } else {
          showToast(
            "Marbled part submitted, please make sure to add an image on the My Submissions page!",
            Mode.Success
          );
          setNewMarbledPart(defaultValues);
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
    const percent = colors.reduce(
      (total, colorObj) => total + (colorObj.percent || 0),
      0
    );
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
                onChange={(e) => setSelectedPartId(Number(e.target.value))}
                value={selectedPartId}
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
                disabled={selectedPartId <= 0}
                name="partmold"
                id="partmold"
                className="w-50 formInput"
                style={{ marginBottom: "1em" }}
                onChange={(e) =>
                  setNewMarbledPart((newMarbledPart) => ({
                    ...newMarbledPart,
                    ...{ moldId: Number(e.target.value) },
                  }))
                }
                value={newMarbledPart.moldId}
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
                checked={newMarbledPart.isMoldUnknown}
                onChange={(e) => {
                  setNewMarbledPart((newMarbledPart) => ({
                    ...newMarbledPart,
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
                    if (
                      selectedColor &&
                      !colors.find((x) => x.color == selectedColor)
                    ) {
                      setColors((prevColors) => [
                        ...prevColors,
                        { color: selectedColor, percent: null },
                      ]);
                      handleResetComponent();
                      setSelectedColor(null);
                    } else if (selectedColor == null) {
                      showToast("Please select a color first!", Mode.Warning);
                    } else if (colors.find((x) => x.color == selectedColor)) {
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
              <label>
                Colors to add:{" "}
                <MyToolTip
                  id="marbleColorPercent"
                  content={
                    <div style={{ maxWidth: "15em" }}>
                      The percent field is optional, it is used to mark how much
                      of each color is present in the marbling. If you had a
                      part that was mostly white with a bit of blue and a very
                      small streak of red, you could do
                      <ul style={{ margin: "1em" }}>
                        <li>White: 85</li>
                        <li>Blue: 10</li>
                        <li>Red: 5</li>
                      </ul>
                      Use only whole numbers, you don't need to include
                      percentage signs (%), If you do opt to include percentage
                      numbers, they must add up to 100
                    </div>
                  }
                />
              </label>
              <div
                className="d-flex flex-col"
                style={{ marginBottom: "1.5em" }}
              >
                {colors.length > 0 ? (
                  colors.map((colorObj, index) => (
                    <ColorForMarbledPart
                      key={index}
                      colorObj={colorObj}
                      onChange={(color, percent) => {
                        const updatedColors = [...colors];
                        const index = updatedColors.findIndex(
                          (c) => c.color === color
                        );
                        if (index !== -1) {
                          updatedColors[index].percent = percent;
                          setColors(updatedColors);
                        }
                      }}
                    />
                  ))
                ) : (
                  <div className="grey-txt">No colors added</div>
                )}
                {colors.length > 0 && !!percent && (
                  <div className="d-flex jc-space-b w-100">
                    <div>Total Percent:</div>
                    <div style={{ width: "3.3em" }}>{percent}%</div>
                  </div>
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
                  setNewMarbledPart((newMarbledPart) => ({
                    ...newMarbledPart,
                    ...{ note: e.target.value },
                  }))
                }
                value={newMarbledPart.note}
              />
            </div>
            <div
              className="grey-txt"
              style={{ fontSize: "0.9em", marginTop: "1em" }}
            >
              After adding this part, you must add a picture, or your request
              will be denied.
            </div>
            <div className="grey-txt" style={{ fontSize: "0.9em" }}>
              You can submit images through the{" "}
              <Link to={"/profile/submissions"} className="link">
                My Submissions
              </Link>{" "}
              page.
            </div>
            <div>
              <button
                className="formInputNM"
                style={{ marginTop: "1em" }}
                onClick={() => {
                  if (selectedPartId === -1) {
                    showToast("Please select a part first!", Mode.Error);
                    return;
                  }
                  if (newMarbledPart.moldId === -1) {
                    showToast("Please select a mold first!", Mode.Error);
                    return;
                  }
                  if (colors.length <= 1) {
                    showToast("Please add at least two colors!", Mode.Error);
                    return;
                  }
                  if (!validatePercentages()) {
                    showToast(
                      "Please check color percentages. They should either all be blank or add up to 100!",
                      Mode.Error
                    );
                    return;
                  }
                  marbleMutation.mutate(newMarbledPart);
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
  function validatePercentages(): boolean {
    let percentTotal = 0;
    let containsNulls = false;

    colors.forEach((colorObj) => {
      if (colorObj.percent == null) {
        containsNulls = true;
        return;
      } else {
        percentTotal += colorObj.percent;
      }
    });

    if (containsNulls && percentTotal === 0) {
      return true;
    }
    if (!containsNulls && percentTotal === 100) {
      return true;
    }

    return false;
  }
}
