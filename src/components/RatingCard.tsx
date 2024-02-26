import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { AppContext } from "../context/context";
import {
  IAPIResponse,
  IRatingDTO,
  iIdOnly,
  rating,
} from "../interfaces/general";
import showToast, { Mode, getTier } from "../utils/utils";

interface IProps {
  rating: number;
  qpartId: number;
  refetchFn: () => void;
}

function RatingCard({ rating, qpartId, refetchFn }: IProps) {
  const {
    state: {
      jwt: { token, payload },
    },
  } = useContext(AppContext);

  // const navigate = useNavigate();

  const [myRating, setMyRating] = useState<number>(-1);

  const { data: ratingData, refetch: ratingRefetch } = useQuery({
    queryKey: "myRating",
    queryFn: () =>
      axios.get<rating>(`http://localhost:3000/rating/getMyRating/${qpartId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    enabled: !!token,
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (payload.id) ratingRefetch();
  }, [qpartId, rating, ratingRefetch, payload]);

  const ratingDeletionMutation = useMutation({
    mutationFn: (data: iIdOnly) =>
      axios.post<IAPIResponse>(`http://localhost:3000/rating/delete`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (e) => {
      if (e.data.code == 200) {
        showToast("Rating removed!", Mode.Success);
        refetchFn();
      } else {
        showToast("Error", Mode.Error);
      }
    },
  });

  const ratingMutation = useMutation({
    mutationFn: ({ rating, creatorId, qpartId }: IRatingDTO) =>
      axios.post<rating>(
        `http://localhost:3000/rating/addRating`,
        {
          rating,
          creatorId,
          qpartId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onSuccess: () => {
      showToast("Rating saved!", Mode.Success);
      refetchFn();
    },
  });
  rating = Math.round(rating);
  console.log(ratingData?.data);

  return (
    <div className="rating-container">
      <div className="rating">
        <div className={"rating-text-top " + getTier(rating) + "-bottom"}>
          Rarity:
        </div>
        <div className={"rating-score " + getTier(rating)}>
          {rating != -1 ? rating : "--"}
        </div>
        <div className={"rating-text " + getTier(rating) + "-bottom"}>
          {getTier(rating).replace("-", " ")}
        </div>
      </div>
      {payload.id ? (
        <div>
          <div className="my-rating">my rating:</div>
          <div className="my-rating-number">
            {ratingData?.data && ratingData.data.rating >= 0
              ? ratingData.data.rating
              : "not rated"}
          </div>
          <input
            className="ratingInput"
            type="number"
            placeholder="Rating"
            onChange={(e) => {
              if (e.target.value == "") {
                setMyRating(-1);
              } else {
                setMyRating(e.target.valueAsNumber);
              }
            }}
            value={myRating == -1 ? "" : myRating}
          />
          <div style={{ height: "3em" }}>
            {myRating == -1 ? (
              <>
                {ratingData?.data && ratingData?.data.rating >= 0 ? (
                  <button
                    onClick={() => {
                      if (ratingData.data.id) clearRating(ratingData.data.id);
                    }}
                    style={{ width: "5em" }}
                  >
                    Clear
                  </button>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <button
                onClick={() => {
                  if (myRating != -1) {
                    if (myRating >= 0 && myRating <= 100 && payload.id) {
                      ratingMutation.mutate({
                        rating: myRating,
                        creatorId: payload.id,
                        qpartId: qpartId as number,
                      });
                      setMyRating(-1);
                      ratingRefetch();
                    } else {
                      if (!payload.id)
                        showToast("You must log in to do this", Mode.Error);
                      else showToast("Invalid input", Mode.Error);
                    }
                  }
                }}
                style={{ width: "5em" }}
              >
                Update
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="my-rating">Login to rate this part</div>
      )}
    </div>
  );

  function clearRating(id: number) {
    ratingDeletionMutation.mutate({ id });
  }
}

export default RatingCard;
