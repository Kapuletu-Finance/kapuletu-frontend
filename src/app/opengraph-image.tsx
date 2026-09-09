import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "KapuLetu Treasury | Automated Community Financial Ledger";
export const size = {
  height: 630,
  width: 1200,
};

export const contentType = "image/png";

const Image = async () => {
  const logoData = await fetch(
    new URL("../../public/shared/kapuletu-logo.png", import.meta.url),
  ).then((res) => res.arrayBuffer());

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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {/* biome-ignore lint: standard img tag required for ImageResponse */}
      <img
        src={logoData as unknown as string}
        alt="KapuLetu Logo"
        style={{ objectFit: "contain", width: "800px" }}
      />
    </div>,
    {
      ...size,
    },
  );
};

export default Image;
