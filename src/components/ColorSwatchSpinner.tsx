import React, { useState, useEffect, ChangeEvent } from "react";
import { color } from "../interfaces/general";

interface ColorSwatchSpinnerProps {
  colors: color[];
  onSelectSwatch: (selectedSwatch: number) => void;
}

const ColorSwatchSpinner: React.FC<ColorSwatchSpinnerProps> = ({
  colors,
  onSelectSwatch,
}) => {
  const [selectedSwatch, setSelectedSwatch] = useState<number | null>(null);

  const handleSwatchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSwatchId = parseInt(event.target.value, 10);
    setSelectedSwatch(newSwatchId);
  };

  const getNearbyColors = (): color[] => {
    // Implement logic to get nearby colors based on the selected swatch
    // You can use the swatchId to filter and display nearby colors
    // For example, you can filter colors where swatchId is within a certain range
    const nearbyColors = colors.filter(
      (color) =>
        selectedSwatch !== null &&
        Math.abs(color.swatchId - selectedSwatch) <= 5 // Adjust the range as needed
    );

    return nearbyColors;
  };

  return (
    <div className="color-carousel">
      <input
        type="range"
        min={1}
        max={100}
        value={selectedSwatch || ""}
        onChange={handleSwatchChange}
      />
      <div className="carousel-container">
        {getNearbyColors().map((color) => (
          <div
            key={color.id}
            className="color-item"
            style={{ backgroundColor: `#${color.hex}` }}
          >
            {/* Display additional information or UI for each color */}
          </div>
        ))}
      </div>
    </div>
  );
};
export default ColorSwatchSpinner;
