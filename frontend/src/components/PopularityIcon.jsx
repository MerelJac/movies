import { Heart } from "lucide-react";
import React from "react";

export default function PopularityIcon({ popularity }) {
  const percentage = popularity ? popularity.toFixed(1) : "-";
  return (
    <div className="flex flex-row gap-2 items-center" title="Popularity rating">
      <Heart size={16} color="red" />
      <p className="mb-0">{percentage}</p>
    </div>
  );
}
