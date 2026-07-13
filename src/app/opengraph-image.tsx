import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "KapuLetu Treasury | Automated Community Financial Ledger";
export const size = {
  height: 630,
  width: 1200,
};

export const contentType = "image/png";

const Image = async () => {
  const logoData = await fetch(new URL("../../public/shared/logo.png", import.meta.url)).then(
    (res) => res.arrayBuffer(),
  );

  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "white",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "#097255",
            fontSize: 150,
            fontWeight: 800,
            letterSpacing: "-0.04em",
          }}
        >
          Kap
        </span>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            margin: "0 20px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* biome-ignore lint: standard img tag required for ImageResponse */}
          <img
            src={logoData as unknown as string}
            alt="KapuLetu Logo"
            style={{ height: "140px", objectFit: "contain", width: "140px" }}
          />
        </div>
        <span
          style={{
            color: "#1B4580",
            fontSize: 150,
            fontWeight: 800,
            letterSpacing: "-0.04em",
          }}
        >
          Letu
        </span>
      </div>
    </div>,
    {
      ...size,
    },
  );
};

export default Image;
