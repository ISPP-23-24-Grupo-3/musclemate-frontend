function FilledStar() {
  return (
    <svg
      className="w-8"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-0.4 -0.4 6.61 6.61"
    >
      <path
        strokeWidth="0.75"
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
        strokeWidth="0.75"
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
        strokeWidth="0.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m102.951 121.936.818 1.656 1.828.268-1.323 1.288.312 2.08-1.635-.876-1.635.876.312-2.077-1.323-1.291 1.829-.268z"
        transform="translate(-100.04 -121.672)"
      />
      <path
        className="stroke-none fill-current"
        d="M102.951 121.936v4.416l-1.635.876.312-2.077-1.323-1.291 1.829-.268z"
        transform="translate(-100.04 -121.672)"
      />
    </svg>
  );
}

function Rating({ rating }) {
  const filled_stars = Math.floor(rating) || 0;
  const empty_stars = Math.floor(5 - rating) || 0;
  return (
    <div className="flex fill-current stroke-current text-yellow-400">
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

Rating.propTypes = {
  rating: Number,
};

export default Rating;
