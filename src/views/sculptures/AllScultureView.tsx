import axios from "axios";
import { useQuery } from "react-query";
import { ISculptureDTO, color } from "../../interfaces/general";
import { Link } from "react-router-dom";
import RecentSculpture from "../../components/RecentSculpture";
import { useState } from "react";
import ColorTextField from "../../components/ColorTextField";
import { Checkbox } from "@mui/material";

enum sortOptions {
  az = "az",
  za = "za",
  lowHigh = "lowHigh",
  highLow = "highLow",
}
enum filterOptions {
  all = "all",
  system = "system",
  duplo = "duplo",
  hybrid = "hybrid",
  technic = "technic",
  other = "other",
}

export default function AllSculptureView() {
  const [sortKey, setSortKey] = useState<sortOptions>(sortOptions.az);

  const [filterKey, setFilterKey] = useState<filterOptions>(filterOptions.all);
  const [filterColor, setFilterColor] = useState<number>(-1);
  const [filterEmptyInventory, setFilterEmptyInventory] =
    useState<boolean>(false);
  const { data: sculptData } = useQuery("allSculpts", () =>
    axios.get<ISculptureDTO[]>("http://localhost:3000/sculpture")
  );

  // useEffect(() => {}, [filterColor]);
  if (sculptData) {
    let sculptures = filterSculpts(sculptData.data);

    // if (filterColor > -1) {
    //   sculptures = sculptures.filter((x) => {
    //     let out = false;
    //     x.inventory.forEach((qpart) => {
    //       if (qpart.color.id == filterColor) out = true;
    //     });
    //     return out;
    //   });
    // }
    // if (filterEmptyInventory) {
    //   sculptures = sculptures.filter((x) => x.inventory.length > 0);
    // }
    // if (sculptures.length > 0) {
    //   console.log(sculptures);

    return (
      <>
        <div className="mx-w">
          <h1>All Sculptures</h1>
          <fieldset
            className="d-flex fs-border"
            style={{ marginBottom: "1em" }}
          >
            <legend>Sort & Filter</legend>
            <div className="w-50">
              <div className="d-flex">
                <div style={{ marginRight: "auto" }}>Direction:</div>
                <select
                  className="formInput w-33"
                  style={{ marginRight: "35%" }}
                  onChange={(e) => setSortKey(e.target.value as sortOptions)}
                  value={sortKey}
                >
                  <option value={sortOptions.az}>Name: A-Z</option>
                  <option value={sortOptions.za}>Name: Z-A</option>
                  <option value={sortOptions.lowHigh}>
                    Part Count: Low to High
                  </option>
                  <option value={sortOptions.highLow}>
                    Part Count: High to Low
                  </option>
                </select>
              </div>
              <div className="d-flex">
                <div style={{ marginRight: "auto" }}>Type of bricks:</div>
                <select
                  className="formInput w-33"
                  style={{ marginRight: "35%" }}
                  onChange={(e) =>
                    setFilterKey(e.target.value as filterOptions)
                  }
                  value={filterKey}
                >
                  <option value={filterOptions.all}>All</option>
                  <option value={filterOptions.system}>System</option>
                  <option value={filterOptions.duplo}>DULPO</option>
                  <option value={filterOptions.hybrid}>Hybrid</option>
                  <option value={filterOptions.technic}>Technic</option>
                  <option value={filterOptions.other}>Other</option>
                </select>
              </div>
            </div>
            <div className="w-50">
              <div className="d-flex">
                <div style={{ marginRight: "1em" }}>Must include color: </div>
                <div className="fg-1">
                  <ColorTextField setter={setFilterColor} />
                </div>
              </div>
              <div>
                Must have at least one part:{" "}
                <Checkbox
                  checked={filterEmptyInventory}
                  // disabled={checkedForDeletion}
                  onChange={(e) => setFilterEmptyInventory(e.target.checked)}
                  disableRipple
                  color="info"
                />
              </div>
            </div>
          </fieldset>

          <div className="rib-container2">
            {sculptures.length > 0 ? (
              sortSculpts(sculptures).map((sculpt) => (
                <RecentSculpture sculpture={sculpt} key={sculpt.id} />
              ))
            ) : (
              <>No Sculptures Found</>
            )}
          </div>
        </div>
      </>
    );
    // }
    // else {
    //   return (
    //     <>
    //       <div className="mx-w">
    //         <h1>All Sculptures</h1>
    //         <div className="parts-view">No Sculptures found!</div>
    //       </div>
    //     </>
    //   );
    // }
  } else {
    return <p>loading</p>;
  }

  function sortSculpts(arr: ISculptureDTO[]): ISculptureDTO[] {
    if (sortKey == sortOptions.za)
      return arr.sort(function (a, b) {
        if (a.name > b.name) {
          return -1;
        }
        if (a.name < b.name) {
          return 1;
        }
        return 0;
      });
    else if (sortKey == sortOptions.lowHigh)
      return arr.sort((a, b) => a.inventory.length - b.inventory.length);
    else if (sortKey == sortOptions.highLow)
      return arr.sort((a, b) => b.inventory.length - a.inventory.length);
    else
      return arr.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
  }

  function filterSculpts(arr: ISculptureDTO[]): ISculptureDTO[] {
    let output = arr;

    if (filterKey != filterOptions.all) {
      output = output.filter((x) => x.brickSystem == filterKey);
    }
    if (filterColor > -1) {
      output = output.filter((x) => {
        let out = false;
        x.inventory.forEach((qpart) => {
          if (qpart.color.id == filterColor) out = true;
        });
        return out;
      });
    }
    if (filterEmptyInventory) {
      output = output.filter((x) => x.inventory.length > 0);
    }
    return output;
  }
}
