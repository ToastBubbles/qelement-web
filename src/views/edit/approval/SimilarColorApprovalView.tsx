import axios from "axios";
import { useQuery } from "react-query";
import ColorDetails from "../../../components/Approval Componenents/ColorDetails";
import { Link } from "react-router-dom";
import SimilarColorDetails from "../../../components/Approval Componenents/SimilarColorDetails";
import {
  ISimilarColorDetailed,
  ISimilarColorDetailedWithInversionId,
} from "../../../interfaces/general";

export default function SimilarColorApprovalView() {
  const { data: simColData, refetch } = useQuery("notApprovedSimColors", () =>
    axios.get<ISimilarColorDetailed[]>(
      "http://localhost:3000/similarColor/notApproved"
    )
  );

  if (simColData) {
    const simColorsUnfiltered = simColData.data;
    // console.log(simColors);
    const simColors = fillInInversionIds(simColorsUnfiltered);

    return (
      <>
        <div className="formcontainer">
          <h1>approve similar colors</h1>
          <Link  className="link" to={"/approve"}>Back to Approval Overview</Link>
          <div className="mainform">
            {simColors.length > 0 ? (
              simColors.map((data) => {
                return (
                  <SimilarColorDetails
                    key={data.id}
                    data={data}
                    refetchFn={refetch}
                  />
                );
              })
            ) : (
              <div className="text-center my-1">
                nothing to approve right now!
              </div>
            )}
          </div>
        </div>
      </>
    );
  } else {
    return <p>Loading...</p>;
  }

  function fillInInversionIds(
    data: ISimilarColorDetailed[]
  ): ISimilarColorDetailedWithInversionId[] {
    let output: ISimilarColorDetailedWithInversionId[] = [];
    // console.log(data);

    data.forEach((pair) => {
      let existingPair = output.find((x) => x.id == pair.id);
      let existingInversion = output.find((x) => x.inversionId == pair.id);

      //   console.log(`START -- p:${existingPair} i:${existingInversion}`);

      if (existingPair == undefined && existingInversion == undefined) {
        let inversion = data.find(
          (x) => x.color1.id == pair.color2.id && x.color2.id == pair.color1.id
        );
        // console.log(inversion);

        output.push({
          id: pair.id,
          color1: pair.color1,
          color2: pair.color2,
          creator: pair.creator,
          inversionId: inversion ? inversion.id : pair.id,
        });
      }
      //   console.log(`output`, output);

      //   console.log(`END!! -- p:${existingPair} i:${existingInversion}`);
    });
    return output;
  }

  //   export interface ISimilarColorDetailed {
  //     id: number;
  //     color1: color;
  //     color2: color;
  //     creator: user;
  //   }

  //   export interface ISimilarColorDetailedWithInversionId
  //     extends ISimilarColorDetailed {
  //     inversionId: number;
  //   }
}
