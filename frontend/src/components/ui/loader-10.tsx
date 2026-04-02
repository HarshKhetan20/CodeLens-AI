import * as React from "react";
import { cn } from "../../lib/utils";

export interface GooeyLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The primary color for the goo effect. Defaults to shadcn's primary color. */
  primaryColor?: string;
  /** The secondary color for the goo effect. Defaults to shadcn's secondary color. */
  secondaryColor?: string;
  /** The color for the bottom border. Defaults to shadcn's border color. */
  borderColor?: string;
}

const GooeyLoader = React.forwardRef<HTMLDivElement, GooeyLoaderProps>(
  ({ className, primaryColor, secondaryColor, borderColor, ...props }, ref) => {
    // CSS variables for dynamic styling.
    const style = {
      "--gooey-primary-color": primaryColor || "var(--primary)",
      "--gooey-secondary-color": secondaryColor || "var(--secondary)",
      "--gooey-border-color": borderColor || "var(--border)",
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={cn("relative flex items-center justify-center text-sm", className)}
        style={style}
        role="status"
        aria-label="Loading"
        {...props}
      >
        {/* SVG filter for the gooey effect */}
        <svg className="absolute w-0 h-0">
          <defs>
            <filter id="gooey-loader-filter">
              <feGaussianBlur in="SourceGraphic" stdDeviation={12} result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 48 -7"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>

        {/* Embedded styles for complex animations and pseudo-elements that are not
          achievable with standard Tailwind classes. Using CSS variables makes them theme-aware.
        */}
        <style>
          {`
            .gooey-loader {
              width: 14em;
              height: 4em;
              position: relative;
              overflow: hidden;
              border-radius: 2em;
              background-color: var(--gooey-border-color); /* Subtle background map */
              border: 1px solid rgba(255, 255, 255, 0.1);
              filter: url(#gooey-loader-filter);
              box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
            }

            .gooey-loader::before,
            .gooey-loader::after {
              content: '';
              position: absolute;
              border-radius: 40%; /* Custom shape to simulate organic waves when rotated */
            }

            .gooey-loader::before {
              width: 30em;
              height: 30em;
              background-color: var(--gooey-primary-color);
              left: -8em;
              bottom: -28em;
              animation: gooey-loader-wee1 3s linear infinite;
              opacity: 0.9;
            }

            .gooey-loader::after {
              width: 30em;
              height: 30em;
              background-color: var(--gooey-secondary-color);
              left: -8em;
              bottom: -28em;
              animation: gooey-loader-wee2 4s linear infinite;
              opacity: 0.8;
            }

            @keyframes gooey-loader-wee1 {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }

            @keyframes gooey-loader-wee2 {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(-360deg); }
            }
          `}
        </style>

        {/* The loader element that the styles target */}
        <div className="gooey-loader" />
      </div>
    );
  }
);
GooeyLoader.displayName = "GooeyLoader";

export { GooeyLoader };
