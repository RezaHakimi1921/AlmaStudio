import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Apple Alma mark — never Next.js default "N" */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F8F3ED",
        }}
      >
        <svg width="46" height="46" viewBox="0 0 64 64">
          <path
            d="M32 14c4.5-8 12.5-9.5 16-8.5-3.5 4.5-3.5 9-1 12.5 7 3.5 12.5 11.5 12.5 20.5C59.5 51 49 61 32 61S4.5 51 4.5 38.5c0-9 5.5-17 12.5-20.5 2.5-3.5 2.5-8-1-12.5C19.5 4.5 27.5 6 32 14z"
            fill="#A83232"
          />
          <path
            d="M32 14c0-6 4.5-10.5 9-12-1.5 6-4.5 9.5-9 12z"
            fill="#58745A"
          />
        </svg>
      </div>
    ),
    size,
  );
}
