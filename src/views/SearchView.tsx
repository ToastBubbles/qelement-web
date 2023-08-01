import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import LoadingPage from "../components/LoadingPage";
import {
  IPartDTO,
  IPartMoldDTO,
  IQPartDTOIncludeLess,
} from "../interfaces/general";

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

  const {
    data: partSearchData,

  } = useQuery({
    queryKey: `partSearch${searchValue}`,
    queryFn: () => {
      return axios.get<IPartDTO[]>(`http://localhost:3000/parts/search`, {
        params: {
          search: searchValue,
        },
      });
    },
    staleTime: 0,
    enabled: !!searchValue && searchValue.length > 0,
  });

  const {
    data: moldSearchData,
 
  } = useQuery({
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

  const {
    data: qpartSearchData,
  } = useQuery({
    queryKey: `qpartSearch${searchValue}`,
    queryFn: () => {
      return axios.get<IQPartDTOIncludeLess[]>(
        `http://localhost:3000/qpart/search`,
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

  if (partSearchData && moldSearchData && qpartSearchData) {
    const partResults = partSearchData.data;
    const moldResults = moldSearchData.data;
    const qpartResults = qpartSearchData.data;
    return (
      <>
        <div className="mx-w">
          <h1>search results for "{searchValue}"</h1>
          <h3>Parts:</h3>
          {partResults.length == 0 ? (
            <div>No results</div>
          ) : (
            partResults.map((part) => (
              <Link key={part.id} to={`/part/${part.id}`}>
                {part.name}
              </Link>
            ))
          )}
          <h3>Molds:</h3>
          {moldResults.length == 0 ? (
            <div>No results</div>
          ) : (
            moldResults.map((mold) => (
              <Link key={mold.id} to={`/part/${mold.parentPart.id}`}>
                {mold.number}
              </Link>
            ))
          )}
          <h3>Q-Elements:</h3>
          {qpartResults.length == 0 ? (
            <div>No results</div>
          ) : (
            qpartResults.map((qpart) => (
              <Link
                key={qpart.id}
                to={`/part/${qpart.mold.parentPart.id}?color=${qpart.color.id}`}
              >
                <div> {qpart.color.bl_name}</div>
              </Link>
            ))
          )}
        </div>
      </>
    );
  } else {
    return <LoadingPage />;
  }
}
