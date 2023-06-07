import axios from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";
import { IRatingDTO, rating } from "../interfaces/general";


interface IProps {
  rating: number;
  qpartId?: number;
}


function RatingCard({ rating, qpartId }: IProps) {
  // console.log(qpartId);
  // console.log(rating);
  const navigate = useNavigate()

  const [myRating, setMyRating] = useState<number>(-1);
  const ratingMutation = useMutation({
    mutationFn: ({ rating, creatorId, qpartId }: IRatingDTO) =>
      axios.post<rating>(`http://localhost:3000/rating`, {
        rating,
        creatorId,
        qpartId,
      }),
    onSuccess: () => {},
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
        {rating != -1 ? rating : "not rated"}
      </div>
      <input
        className="ratingInput"
        type="number"
        placeholder="Rating"
        onChange={(e) => setMyRating(e.target.valueAsNumber)}
      />
      <button
        onClick={() => {
          if (myRating != -1) {
            console.log("adding...");
            if (myRating >= 0 && myRating <= 100) {
              ratingMutation.mutate({
                rating: myRating,
                creatorId: 1,
                qpartId: qpartId as number,
              });
              // router.reload();
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
