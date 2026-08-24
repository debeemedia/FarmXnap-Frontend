// Farmer / Plant / Wheat Icon
export function PlantIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 20h10" />
      <path d="M12 20v-8" />
      <path d="M12 12c-3-2.5-7-2-8 2 3.5 1 7.5-.5 8-2Z" />
      <path d="M12 12c3-2.5 7-2 8 2-3.5 1-7.5-.5-8-2Z" />
      <path d="M12 7c-2-2-5-1.5-6 1.5 2.5.5 5.5-.5 6-1.5Z" />
      <path d="M12 7c2-2 5-1.5 6 1.5-2.5.5-5.5-.5-6-1.5Z" />
    </svg>
  );
}

// Agrodealer / Store / Marketplace Icon
export function StoreIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20v5H2z" />
    </svg>
  );
}

// Arrow Left Icon for Back Navigation
export function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
