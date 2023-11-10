import React, { useState, useEffect } from "react";

const ImageAdjuster = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageBrightness, setImageBrightness] = useState<number>(100);
  const [imageContrast, setImageContrast] = useState<number>(100);
  const [imageSaturate, setImageSaturate] = useState<number>(100);
  const [imageScale, setImageScale] = useState<number>(100);
  const [imagePosX, setImagePosX] = useState<number>(0);
  const [imagePosY, setImagePosY] = useState<number>(0);
  const [preloadedImageUrl, setPreloadedImageUrl] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Preload the image
    if (selectedImage) {
      const imageUrl = URL.createObjectURL(selectedImage);
      setPreloadedImageUrl(imageUrl);
    }
  }, [selectedImage]);

  const containerStyle = {
    filter: `brightness(${imageBrightness}%) contrast(${imageContrast}%) saturate(${imageSaturate}%)`,
    backgroundImage: selectedImage ? `url(${preloadedImageUrl})` : "",
    backgroundSize: `${imageScale}%`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: `${imagePosX}px ${imagePosY}px`,

    minHeight: "40em",
  };
  const labelStyle = {
    width: "150px", // Set a fixed width for the labels
    display: "inline-block",
  };
  return (
    <div>
      {selectedImage && (
        <div className="w-100">
          <div style={containerStyle} className="w-100"></div>
          <br />

          <div className="imageAdjustSliderContainer">
            <label style={labelStyle} htmlFor="bright">
              Brightness ({imageBrightness})
            </label>
            <input
              className="imageAdjustSlider"
              type="range"
              name="bright"
              min="0"
              max="200"
              value={imageBrightness}
              step="0.1"
              onChange={(e) => setImageBrightness(Number(e.target.value))}
            />
            <label style={labelStyle} htmlFor="contrast">
              Contrast ({imageContrast})
            </label>
            <input
              className="imageAdjustSlider"
              type="range"
              name="contrast"
              min="0"
              max="200"
              value={imageContrast}
              step="0.1"
              onChange={(e) => setImageContrast(Number(e.target.value))}
            />
            <label style={labelStyle} htmlFor="saturate">
              Saturation ({imageSaturate})
            </label>
            <input
              className="imageAdjustSlider"
              type="range"
              name="saturate"
              min="0"
              max="200"
              value={imageSaturate}
              step="0.1"
              onChange={(e) => setImageSaturate(Number(e.target.value))}
            />
          </div>
          <div className="imageAdjustSliderContainer">
            <label style={labelStyle} htmlFor="scale">
              Scale ({imageScale})
            </label>
            <input
              className="imageAdjustSlider"
              type="range"
              name="scale"
              min="0"
              max="300"
              value={imageScale}
              step="0.1"
              onChange={(e) => setImageScale(Number(e.target.value))}
            />
            <label style={labelStyle} htmlFor="posX">
              X Position ({imagePosX})
            </label>
            <input
              className="imageAdjustSlider"
              type="range"
              name="posX"
              min="-500"
              max="500"
              value={imagePosX}
              step="1"
              onChange={(e) => setImagePosX(Number(e.target.value))}
            />
            <label style={labelStyle} htmlFor="posY">
              Y Position ({imagePosY})
            </label>
            <input
              className="imageAdjustSlider"
              type="range"
              name="posY"
              min="-500"
              max="500"
              value={imagePosY}
              step="1"
              onChange={(e) => setImagePosY(Number(e.target.value))}
            />
          </div>
        </div>
      )}

      <br />
      <br />

      <input
        type="file"
        name="myImage"
        onChange={(event) => {
          if (event.target.files !== null) {
            setSelectedImage(event.target.files[0]);
          }
        }}
      />
      {selectedImage && (
        <button onClick={() => setSelectedImage(null)}>Remove</button>
      )}
    </div>
  );
};

export default ImageAdjuster;
