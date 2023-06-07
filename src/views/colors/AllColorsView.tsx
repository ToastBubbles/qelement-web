import React, { useState } from "react";
import AllColors from "../../components/AllColors";
export default function AllColorsView() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <>
      <div className="main-container">
        <div className="right-col">
          <div className="lower-center">
            <div className="color">Colors</div>
            <div className="fake-hr"></div>

            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="currentColor"
                className="bi bi-search zen-search-icon"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>

              <input
                id="searchbar"
                name="searchbar"
                type="text"
                placeholder="Search..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <AllColors search={searchQuery} />
          </div>
        </div>
      </div>
    </>
  );
}

// import Head from "@/components/HeadSetter";
// import { useRouter } from "next/router";
// import Navbar from "@/components/Navbar";
// import colors from "@/utils/data.js";
// import React, { useState } from "react";
// import { useQuery, useQueryClient } from "react-query";
// import axios from "axios";
// import exp from "constants";

// const ColorId = () => {
//   const router = useRouter();
//   const { colorId } = router.query;

//   return colorId;
// };

// export interface color {
//   id: number;
//   bl_name: string;
//   tlg_name: string;
//   bo_name: string;
//   hex: string;
//   bl_id: number;
//   tlg_id: number;
//   note: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export default function Home() {
//   let color = colors.find((x) => x.Lid == ColorId());
//   let hex = "#" + color?.color;

//   const queryClient = useQueryClient();

//   const { data, isLoading, error } = useQuery("todos", () =>
//     axios.get<color[]>("http://localhost:3000/color")
//   );

//   return (
//     <>
//       <Head title={color?.BLName} />
//
//       <div className="colorTop">
//         <div className="colorName">
//           {color?.BLName.length == 0 ? color.LName : color?.BLName}
//         </div>
//         <div className="hexbar" style={{ backgroundColor: hex }}>
//           {hex}
//         </div>
//       </div>
//       <div className="fake-hr"></div>
//       {!isLoading && data ? (
//         data.data.map((color) => <li>{color.bl_name}</li>)
//       ) : (
//         <p>loading...</p>
//       )}
//     </>
//   );
// }
