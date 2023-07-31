import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router";
import { IRatingDTO, rating } from "../interfaces/general";
import { AppContext } from "../context/context";
import { toast } from "react-toastify";
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
    dispatch,
  } = useContext(AppContext);

  const navigate = useNavigate();

  const [myRating, setMyRating] = useState<number>(-1);

  const {
    data: ratingData,
    isLoading: ratingIsLoading,
    error: ratingError,
    refetch: ratingRefetch,
  } = useQuery({
    queryKey: "myRating",
    queryFn: () =>
      axios.get<number>(
        `http://localhost:3000/rating/${payload.id}/${qpartId}`
      ),
    enabled: !!payload.id,
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (!!payload.id) ratingRefetch();
  }, [qpartId, rating]);

  const ratingMutation = useMutation({
    mutationFn: ({ rating, creatorId, qpartId }: IRatingDTO) =>
      axios.post<rating>(`http://localhost:3000/rating`, {
        rating,
        creatorId,
        qpartId,
      }),
    onSuccess: () => {
      showToast("Rating saved!", Mode.Success);
      refetchFn();
    },
  });
  rating = Math.round(rating);
  return (
    <div className="rating-container">
      <div className="rating">
        <div className={"rating-score " + getTier(rating)}>
          {rating != -1 ? rating : "--"}
        </div>
        <div className={"rating-text " + getTier(rating) + "-bottom"}>
          {getTier(rating).replace("-", " ")}
        </div>
      </div>
      <div className="my-rating">my rating:</div>
      <div className="my-rating-number">
        {ratingData?.data ? ratingData.data : "not rated"}
      </div>
      <input
        className="ratingInput"
        type="number"
        placeholder="Rating"
        onChange={(e) => setMyRating(e.target.valueAsNumber)}
        value={myRating == -1 ? "" : myRating}
      />
      <button
        onClick={() => {
          if (myRating != -1) {
            if (myRating >= 0 && myRating <= 100) {
              ratingMutation.mutate({
                rating: myRating,
                creatorId: payload.id || 1,
                qpartId: qpartId as number,
              });
              setMyRating(-1);
              ratingRefetch();
            } else {
              showToast("Invalid input", Mode.Error);
            }
          }
        }}
      >
        Update
      </button>
    </div>
  );
}

export default RatingCard;
