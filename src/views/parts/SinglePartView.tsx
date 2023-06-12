import axios from "axios";
import { useQuery } from "react-query";
import { useParams, useNavigate } from "react-router";
import AllColorStatus from "../../components/AllColorStatus";
import Navpane from "../../components/Navpane";
import RatingCard from "../../components/RatingCard";
import { iQPartDTO, color, part, IQPartDTO } from "../../interfaces/general";
import { useState } from "react";
import Notification from "../../components/Notification";
import ImageUploader from "../../components/ImageUploader";
import { Link } from "react-router-dom";

export default function SinglePartView() {
  const queryParameters = new URLSearchParams(window.location.search);
  const urlColorId = queryParameters.get("color");

  const [selectedQPartid, setSelectedQPartid] = useState<number>(-1);
  // console.log("color", urlColorId);

  const { partId } = useParams();
  const navigate = useNavigate();
  console.log("partid", partId);

  const {
    data: qpartData,
    isLoading: qpartIsLoading,
    error: qpartError,
    refetch: qpartRefetch,
  } = useQuery({
    queryKey: "qpart",
    queryFn: () => {
      console.log("rating fetch");
      return axios.get<IQPartDTO[]>(
        `http://localhost:3000/qpart/matchesByPartId/${partId}`
      );
    },
    // onSuccess: () => {
    //   // let mypart = qpartData?.data.find((x) => x.id == selectedQPart.id);
    //   if (mypart) {
    //     setSelectedQPart(mypart);
    //   }
    // },
    staleTime: 0,
    enabled: !!partId,
    // retry: false,
  });
  let mypart = qpartData?.data.find((x) => x.id == selectedQPartid);
  if (qpartData) console.log("data", qpartData.data);

  // const {
  //   data: qpartData,
  //   isLoading: qpartIsLoading,
  //   error: qpartError,
  // } = useQuery({
  //   queryKey: "qpart",
  //   queryFn: () =>
  //     axios.get<iQPartDTO>(`http://localhost:3000/qpart/dto/${qpartId}`),
  //   enabled: true,
  //   // retry: false,
  // });
  const {
    data: colData,
    isLoading: colIsLoading,
    error: colError,
  } = useQuery("allColors", () =>
    axios.get<color[]>("http://localhost:3000/color")
  );

  const {
    data: partData,
    isLoading: partIsLoading,
    error: partError,
  } = useQuery({
    queryKey: "part",
    queryFn: () => axios.get<part>(`http://localhost:3000/parts/${partId}`),

    enabled: !!partId,
    // retry: false,
  });
  // const {
  //   data: colData,
  //   isLoading: colIsLoading,
  //   error: colError,
  // } = useQuery({
  //   queryKey: "color",
  //   queryFn: () =>
  //     axios.get<color>(
  //       `http://localhost:3000/color/${qpartData?.data.colorId}`
  //     ),
  //   enabled: true && !qpartIsLoading && qpartData?.data.colorId != undefined,
  //   retry: false,
  // });
  // const ratingMutation = useMutation({
  //   mutationFn: ({ rating, creatorId, qpartId }: IRatingDTO) =>
  //     axios.post<rating>(`http://localhost:3000/rating`, {
  //       rating,
  //       creatorId,
  //       qpartId,
  //     }),
  //   onSuccess: () => {},
  // });

  let part = partData?.data;
  let qparts = qpartData?.data;
  let colors = colData?.data;
  function getColorName(colorId: number): string {
    let thisColor = colors?.find((x) => x.id == colorId);

    if (thisColor) {
      return thisColor.bl_name ? thisColor.bl_name : thisColor.tlg_name;
    }
    return "Unnamed Color";
  }
  // function setQPart(id: number) {
  //   let part = qparts?.find((x) => x.id == id);
  //   if (part) setSelectedQPart(part);
  //   else setSelectedQPart(defaultValues);
  // }
  if (qpartError) {
    console.log(qpartError);

    navigate("/404");
  }

  if (qparts && colors) {
    if (selectedQPartid == -1) {
      setSelectedQPartid(qparts[1].id);
    }

    return (
      <>
        <div className="main-container">
          <div className="left-col">
            <Navpane />
          </div>
          <div className="right-col">
            <div className="top">
              <ul className="breadcrumb">
                <li>
                  <a href="#">parts</a>
                </li>
                <li>{">"}</li>
                <li>
                  <a href="#">bricks</a>
                </li>
              </ul>

              <div className="element-name">
                {!partIsLoading && partData ? part?.name : "loading"}
              </div>
              <select
                name="qpartcolors"
                id="qpartcolors"
                className="qpart-color-dropdown"
                onChange={(e) => setSelectedQPartid(Number(e.target.value))}
                value={selectedQPartid}
              >
                <option value="-1">--</option>
                {qparts.map((qpart) => (
                  <option key={qpart.id} value={`${qpart.id}`}>
                    {getColorName(qpart.colorId)}
                  </option>
                ))}
              </select>
            </div>
            <div className="center">
              <div className="element-image">
                <img
                  className="element-image-actual"
                  src="https://via.placeholder.com/1024x768/eee?text=4:3"
                  alt=""
                />
                <Link to="/add/qpart/image" state={"this is a tes"}>
                  Upload an image
                </Link>
              </div>
              <RatingCard
                rating={mypart?.rarety != undefined ? mypart?.rarety : -1}
                qpartId={mypart?.id as number}
                refetchFn={qpartRefetch}

                // rating={100}
              />
              {/* <input
              type="number"
              placeholder="rating"
              onChange={(e) => setMyRating(e.target.valueAsNumber)}
            />
            <button
              onClick={() => {
                if (myRating != -1) {
                  console.log("adding...");

                  ratingMutation.mutate({
                    rating: myRating,
                    creatorId: 1,
                    qpartId: qpart?.id as number,
                  });
                }
              }}
            >
              Add Rating
            </button> */}
              <ul className="actions">
                <span>Actions:</span>
                <li>
                  <a href="#">Change my rarity rating</a>
                </li>
                <li>
                  <a href="#">Add to My Collection</a>
                </li>
                <li>
                  <a href="#">Add to My Watchlist</a>
                </li>
                <li>
                  <a href="#">Add photo</a>
                </li>
                <li>
                  <a href="#">Submit status change</a>
                </li>
                <span>Links:</span>

                <li>
                  <a href="#">bricklink</a>
                </li>
                <li>
                  <a href="#">brickowl</a>
                </li>
                <li>
                  <a href="#">rebrickable</a>
                </li>
              </ul>
              <fieldset className="status">
                <legend>Status</legend>
                <div className="tag-found">FOUND</div>
                <div className="status-date">as of 14 Mar 2021</div>
              </fieldset>
            </div>
            <div className="lower-center">
              {/* <div className="color">{color?.bl_name}</div> */}
              <div className="fake-hr"></div>
              <div className="lower-container">
                <div className="lower-center-left">
                  <div className="tab">
                    <button className="tablinks active">Price History</button>
                    <button className="tablinks">Comments</button>
                  </div>
                  <div className="tabcontent pricehistory tabhidden">
                    <img
                      className="scatter-img"
                      src="/img/scatter-example.png"
                    />
                  </div>
                  <div className="tabcontent comments">
                    {/* <Comment id={1} />
                  <Comment id={1} />
                  <Comment id={1} />
                  <Comment id={1} />
                  <Comment id={1} />
                  <Comment id={1} /> */}
                  </div>
                </div>
                <div className="lower-center-right">
                  <form id="search-form" action="/ads">
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
                    />
                  </form>

                  <fieldset className="other-colors">
                    <legend>other colors</legend>
                    <AllColorStatus partId={3001} />
                  </fieldset>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <p>loading...</p>;
  }
}
