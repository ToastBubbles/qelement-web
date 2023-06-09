import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router";
import { IRatingDTO, rating } from "../interfaces/general";
import { AppContext } from "../context/context";
import { toast } from "react-toastify";
import showToast, { Mode } from "../utils/utils";

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
  console.log("payload", payload);

  // console.log(qpartId);
  // console.log(rating);
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
    enabled: payload.id != undefined,
    staleTime: 0,
  });

  useEffect(() => {
    ratingRefetch();
  }, [qpartId, rating]);

  const ratingMutation = useMutation({
    mutationFn: ({ rating, creatorId, qpartId }: IRatingDTO) =>
      axios.post<rating>(`http://localhost:3000/rating`, {
        rating,
        creatorId,
        qpartId,
      }),
    onSuccess: () => {
      showToast("Rating saved!!", Mode.Success);
      refetchFn();
    },
  });

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
            console.log("adding...");
            if (myRating >= 0 && myRating <= 100) {
              console.log(Number(payload?.id) | 1);

              ratingMutation.mutate({
                rating: myRating,
                creatorId: Number(payload?.id) || 1,
                qpartId: qpartId as number,
              });
              setMyRating(-1);
              ratingRefetch();
              console.log(myRating);
              // router.reload();
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

function getTier(rating: number): string {
  let output: string;
  switch (true) {
    case rating == -1:
      output = "Not-Rated";
      break;
    case rating < 25:
      output = "Common";
      break;
    case rating < 45:
      output = "Uncommon";
      break;
    case rating < 60:
      output = "Rare";
      break;
    case rating < 85:
      output = "Exceptional";
      break;
    case rating < 95:
      output = "Legendary";
      break;
    case rating < 100:
      output = "Elusive";
      break;
    case rating == 100:
      output = "Unobtainable";
      break;
    default:
      output = "Error";
      break;
  }
  return output;
}

export default RatingCard;
