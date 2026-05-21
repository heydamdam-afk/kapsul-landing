import { CSSProperties } from "react";
import gallScreen from "@/assets/phone-gallery-screen.png";


interface Props {
  accent?: string;
  accentLight?: string;
}

const FeedItem = ({
  avatar,
  avatarColor,
  name,
  action,
  time,
  likes,
  accent,
}: {
  avatar: string;
  avatarColor: string;
  name: string;
  action: string;
  time: string;
  likes: number | null;
  accent: string;
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #F4F6F8" }}>
    <div style={{ width: 28, height: 28, borderRadius: "50%", background: avatarColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: '"Public Sans", sans-serif', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{avatar}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 11, color: "#212B36", lineHeight: 1.3 }}>
        <span style={{ fontWeight: 600 }}>{name}</span> <span style={{ color: "#637381" }}>{action}</span>
      </div>
      <div style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 9, color: "#919EAB", marginTop: 1 }}>{time}</div>
    </div>
    {likes !== null && (
      <div style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 10, color: accent, fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
        <span>♥</span>
        <span>{likes}</span>
      </div>
    )}
  </div>
);

export const PhoneMockup = ({ accent = "#FF4842", accentLight = "rgba(255,72,66,0.10)" }: Props) => {
  const photoTiles = [
    { bg: "linear-gradient(135deg, #FFD9C9 0%, #FFB199 100%)" },
    { bg: "linear-gradient(135deg, #C9E4FF 0%, #A0CBF5 100%)" },
    { bg: "linear-gradient(135deg, #FFEFC9 0%, #F5D789 100%)" },
    { bg: "linear-gradient(135deg, #E0D4FF 0%, #B8A4F0 100%)" },
  ];

  const wrap: CSSProperties = {
    position: "relative",
    width: 320,
    maxWidth: "100%",
    margin: "0 auto",
    filter: "drop-shadow(0 30px 60px rgba(33,43,54,0.18)) drop-shadow(0 8px 20px rgba(33,43,54,0.08))",
  };

  return (
    <div style={wrap}>
      <div style={{ background: "#212B36", borderRadius: 44, padding: 10, position: "relative" }}>
        <div style={{ background: "#212B36", borderRadius: 36, overflow: "hidden", position: "relative", aspectRatio: "9 / 18.5" }}>
          <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", width: 90, height: 22, background: "#212B36", borderRadius: 14, zIndex: 10 }} />
          <img src={gallScreen} alt="Aperçu galerie Kapsul" style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" }} />
        </div>


      </div>

      <div style={{ position: "absolute", top: 80, right: -30, background: "#fff", borderRadius: 14, padding: "10px 14px", boxShadow: "0 12px 30px rgba(33,43,54,0.15)", display: "flex", alignItems: "center", gap: 10, animation: "kapsulFloat 3s ease-in-out infinite" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #00AB55, #00D26A)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: '"Public Sans", sans-serif', fontWeight: 700, fontSize: 14 }}>✓</div>
        <div style={{ fontFamily: '"Public Sans", sans-serif' }}>
          <div style={{ fontSize: 11, color: "#637381", lineHeight: 1 }}>+12 photos</div>
          <div style={{ fontSize: 12, color: "#212B36", fontWeight: 600, marginTop: 2 }}>uploadées</div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 60, left: -36, background: "#fff", borderRadius: 14, padding: 10, boxShadow: "0 12px 30px rgba(33,43,54,0.15)", animation: "kapsulFloat 3s ease-in-out infinite 1.5s" }}>
        <div style={{ width: 60, height: 60, background: `repeating-conic-gradient(#212B36 0 25%, #fff 0 50%) 50% / 8px 8px`, borderRadius: 6, border: "2px solid #212B36" }} />
        <div style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 9, color: "#637381", textAlign: "center", marginTop: 6, fontWeight: 600 }}>QR · scan</div>
      </div>
    </div>
  );
};
