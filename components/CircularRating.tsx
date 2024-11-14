function getRatingColor(rating: number): string {
  if (rating === 0) return "rgb(128, 128, 128)"; // gray color for N/A
  if (rating >= 7) return "rgb(40, 167, 69)";
  if (rating >= 5) return "rgb(255, 193, 7)";
  return "rgb(220, 53, 69)";
}

interface CircularRatingProps {
  rating: number;
  size?: number; // Add a new optional size prop
}

export function CircularRating({ rating, size = 36 }: CircularRatingProps) {
  const normalizedRating = Math.min(Math.max(rating, 0), 10);
  const percentage = (normalizedRating / 10) * 100;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const color = getRatingColor(normalizedRating);

  return (
    <div style={{ height: size, width: size, borderRadius: '50%' }} className="bg-[#0d0a12] relative">
      <svg className="absolute -rotate-90 transform" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} className="fill-none stroke-gray-700" strokeWidth={strokeWidth} />
        {normalizedRating > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="fill-none"
            strokeWidth={strokeWidth}
            stroke={color}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              transition: "stroke-dashoffset 0.3s ease",
            }}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold" style={{ color }}>
          {normalizedRating === 0 ? 'N/A' : normalizedRating.toFixed(1)}
        </span>
      </div>
    </div>
  );
}