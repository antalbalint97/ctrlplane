import { ImageResponse } from "next/og";

export const alt = "CtrlPlane — AI, adatmunka és szervezeti intelligencia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 82px",
        background: "#07111f",
        color: "#f5f7fa",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ color: "#62d9d1", fontSize: 28, letterSpacing: 6 }}>CTRLPLANE</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.05 }}>
          AI, adatmunka és szervezeti intelligencia
        </div>
        <div style={{ color: "#aab7c4", fontSize: 27 }}>ctrplane.com</div>
      </div>
    </div>,
    size,
  );
}
