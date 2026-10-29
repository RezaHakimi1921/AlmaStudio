import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

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
          borderRadius: 14,
        }}
      >
        <div
          style={{
            width: 40,
            height: 44,
            background: "#A83232",
            borderRadius: "45% 45% 48% 48%",
            position: "relative",
            display: "flex",
          }}
        />
      </div>
    ),
    size,
  );
}
