import * as Slider from "@radix-ui/react-slider";
import {
  TiStarHalfOutline,
  TiStarFullOutline,
  TiStarOutline,
} from "react-icons/ti";

import { useState } from "react";

function Rating({ rating, className }) {
  const filled_stars = Math.floor(rating) || 0;
  const empty_stars = Math.floor(5 - rating) || 0;
  return (
    <div className={`flex fill-current text-yellow-500`}>
      {[...Array(filled_stars)].map((_, index) => (
        <TiStarFullOutline key={index} className={`${className} size-6`} />
      ))}
      {rating % 1 != 0 && (
        <TiStarHalfOutline className={`${className} size-6`} />
      )}
      {[...Array(empty_stars)].map((_, index) => (
        <TiStarOutline key={index} className={`${className} size-6`} />
      ))}
    </div>
  );
}

export const EditableRating = ({ onChange, className, defaultValue }) => {
  const [rating, setRating] = useState(0);
  return (
    <div className="relative size-fit">
      <Slider.Root
        defaultValue={[defaultValue || 0]}
        onValueChange={(v) => {
          setRating(v);
          onChange(v);
        }}
        max={5}
        step={0.5}
        className="absolute flex h-full w-full"
      ></Slider.Root>
      <Rating rating={rating} className={className} />
    </div>
  );
};

Rating.propTypes = {
  rating: Number,
  // className: String,
};

EditableRating.propTypes = {
  onChange: Function,
  // className: String,
  defaultValue: Number,
};

export default Rating;
