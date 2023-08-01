import { useState } from "react";
import { useNavigate } from "react-router";


export default function SearchBarMain() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>("");

  function search() {
    const formattedSearch = searchValue.replace(/ +/g, " ");
    //.replace(/ /g, "%20");

    navigate(`/search?query=${formattedSearch}`);
  }

  return (
    <input
      className="main-searchbar"
      type="text"
      placeholder="Search"
      onChange={(e) => setSearchValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          search();
        }
      }}
    />
  );
}
