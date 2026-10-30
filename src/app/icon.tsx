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
          <path d="M32 21C27 14 11 15 7.5 32 4.5 47 15.5 61 25.5 60.5 29 60.3 30.5 58.8 32 58.8S35 60.3 38.5 60.5C48.5 61 59.5 47 56.5 32 53 15 37 14 32 21Z" fill="#A83232" />
          <path d="M32 22C32.5 15 34.5 10 38 6" fill="none" stroke="#5B3A29" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M35.5 14.5C37 8 44 5 51 6.5 49.5 13 43 17 35.5 14.5Z" fill="#58745A" />
        </svg>
      </div>
    ),
    size,
  );
}
