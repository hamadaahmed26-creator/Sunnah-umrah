// Real landmark photos for the Umrah app.
// Mix of Wikimedia Commons (Special:FilePath redirects to the actual file) and Unsplash.

export const PHOTO = {
  blackStone:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Hajre_Aswad.jpg?width=900",
  maqamIbrahim:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Maqam_Ibrahim,_Makkah.jpg?width=900",
  safa:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Mount_Safa_Mecca.jpg?width=900",
  // Wide Mataf shot of pilgrims circling the Ka'bah
  mataf:
    "https://images.unsplash.com/photo-1591604157118-b94e2684f857?crop=entropy&cs=srgb&fm=jpg&q=80&w=900",
  // Ka'bah close-up showing the corner area (used for Yemeni Corner card)
  kaabaCorner:
    "https://images.unsplash.com/photo-1719194981461-fa0ec450999e?crop=entropy&cs=srgb&fm=jpg&q=80&w=900",
  // Mas'a corridor / Sa'i walkway
  masaa:
    "https://images.unsplash.com/photo-1591375631710-93b3a39e0852?crop=entropy&cs=srgb&fm=jpg&q=80&w=900",
  // Marwah hill view (using a generic Mas'a interior shot)
  marwah:
    "https://images.unsplash.com/photo-1652882697618-7ddca08b15bf?crop=entropy&cs=srgb&fm=jpg&q=80&w=900",
  // Ihram garments
  ihram:
    "https://images.unsplash.com/photo-1591604157118-b94e2684f857?crop=entropy&cs=srgb&fm=jpg&q=80&w=900",
  // Zamzam fountains
  zamzam:
    "https://images.unsplash.com/photo-1591375631710-93b3a39e0852?crop=entropy&cs=srgb&fm=jpg&q=80&w=900",
};

export function PhotoCard({ src, alt, badge, overlay, height = "h-56" }) {
  return (
    <div className={`relative w-full ${height} rounded-3xl overflow-hidden bg-[#1C1D1B]`} data-testid="photo-card">
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
      {badge && (
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[11px] font-semibold tracking-wide text-[#1C1D1B]">
          {badge}
        </div>
      )}
      {overlay && (
        <div className="absolute bottom-3 left-4 right-4 text-white">
          {overlay}
        </div>
      )}
    </div>
  );
}
