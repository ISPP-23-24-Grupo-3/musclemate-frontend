import * as Slider from "@radix-ui/react-slider";

import { useState } from "react";

function FilledStar() {
  return (
    <svg
      className="w-8"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-0.4 -0.4 6.61 6.61"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m102.951 121.936.818 1.656 1.828.268-1.323 1.288.312 2.08-1.635-.876-1.635.876.312-2.077-1.323-1.291 1.829-.268z"
        transform="translate(-100.04 -121.672)"
      />
    </svg>
  );
}

function EmptyStar() {
  return (
    <svg
      className="fill-none w-8"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-0.4 -0.4 6.61 6.61"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m102.951 121.936.818 1.656 1.828.268-1.323 1.288.312 2.08-1.635-.876-1.635.876.312-2.077-1.323-1.291 1.829-.268z"
        transform="translate(-100.04 -121.672)"
      />
    </svg>
  );
}

function HalfStar() {
  return (
    <svg
      className="w-8 fill-none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-0.4 -0.4 6.61 6.61"
    >
      <path
        className="stroke-none fill-current"
        d="M102.951 121.936v4.416l-1.635.876.312-2.077-1.323-1.291 1.829-.268z"
        transform="translate(-100.04 -121.672)"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m102.951 121.936.818 1.656 1.828.268-1.323 1.288.312 2.08-1.635-.876-1.635.876.312-2.077-1.323-1.291 1.829-.268z"
        transform="translate(-100.04 -121.672)"
      />
    </svg>
  );
}

function Rating({ rating }) {
  const filled_stars = Math.floor(rating) || 0;
  const empty_stars = Math.floor(5 - rating) || 0;
  return (
    <div
      className={`flex fill-current stroke-yellow-700 stroke-[0.3] text-yellow-400`}
    >
      {[...Array(filled_stars)].map((_, index) => (
        <FilledStar key={index} />
      ))}
      {rating % 1 != 0 && <HalfStar />}
      {[...Array(empty_stars)].map((_, index) => (
        <EmptyStar key={index} />
      ))}
    </div>
  );
}

export const EditableRating = ({ onChange }) => {
  const [rating, setRating] = useState(0);
  return (
    <div className="relative size-fit">
      <Slider.Root
        defaultValue={[0]}
        onValueChange={(v) => {
          setRating(v);
          onChange(v);
        }}
        max={5}
        step={0.5}
        className="absolute flex h-full w-full"
      ></Slider.Root>
      <Rating rating={rating} />
    </div>
  );
};

Rating.propTypes = {
  rating: Number,
};

export default Rating;
