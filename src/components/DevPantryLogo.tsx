import React, { useId } from 'react';

interface DevPantryLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export const DevPantryLogo: React.FC<DevPantryLogoProps> = ({
  size = 24,
  className = '',
  ...props
}) => {
  const rawId = useId();
  const id = rawId.replace(/:/g, '');
  const topGradId = `dp-top-${id}`;
  const leftGradId = `dp-left-${id}`;
  const ribbonGradId = `dp-ribbon-${id}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      width={size}
      height={size}
      className={className}
      aria-label="DevPantry Logo"
      role="img"
      {...props}
    >
      <defs>
        {/* Top Face Gradient: Sky Cyan to Electric Azure */}
        <linearGradient
          id={topGradId}
          x1="120"
          y1="90"
          x2="340"
          y2="170"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="60%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        {/* Left Face Gradient: Electric Royal Blue */}
        <linearGradient
          id={leftGradId}
          x1="70"
          y1="210"
          x2="230"
          y2="440"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        {/* Ribbon Loop Gradient: Azure to Royal Cobalt to Deep Indigo */}
        <linearGradient
          id={ribbonGradId}
          x1="320"
          y1="70"
          x2="280"
          y2="440"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="25%" stopColor="#3B82F6" />
          <stop offset="65%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#3730A3" />
        </linearGradient>
      </defs>

      {/* Top Isometric Face */}
      <path
        d="M 342.0 95.0 C 329.5 84.0, 282.2 62.3, 267.0 55.0 C 251.8 47.7, 256.7 51.7, 251.0 51.0 C 245.3 50.3, 240.2 49.7, 233.0 51.0 C 225.8 52.3, 232.7 46.8, 208.0 59.0 C 183.3 71.2, 107.3 111.7, 85.0 124.0 C 62.7 136.3, 76.0 129.8, 74.0 133.0 C 72.0 136.2, 71.7 139.5, 73.0 143.0 C 74.3 146.5, 65.2 144.7, 82.0 154.0 C 98.8 163.3, 157.8 191.5, 174.0 199.0 C 190.2 206.5, 157.7 209.3, 179.0 199.0 C 200.3 188.7, 280.0 147.0, 302.0 137.0 C 324.0 127.0, 304.3 141.7, 311.0 139.0 C 317.7 136.3, 336.8 128.3, 342.0 121.0 C 347.2 113.7, 354.5 106.0, 342.0 95.0 Z"
        fill={`url(#${topGradId})`}
      />

      {/* Left Isometric Face */}
      <path
        d="M 73.0 206.0 C 70.7 207.5, 69.2 189.5, 68.0 213.0 C 66.8 236.5, 65.3 321.8, 66.0 347.0 C 66.7 372.2, 68.2 358.5, 72.0 364.0 C 75.8 369.5, 64.8 365.5, 89.0 380.0 C 113.2 394.5, 193.8 438.8, 217.0 451.0 C 240.2 463.2, 225.7 453.5, 228.0 453.0 C 230.3 452.5, 230.5 475.7, 231.0 448.0 C 231.5 420.3, 231.5 315.3, 231.0 287.0 C 230.5 258.7, 229.5 280.7, 228.0 278.0 C 226.5 275.3, 246.3 283.3, 222.0 271.0 C 197.7 258.7, 106.8 214.8, 82.0 204.0 C 57.2 193.2, 75.3 204.5, 73.0 206.0 Z"
        fill={`url(#${leftGradId})`}
      />

      {/* Ribbon Loop (D-Curve) */}
      <path
        d="M 343.0 96.0 C 334.0 94.8, 348.3 113.7, 343.0 121.0 C 337.7 128.3, 314.0 135.5, 311.0 140.0 C 308.0 144.5, 320.0 144.0, 325.0 148.0 C 330.0 152.0, 335.8 156.7, 341.0 164.0 C 346.2 171.3, 352.7 183.3, 356.0 192.0 C 359.3 200.7, 360.2 199.0, 361.0 216.0 C 361.8 233.0, 363.2 276.0, 361.0 294.0 C 358.8 312.0, 353.0 316.0, 348.0 324.0 C 343.0 332.0, 347.0 331.0, 331.0 342.0 C 315.0 353.0, 265.0 370.5, 252.0 390.0 C 239.0 409.5, 232.3 458.2, 253.0 459.0 C 273.7 459.8, 352.3 407.8, 376.0 395.0 C 399.7 382.2, 387.2 389.2, 395.0 382.0 C 402.8 374.8, 415.3 363.5, 423.0 352.0 C 430.7 340.5, 437.5 322.5, 441.0 313.0 C 444.5 303.5, 443.7 310.2, 444.0 295.0 C 444.3 279.8, 445.0 241.7, 443.0 222.0 C 441.0 202.3, 436.0 188.5, 432.0 177.0 C 428.0 165.5, 424.8 161.2, 419.0 153.0 C 413.2 144.8, 409.7 137.5, 397.0 128.0 C 384.3 118.5, 352.0 97.2, 343.0 96.0 Z"
        fill={`url(#${ribbonGradId})`}
      />
    </svg>
  );
};
