import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import { useQuery, useMutation, UseMutationResult } from "react-query";
import { useNavigate, useParams } from "react-router";
import ImageUploader from "../../components/ImageUploader";
import { IUploadImageDetails } from "../../interfaces/general";

export default function UploadImageView() {
  //   const { colorId } = useParams();
  //   const [similarColorToAdd, setSimilarColorToAdd] = useState<number>(0);
  //   const navigate = useNavigate();

  //   const {
  //     data: colData,
  //     isLoading: colIsLoading,
  //     error: colError,
  //   } = useQuery({
  //     queryKey: "color",
  //     queryFn: () => axios.get<color>(`http://localhost:3000/color/id/${colorId}`),
  //     enabled: true,
  //     retry: false,
  //   });
  //   const {
  //     data: simData,
  //     isLoading: simIsLoading,
  //     error: simError,
  //   } = useQuery({
  //     queryKey: "similarColors",
  //     queryFn: () =>
  //       axios.get<similarColor[]>(
  //         `http://localhost:3000/similarColor/${colorId}`
  //       ),
  //     enabled: true,
  //     retry: false,
  //   });

  //   const similarColorMutation = useMutation({
  //     mutationFn: ({ color_one, color_two }: ISimilarColorDTO) =>
  //       axios.post<color>(`http://localhost:3000/similarColor`, {
  //         color_one,
  //         color_two,
  //       }),
  //     onSuccess: () => {},
  //   });

  //   if (colError || simError) {
  //     navigate("/404");
  //   }

  return (
    <>
      <div className="formcontainer">
        <h1>upload image</h1>
        <div className="mainform">
          <ImageUploader />
        </div>
      </div>
    </>
  );
}
