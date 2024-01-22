import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import LoadingPage from "../components/LoadingPage";
import {
  IElementIDSearch,
  IPartDTO,
  IPartDTOIncludes,
  IPartMoldDTO,
  ISculptureDTO,
} from "../interfaces/general";
import RecentQPart from "../components/RecentQPart";
import RecentSculpture from "../components/RecentSculpture";
import RecentPart from "../components/RecentPart";
import RecentMold from "../components/RecentMold";

export default function SearchView() {
  const [searchValue, setSearchValue] = useState<string>("");
  //   const queryParameters = new URLSearchParams(window.location.search);
  //   const urlQuery = queryParameters.get("query");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParameters = new URLSearchParams(location.search);
    const urlQuery = queryParameters.get("query");

    if (urlQuery) setSearchValue(urlQuery);
  }, [location.search]);

  useEffect(() => {
    if (searchValue) {
      navigate(`?query=${searchValue}`);
    } else {
      navigate("/");
    }
  }, [searchValue, navigate]);
  const { data: sculpSearchData } = useQuery({
    queryKey: `sculpSearch${searchValue}`,
    queryFn: () => {
      return axios.get<ISculptureDTO[]>(
        `http://localhost:3000/sculpture/search`,
        {
          params: {
            search: searchValue,
          },
        }
      );
    },
    staleTime: 0,
    enabled: !!searchValue && searchValue.length > 0,
  });
  const { data: partSearchData } = useQuery({
    queryKey: `partSearch${searchValue}`,
    queryFn: () => {
      return axios.get<IPartDTOIncludes[]>(
        `http://localhost:3000/parts/search`,
        {
          params: {
            search: searchValue,
          },
        }
      );
    },
    staleTime: 0,
    enabled: !!searchValue && searchValue.length > 0,
  });

  const { data: moldSearchData } = useQuery({
    queryKey: `moldSearch${searchValue}`,
    queryFn: () => {
      return axios.get<IPartMoldDTO[]>(
        `http://localhost:3000/partMold/search`,
        {
          params: {
            search: searchValue,
          },
        }
      );
    },
    staleTime: 0,
    enabled: !!searchValue && searchValue.length > 0,
  });

  const { data: qpartSearchData } = useQuery({
    queryKey: `qpartSearch${searchValue}`,
    queryFn: () => {
      return axios.get<IElementIDSearch[]>(
        `http://localhost:3000/elementID/search`,
        {
          params: {
            search: searchValue,
          },
        }
      );
    },
    staleTime: 0,
    enabled: !!searchValue && searchValue.length > 0,
  });

  if (partSearchData && moldSearchData && qpartSearchData && sculpSearchData) {
    const partResults = partSearchData.data;
    const moldResults = moldSearchData.data;
    const qpartResults = qpartSearchData.data;
    const sculpResults = sculpSearchData.data;
    return (
      <>
        <div className="mx-w">
          <h1>search results for "{searchValue}"</h1>
          <h3>Parts:</h3>
          {partResults.length == 0 ? (
            <div className="grey-txt">No results</div>
          ) : (
            <div style={{ width: "30em" }} className="rib-container">
              {partResults.map((part) => (
                <RecentPart part={part} key={part.id} />
              ))}
            </div>
          )}
          <h3>Molds:</h3>
          {moldResults.length == 0 ? (
            <div className="grey-txt">No results</div>
          ) : (
            <div style={{ width: "30em" }} className="rib-container">
              {moldResults.map((mold) => (
                <RecentMold key={mold.id} mold={mold} />
              ))}
            </div>
          )}
          <h3>Q-Elements:</h3>
          {qpartResults.length == 0 ? (
            <div className="grey-txt">No results</div>
          ) : (
            <div style={{ width: "30em" }}>
              {qpartResults.map((eID) => (
                <RecentQPart key={eID.id} qpartl={eID.qpart} />
              ))}
            </div>
          )}
          <h3>Sculptures:</h3>
          {sculpResults.length == 0 ? (
            <div className="grey-txt">No results</div>
          ) : (
            <div style={{ width: "30em" }} className="rib-container">
              {sculpResults.map((sculpture) => (
                <RecentSculpture key={sculpture.id} sculpture={sculpture} />
              ))}
            </div>
          )}
        </div>
      </>
    );
  } else {
    return <LoadingPage />;
  }
}
