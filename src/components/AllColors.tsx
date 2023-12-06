import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { color } from "../interfaces/general";
import { Link } from "react-router-dom";
import { getTextColor, validateSearch } from "../utils/utils";
// import { similarColor } from "@/pages/colors/[colorId]";

export interface ITableOptions {
  hideQID: boolean;
  hideBrickOwl: boolean;
  showSwatchId: boolean;
  //   search: string;
}

function AllColors() {
  const [search, setSearchQuery] = useState<string>("");
  const [sortKey, setSortKey] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [tableOptions, setTableOptions] = useState<ITableOptions>({
    hideQID: false,
    hideBrickOwl: false,
    showSwatchId: false,
    // search,
  });

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };
  function compareNumericWithNull(a: number | null, b: number | null): number {
    if (a === null || b === null) {
      if (a === b) return 0;
      if (a === null) return 1; // Move nulls to the end
      if (b === null) return -1; // Move nulls to the end
    } else {
      return a - b; // Compare non-null values as usual
    }
    return 0;
  }

  const { data, isFetched } = useQuery("allColors", () =>
    axios.get<color[]>("http://localhost:3000/color")
  );

  if (isFetched && data) {
    const cdata = data.data;
    return (
      <div className="color-table-container">
        <input
          id="searchbar"
          name="searchbar"
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {generateTable(cdata, "solid", tableOptions, search)}
        {generateTable(cdata, "transparent", tableOptions, search)}
        {generateTable(cdata, "chrome", tableOptions, search)}
        {generateTable(cdata, "pearl", tableOptions, search)}
        {generateTable(cdata, "satin", tableOptions, search)}
        {generateTable(cdata, "metallic", tableOptions, search)}
        {generateTable(cdata, "milky", tableOptions, search)}
        {generateTable(cdata, "glitter", tableOptions, search)}
        {generateTable(cdata, "speckle", tableOptions, search)}
        {generateTable(cdata, "modulex", tableOptions, search)}
        {generateTable(cdata, "modulexFoil", tableOptions, search)}
        {generateTable(cdata, "functional", tableOptions, search)}
        {generateTable(cdata, "unreleased", tableOptions, search)}
        <section className="temp-footer">
          <h3>options</h3>
          <div>
            <input
              type="checkbox"
              id="option1"
              name="option1"
              value="hideQID"
              onChange={(e) =>
                setTableOptions((tableOptions) => ({
                  ...tableOptions,
                  ...{ hideQID: e.target.checked },
                }))
              }
            />
            <label htmlFor="option1"> Hide qelement ID</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="option2"
              name="option2"
              value="hideBrickOwl"
              onChange={(e) =>
                setTableOptions((tableOptions) => ({
                  ...tableOptions,
                  ...{ hideBrickOwl: e.target.checked },
                }))
              }
            />
            <label htmlFor="option2"> Hide BrickOwl</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="option3"
              name="option3"
              value="showSwatchId"
              onChange={(e) =>
                setTableOptions((tableOptions) => ({
                  ...tableOptions,
                  ...{ showSwatchId: e.target.checked },
                }))
              }
            />
            <label htmlFor="option3"> Show Swatch IDs</label>
          </div>
        </section>
      </div>
    );
  } else return <p>Loading...</p>;

  function generateTable(
    data: color[],
    type: string,
    tableOptions: ITableOptions,
    search: string
  ) {
    let contentLength = 0;

    const sortedData = data
      .filter(
        (color: color) => validateSearch(color, search) && color.type === type
      )
      .sort((a: color, b: color) => {
        if (sortKey) {
          const aValue = a[sortKey as keyof color];
          const bValue = b[sortKey as keyof color];

          if (
            sortKey === "bl_id" ||
            sortKey === "tlg_id" ||
            sortKey === "bo_id" ||
            sortKey === "id" ||
            sortKey === "swatchId"
          ) {
            return sortDirection === "asc"
              ? compareNumericWithNull(aValue as number, bValue as number)
              : compareNumericWithNull(bValue as number, aValue as number);
          } else if (aValue === "" || bValue === "") {
            // Move empty strings to the end
            if (aValue === bValue) return 0;
            if (aValue === "") return sortDirection === "asc" ? 1 : -1;
            if (bValue === "") return sortDirection === "asc" ? -1 : 1;
          } else {
            // Compare non-empty values as usual
            if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
            if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
          }

          return 0;
        }
        return 0;
      });
    const output = (
      <>
        <h1>{type}</h1>
        <table className="color-table" cellSpacing={0}>
          <thead>
            <tr>
              {!tableOptions.hideQID && (
                <th
                  style={{ width: "2em" }}
                  className="clickable"
                  onClick={() => toggleSort("id")}
                >
                  qid
                </th>
              )}
              <th
                style={{ width: "2em" }}
                onClick={() => toggleSort("swatchId")}
                className="swatch-header clickable"
              >
                {sortKey === "swatchId"
                  ? sortDirection === "asc"
                    ? "▲"
                    : "▼"
                  : "c"}
              </th>
              <th
                style={{ width: "2em" }}
                className="clickable"
                onClick={() => toggleSort("bl_id")}
              >
                id
              </th>
              <th
                style={{ width: "14em" }}
                onClick={() => toggleSort("bl_name")}
                className="text-left clickable"
              >
                bricklink name
                {sortKey === "bl_name" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                style={{ width: "2em" }}
                className="clickable"
                onClick={() => toggleSort("tlg_id")}
              >
                id
              </th>
              <th
                style={{ width: "27em" }}
                onClick={() => toggleSort("tlg_name")}
                className="text-left clickable"
              >
                tlg name
                {sortKey === "tlg_name" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              {!tableOptions.hideBrickOwl && (
                <>
                  <th
                    style={{ width: "2em" }}
                    className="clickable"
                    onClick={() => toggleSort("bo_id")}
                  >
                    id
                  </th>
                  <th
                    style={{ width: "18em" }}
                    onClick={() => toggleSort("bo_name")}
                    className="text-left clickable"
                  >
                    brickowl name
                    {sortKey === "bo_name" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                </>
              )}
              <th style={{ width: "5em" }} className="text-left">
                hex
              </th>
              <th
                className="text-left clickable"
                onClick={() => toggleSort("note")}
              >
                note
                {sortKey === "note" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map(
              (color: color) =>
                validateSearch(color, search) &&
                color.type == type &&
                (contentLength++,
                (
                  <tr key={color.id}>
                    {!tableOptions.hideQID && (
                      <td className="text-right md-grey-text">{color.id}</td>
                    )}
                    <td className="border-all" style={{ padding: 0 }}>
                      <div
                        className={"square h100 b flex-text-center " + type}
                        style={{
                          backgroundColor: "#" + color.hex,
                          fontSize: tableOptions.showSwatchId ? 9 : "inherit",
                          color: getTextColor(color.hex),
                        }}
                      >
                        {tableOptions.showSwatchId
                          ? color.swatchId
                          : color.hex == "UNKNWN" && "?"}
                      </div>
                    </td>

                    <td className="pr-sm text-right md-grey-text border-top border-bottom border-right-soft cell-shade-yellow">
                      {color.bl_id <= 0 ? "" : color.bl_id}
                    </td>
                    <td className="pl-sm border-top border-bottom border-right cell-shade-yellow">
                      <Link className="text-black" to={"/color/" + color.id}>
                        {color.bl_name}
                      </Link>
                    </td>
                    <td className="pr-sm text-right md-grey-text border-top border-bottom border-right-soft cell-shade-red">
                      {color.tlg_id <= 0 ? "" : color.tlg_id}
                    </td>
                    <td className="pl-sm border-top border-bottom border-right cell-shade-red">
                      <Link className="text-black" to={"/color/" + color.id}>
                        {color.tlg_name}
                      </Link>
                    </td>
                    {!tableOptions.hideBrickOwl && (
                      <>
                        <td className="pr-sm text-right md-grey-text border-top border-bottom border-right-soft cell-shade-blue">
                          {color.bo_id <= 0 ? "" : color.bo_id}
                        </td>
                        <td className="pl-sm border-top border-bottom border-right cell-shade-blue">
                          <Link
                            className="text-black"
                            to={"/color/" + color.id}
                          >
                            {color.bo_name}
                          </Link>
                        </td>
                      </>
                    )}

                    <td className="border-top border-bottom border-right text-center">
                      #{color.hex.toUpperCase()}
                    </td>
                    <td className="table-notes border-top border-bottom">
                      {color.note}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </>
    );
    if (contentLength > 0) return output;
    return <></>;
  }
}

export default AllColors;
