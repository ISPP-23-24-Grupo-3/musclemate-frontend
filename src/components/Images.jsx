import React from "react";
import { parseImageURL } from "../utils/functions/images";

export function EquipmentImage({ equipment, className }) {
  const url = equipment.image && parseImageURL(equipment.image);
  if (!url) return <PlaceholderImage className={className} />;
  return (
    <span className={`overflow-hidden ${className}`}>
      <img src={url} alt={equipment.name} />
    </span>
  );
}

export function PlaceholderImage({ className }) {
  return (
    <span
      className={`flex items-center justify-center size-12 bg-white p-2 ${className} `}
    >
      <img src="/MuscleMateLogo.svg" alt="Logo" className="contrast-0" />
    </span>
  );
}
