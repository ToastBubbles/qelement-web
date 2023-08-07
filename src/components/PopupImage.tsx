import { useState } from "react";

interface IProps {
  imgPath: string;
  closePopup: () => void;
}
interface IImageProps {
  width: number;
  height: number;
}

export default function PopupImage({ imgPath, closePopup }: IProps) {
  const [imageProps, setImageProps] = useState<IImageProps>({
    width: 0,
    height: 0,
  });
  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = event.currentTarget;
    setImageProps({
      height,
      width,
    });
  };

  return (
    <div className="popup-container">
      <div className="popup-body-large">
        <button className="popup-close" onClick={closePopup}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </button>

        <div className="popup-img-container">
          <img src={imgPath} onLoad={handleImageLoad} />
        </div>
        <div>
          {imageProps.width}px by {imageProps.height}px
        </div>
      </div>
    </div>
  );
}
