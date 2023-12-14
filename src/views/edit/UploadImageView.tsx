import ImageUploader from "../../components/ImageUploader";
import showToast, { Mode } from "../../utils/utils";

export default function UploadImageView() {
  const queryParameters = new URLSearchParams(window.location.search);
  const urlQPartId = queryParameters.get("qpartId");
  const urlSculptureId = queryParameters.get("sculptureId");
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
  if (urlQPartId) {
    if (urlQPartId && urlSculptureId) {
      showToast(
        "URL contains ID for sculture and QPart, only showing form for QPart",
        Mode.Warning
      );
    }
    return (
      <>
        <div className="formcontainer">
          <h1>upload image</h1>
          <div className="mainform">
            <ImageUploader qpartId={Number(urlQPartId)} sculptureId={null} />
          </div>
        </div>
      </>
    );
  } else if (urlSculptureId) {
    return (
      <>
        <div className="formcontainer">
          <h1>upload image</h1>
          <div className="mainform">
            <ImageUploader
              qpartId={null}
              sculptureId={Number(urlSculptureId)}
            />
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="formcontainer">
          <h1>upload image</h1>
          <div className="mainform">
            <ImageUploader qpartId={null} sculptureId={null} />
          </div>
        </div>
      </>
    );
  }
}
