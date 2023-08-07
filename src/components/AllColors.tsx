import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { color } from "../interfaces/general";
import { Link } from "react-router-dom";
import { validateSearch } from "../utils/utils";
// import { similarColor } from "@/pages/colors/[colorId]";

export interface ITableOptions {
  hideQID: boolean;
  hideBrickOwl: boolean;
  //   search: string;
}

function AllColors() {
  const [search, setSearchQuery] = useState<string>("");
  //   console.log(search);

  const [tableOptions, setTableOptions] = useState<ITableOptions>({
    hideQID: false,
    hideBrickOwl: false,
    // search,
  });

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
        </section>
      </div>
    );
  } else return <p>Loading...</p>;
}

function generateTable(
  data: color[],
  type: string,
  tableOptions: ITableOptions,
  search: string
) {
  let contentLength = 0;
  const output = (
    <>
      <h1>{type}</h1>
      <table className="color-table" cellSpacing={0}>
        <tr>
          {!tableOptions.hideQID && <th style={{ width: "2em" }}>qid</th>}
          <th style={{ width: "2em" }} className="swatch-header"></th>
          <th style={{ width: "2em" }}>id</th>
          <th style={{ width: "14em" }} className="text-left">
            bricklink name
          </th>
          <th style={{ width: "2em" }}>id</th>
          <th style={{ width: "27em" }} className="text-left">
            tlg name
          </th>
          {!tableOptions.hideBrickOwl && (
            <>
              <th style={{ width: "2em" }}>id</th>
              <th style={{ width: "18em" }} className="text-left">
                brickowl name
              </th>
            </>
          )}
          <th style={{ width: "5em" }} className="text-left">
            hex
          </th>
          <th className="text-left">notes</th>
        </tr>

        {data.map(
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
                    style={{ backgroundColor: "#" + color.hex }}
                  >
                    {color.hex == "UNKNWN" && "?"}
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
                      <Link className="text-black" to={"/color/" + color.id}>
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
      </table>
    </>
  );
  if (contentLength > 0) return output;
  return <></>;
}

export default AllColors;
