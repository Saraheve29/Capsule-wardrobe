import { useState, useEffect } from "react";

/* ─────────────────────────────────────────────
   Capsule Wardrobe 👗 — Sarah's pink wardrobe
   & holiday packing companion
   ───────────────────────────────────────────── */

const C = {
  bg: "#FDF1F6",
  card: "#FFFFFF",
  border: "#F6D3E2",
  pink: "#E75B8D",
  deepPink: "#C93A70",
  berry: "#6B2145",
  ink: "#4A2338",
  sub: "#A26784",
  blushSoft: "#FCE4EE",
  gold: "#F2B95C",
  skyTop: "#5C2244",
  skyMid: "#D95C8C",
  skyLow: "#FFC9D8",
  green: "#5FA86B",
};

const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Quicksand:wght@400;500;600;700&display=swap');
* { -webkit-tap-highlight-color: transparent; }
input::placeholder { color: #C99AB2; }
`;

const fontScript = "'Great Vibes', 'Brush Script MT', cursive";
const fontBody = "'Quicksand', 'Trebuchet MS', sans-serif";

/* ── storage ─────────────────────────────────── */

function load(key, fallback) {
  try {
    const r = localStorage.getItem(`capsule:${key}`);
    return r ? JSON.parse(r) : fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(`capsule:${key}`, JSON.stringify(value));
  } catch (e) {
    console.error("storage error", e);
  }
}
function usePersisted(key, fallback) {
  const [v, setV] = useState(() => load(key, fallback));
  useEffect(() => save(key, v), [key, v]);
  return [v, setV];
}

/* ── seasons ─────────────────────────────────── */

const SEASONS = [
  { id: "spring", name: "Spring", emoji: "🌷", colours: "Green & Yellow", word: "green or yellow", swatches: ["#7DBE6B", "#F4D35E", "#2B2B2B", "#FFFFFF"], warm: true, base: "+ black & white" },
  { id: "summer", name: "Summer", emoji: "🌸", colours: "Pink & Blue", word: "pink or blue", swatches: ["#F28DB2", "#7FB3E6", "#2B2B2B", "#FFFFFF"], warm: true, base: "+ black & white" },
  { id: "autumn", name: "Autumn", emoji: "🍂", colours: "Camel & Brown", word: "camel or brown", swatches: ["#C69C6D", "#7B4B2A", "#2B2B2B", "#FFFFFF"], warm: false, base: "+ black (white optional)" },
  { id: "winter", name: "Winter", emoji: "❄️", colours: "Pink & Grey", word: "pink or grey", swatches: ["#F28DB2", "#9AA0A8", "#2B2B2B", "#FFFFFF"], warm: false, base: "+ black (white optional)" },
];

function seasonForToday() {
  const m = new Date().getMonth(); // 0 = Jan
  if (m >= 2 && m <= 4) return "spring";
  if (m >= 5 && m <= 7) return "summer";
  if (m >= 8 && m <= 10) return "autumn";
  return "winter";
}

const it = (id, label, extra = {}) => ({ id, label, ...extra });
const opt = (id, label) => it(id, label, { optional: true });
const extraSlot = () => it("extra", "Extra — only if it fills a real gap", { extra: true });

function buildCategories(s) {
  const sc = `Season colour (${s.word})`;
  const accent = s.id === "autumn" ? "Camel or brown" : "Grey";
  const [c1, c2] = s.colours.split(" & ");
  const cats = [];

  if (s.warm) {
    /* ── SPRING / SUMMER — lighter clothes, washed after most wears ── */
    cats.push(
      {
        id: "trousers", icon: "👖", title: "Trousers", rule: "3 + 1 for chilly spring days · shorts & dresses do most of the work",
        items: [
          it("tn1", "Black (lightweight)"),
          it("tn3", "Dark denim or white"),
          it("t1", sc),
          opt("h1", "Heavier denim — for chilly spring days"),
          extraSlot(),
        ],
      },
      {
        id: "tops", icon: "👕", title: "Tops", rule: "9 tops · mostly short sleeve",
        items: [
          it("s1", sc), it("s2", sc), it("s3", sc),
          it("ws1", "White short sleeve"), it("ws2", "White short sleeve"),
          it("bs1", "Black short sleeve"), it("bs2", "Black short sleeve"),
          it("wl1", "White long sleeve"),
          it("bl1", "Black long sleeve"),
          extraSlot(),
        ],
      },
      {
        id: "shorts", icon: "🩳", title: "Shorts", rule: "3 shorts",
        items: [it("b", "Black"), it("s", sc), it("w", "White or denim"), extraSlot()],
      },
      {
        id: "dresses", icon: "👗", title: "Dresses", rule: "3, up to 4",
        items: [it("s1", sc), it("s2", sc), it("n1", "Black or white"), opt("n2", "Black or white"), extraSlot()],
      },
      {
        id: "cardigan", icon: "🧶", title: "Cardigan", rule: "Just one for cooler evenings",
        items: [it("c", "Cardigan — black, white or season colour"), extraSlot()],
      },
      {
        id: "jacket", icon: "🧥", title: "Light jacket", rule: "For chilly spring days",
        items: [it("j", "Light jacket — denim or light trench"), extraSlot()],
      }
    );
  } else {
    /* ── AUTUMN / WINTER — heavier layers, worn 2–3 times between washes ── */
    cats.push(
      {
        id: "trousers", icon: "👖", title: "Trousers", rule: "4 trousers · each worn 2–3 times between washes",
        items: [
          it("tn1", "Black"),
          it("tn3", "Dark denim"),
          it("t1", `${accent} — season colour`),
          it("tw", "Warm pair — thick black, fleece-lined or cords"),
          extraSlot(),
        ],
      },
      {
        id: "tops", icon: "👕", title: "Tops", rule: "7 tops + 1 flex · mostly long sleeve, worn under jumpers",
        items: [
          it("s1", `${c1} top`), it("s2", `${c2} top`), opt("s4", `${c1} or ${c2.toLowerCase()} top — flex`),
          it("bl1", "Black long sleeve"), it("bl2", "Black long sleeve"),
          it("wl1", "White long sleeve"), it("cl1", "Cream or white long sleeve"),
          it("bs1", "Black short sleeve — for layering"),
          extraSlot(),
        ],
      },
      {
        id: "dresses", icon: "👗", title: "Dresses", rule: "Max 3 · wear with tights & boots",
        items: [
          it("wd1", "Black dress — long sleeve or jumper dress"),
          it("wd2", `${c1} or ${c2.toLowerCase()} dress`),
          it("wd3", "Grey, cream or white dress"),
          extraSlot(),
        ],
      },
      {
        id: "jumpers", icon: "🧶", title: "Jumpers", rule: "3, up to 4 · kept outside the drawers",
        items: [it("b1", "Black"), it("w1", "White or cream"), it("s", sc), opt("b2", "Black cardigan"), extraSlot()],
      },
      {
        id: "coats", icon: "🧥", title: "Coats", rule: "1 warm coat · season colour optional",
        items: [it("b", "Warm black coat"), opt("s", `${sc} coat`), extraSlot()],
      }
    );
  }

  cats.push(
    {
      id: "underwear", icon: "👙", title: "Underwear", rule: s.warm ? "5 bras · 5 knickers · 6 socks" : "5 bras · 5 knickers · 6 socks · tights",
      items: [
        it("bb1", "Black bra"), it("bb2", "Black bra"),
        it("wb1", "White bra"), it("wb2", "White bra"),
        it("sb", `Beige or ${s.word} bra`),
        it("k", "Knickers × 5"), it("so", "Socks × 6"),
        ...(s.warm ? [] : [it("ti", "Black tights × 2–3")]),
      ],
    },
    {
      id: "nightwear", icon: "🌙", title: s.warm ? "Nightwear & swimwear" : "Nightwear", rule: s.warm ? "2 nighties · 1 swimsuit" : "2 nighties / sleepwear",
      items: [
        it("n1", "Nightie / sleepwear"), it("n2", "Nightie / sleepwear"),
        ...(s.warm ? [it("sw", "Swimwear")] : []),
      ],
    },
    {
      id: "shoes", icon: "👟", title: "Shoes", rule: "3 pairs",
      items: s.warm
        ? [it("sl1", "Sliders or sandals"), it("tr", "Comfy trainers — black or white"), it("s", sc), opt("bk1", "Black shoes"), extraSlot()]
        : [it("bt1", "Black boots"), it("tr", "Comfy trainers — black or white"), opt("s", sc), opt("bt2", "Black shoes"), extraSlot()],
    },
    {
      id: "bags", icon: "👜", title: "Bags", rule: "3 bags",
      items: [it("sb", "Small black bag"), it("r", "Neutral / black rucksack"), it("s1", sc), extraSlot()],
    }
  );
  return cats;
}

/* ── packing defaults ────────────────────────── */

const mk = (prefix, title, icon, items, note) => ({
  id: prefix,
  title,
  icon,
  note,
  items: items.map((text, i) => ({ id: `${prefix}-${i}`, text })),
});

const RUCKSACK = (p) => [
  mk(`${p}-docs`, "Documents & keys", "🛂", ["Passports", "Keys + front/back door lock"]),
  mk(`${p}-tech`, "Tech & entertainment", "📱", ["My phone", "Maleeka's phone/tablet", "2 power banks", "1 charger", "2 headphones 🎧"]),
  mk(`${p}-small`, "Rucksack — personal bits", "🎒", [
    "Small makeup bag (travel-size only)", "Lip balm", "Vape and 2 capsules", "Autism necklace + ear defenders",
    "Hair brush", "Detangling spray", "Hair bands", "Feminine care",
  ], "No snacks, no meds, no liquids over 100ml"),
];

const TOILETRIES = (p) =>
  mk(`${p}-toil`, "Toiletries & personal", "🧴", [
    "Folding mirror", "Deodorant", "Small Nivea cream", "Toothbrush + toothpaste", "Hairbrush", "1 shaver",
    "Hairbands", "Tanning cream", "Feminine care", "Vitamins", "Towel",
  ]);

const DEFAULT_PACKING = {
  summer: [
    ...RUCKSACK("su"),
    mk("su-me", "My clothes", "👚", [
      "2 shorts", "1 light trousers", "1 heavier trousers (worn for travel)",
      "White long sleeve top", "Black long sleeve top (either worn)", "Black short sleeve top", "White short sleeve top", "Season colour short sleeve top",
      "2 dresses", "2 layers (1 worn)", "1 black bra", "1 white bra", "Nightie / sleepwear",
      "2 pairs shoes (1 worn with warm socks, 1 packed)",
    ]),
    mk("su-mal", "Maleeka's clothes", "🎀", [
      "3 short sleeve tops", "1 long sleeve (worn)", "2 shorts", "1 light trousers", "1 heavier trousers (worn)",
      "1 jumper (worn)", "2 light dresses", "2 shoes (1 worn)", "Underwear", "Swimwear", "Light pyjamas / nightie",
    ]),
    TOILETRIES("su"),
    mk("su-extra", "Extras", "✨", [
      "Empty water bottle", "2 sunglasses", "Plastic bag", "Foldable picker (if enough space)", "Chargers for both (2)",
      "International plugs × 2", "Stool", "Folding deck chair", "Folding phone stand", "Pyjamas", "Maleeka's nightie", "3 beauty treatments",
    ]),
  ],
  winter: [
    ...RUCKSACK("wi"),
    mk("wi-me", "My clothes", "🧥", [
      "3 trousers (wear 1)", "Black long sleeve top", "White long sleeve top (any worn)", "Season colour short sleeve top",
      "1 jumper (worn)", "1 jumper", "1 black bra", "1 white bra", "Nightie / sleepwear", "2 pairs shoes (1 worn, 1 packed)",
    ]),
    mk("wi-mal", "Maleeka's clothes", "🎀", [
      "3 trousers (wear 1)", "Black long sleeve top", "White long sleeve top (any worn)", "Season colour short sleeve top",
      "1 jumper (worn)", "4 knickers", "3 pairs socks", "Nightie / sleepwear", "1 pair shoes",
    ]),
    TOILETRIES("wi"),
    mk("wi-extra", "Extras", "✨", ["Sunglasses", "Foldable picker (if enough space)", "Chargers for both (2)"]),
  ],
  light: [
    mk("li-me", "My clothes", "👚", [
      "1 light trousers (black or white)", "1 top black or white", "1 top colour", "1 dress black or white", "1 dress colour", "1 shorts", "Cardigan (if cold)", "Coat (if cold)",
    ], "Wear one of these, plus a cardigan and coat if cold"),
    mk("li-mal", "Maleeka's clothes", "🎀", ["1 light trousers", "2 tops", "2 dresses", "1 shorts"], "Any one of these worn"),
    mk("li-tech", "Tech & entertainment", "📱", [
      "My phone", "Maleeka's phone/tablet", "2 power banks", "2 chargers", "2 headphones 🎧", "International plugs × 2", "Watch + watch charger",
    ]),
    mk("li-pers", "Personal bits", "🎒", [
      "Small bag", "Small makeup bag (travel-size only)", "Lip balm", "Vape and 2 capsules", "Autism necklace + ear defenders",
      "Hair brush", "Detangling spray", "Hair bands", "Make up remover", "Folding mirror", "Deodorant", "Small Nivea cream",
      "Toothbrush + toothpaste", "1 shaver", "Tanning cream", "Feminine care", "Vitamins",
    ]),
    mk("li-beach", "Beach", "🏖️", ["Beach tent", "Folding beach chair", "Toy V"]),
    mk("li-extra", "Extras", "✨", [
      "Empty water bottle", "2 sunglasses", "Plastic bag", "Foldable picker (if enough space)", "Stool", "Folding deck chair",
      "Folding phone stand", "Pyjamas", "Maleeka's nightie", "3 beauty treatments",
    ]),
  ],
};

const TRIPS = [
  { id: "summer", label: "Spring / Summer", emoji: "☀️" },
  { id: "winter", label: "Autumn / Winter", emoji: "🧣" },
  { id: "light", label: "Light packing", emoji: "🪶" },
];

const TRAVEL_TIPS = [
  "Wear heavier clothes / jumper while travelling",
  "Roll clothes to save space",
  "Multi-purpose pieces that mix & match",
  "Travel-size toiletries only in the rucksack",
  "Makeup bag in rucksack, folding mirror in suitcase",
  "Wig optional — wear it while travelling if you like",
];

/* ── shared UI ───────────────────────────────── */

const btnBase = {
  fontFamily: fontBody,
  fontWeight: 700,
  fontSize: 15,
  border: "none",
  borderRadius: 999,
  padding: "12px 22px",
  cursor: "pointer",
};

function PinkButton({ children, onClick, ghost, small }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...btnBase,
        padding: small ? "8px 16px" : btnBase.padding,
        fontSize: small ? 13.5 : 15,
        background: ghost ? "transparent" : `linear-gradient(135deg, ${C.pink}, ${C.deepPink})`,
        color: ghost ? C.sub : "#fff",
        border: ghost ? `2px solid ${C.border}` : "none",
        boxShadow: ghost ? "none" : "0 6px 16px rgba(231,91,141,.3)",
      }}
    >
      {children}
    </button>
  );
}

function Card({ children, style }) {
  return (
    <div
      style={{
        background: C.card,
        border: `1.5px solid ${C.border}`,
        borderRadius: 24,
        padding: "18px 18px",
        boxShadow: "0 8px 22px rgba(231,91,141,.10)",
        marginBottom: 14,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardTitle({ icon, title, right, sub }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: sub ? 2 : 10 }}>
      <span style={{ fontSize: 24, lineHeight: 1 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 17.5, color: C.berry }}>{title}</div>
        {sub && <div style={{ fontSize: 13, color: C.sub, fontWeight: 600, margin: "2px 0 10px" }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

function Pill({ children }) {
  return (
    <span style={{ fontSize: 12.5, fontWeight: 700, color: C.deepPink, background: C.blushSoft, padding: "4px 10px", borderRadius: 999, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function Tick({ on, size = 26 }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: "50%",
        border: on ? "none" : `2px solid ${C.border}`,
        background: on ? `linear-gradient(135deg, ${C.pink}, ${C.deepPink})` : "#FFF8FB",
        color: "#fff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.55,
        fontWeight: 700,
        transition: "all .15s",
      }}
    >
      {on ? "✓" : ""}
    </span>
  );
}

function ProgressBar({ done, total }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div style={{ background: C.blushSoft, borderRadius: 999, height: 10, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.pink}, ${C.deepPink})`, borderRadius: 999, transition: "width .3s" }} />
    </div>
  );
}

function TextInput({ value, onChange, placeholder, onEnter, autoFocus }) {
  return (
    <input
      value={value}
      autoFocus={autoFocus}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onEnter && onEnter()}
      placeholder={placeholder}
      style={{
        width: "100%",
        boxSizing: "border-box",
        fontFamily: fontBody,
        fontSize: 15,
        color: C.ink,
        background: "#FFF8FB",
        border: `2px solid ${C.border}`,
        borderRadius: 14,
        padding: "10px 14px",
        outline: "none",
      }}
    />
  );
}

/* ── turn into app (PWA install) ─────────────── */

let deferredInstallPrompt = null;
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    window.dispatchEvent(new Event("capsule-install-ready"));
  });
  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    window.dispatchEvent(new Event("capsule-installed"));
  });
}

const isStandalone = () =>
  (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

function InstallButton() {
  const [canPrompt, setCanPrompt] = useState(!!deferredInstallPrompt);
  const [installed, setInstalled] = useState(isStandalone());
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const ready = () => setCanPrompt(true);
    const done = () => { setInstalled(true); setCanPrompt(false); };
    window.addEventListener("capsule-install-ready", ready);
    window.addEventListener("capsule-installed", done);
    return () => {
      window.removeEventListener("capsule-install-ready", ready);
      window.removeEventListener("capsule-installed", done);
    };
  }, []);

  if (installed) return null;

  const install = async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      setCanPrompt(false);
      if (outcome === "accepted") setInstalled(true);
    } else {
      setShowHelp((s) => !s);
    }
  };

  return (
    <div style={{ position: "relative", marginTop: 12 }}>
      <button
        onClick={install}
        style={{
          fontFamily: fontBody,
          fontWeight: 700,
          fontSize: 13.5,
          color: "#fff",
          background: "rgba(255,255,255,.22)",
          border: "1.5px solid rgba(255,255,255,.6)",
          borderRadius: 999,
          padding: "7px 16px",
          cursor: "pointer",
        }}
      >
        📲 Turn into app
      </button>
      {showHelp && !canPrompt && (
        <div
          style={{
            margin: "10px auto 0",
            maxWidth: 300,
            background: "#fff",
            color: C.ink,
            borderRadius: 16,
            padding: "12px 14px",
            fontSize: 13.5,
            fontWeight: 600,
            lineHeight: 1.5,
            textAlign: "left",
            boxShadow: "0 6px 16px rgba(107,33,69,.25)",
          }}
        >
          {isIos() ? (
            <>On iPhone: tap the <b>Share</b> button <b>⬆️</b> in Safari, then <b>Add to Home Screen</b> 💗</>
          ) : (
            <>Tap the browser menu <b>⋮</b> at the top right, then <b>Install app</b> or <b>Add to Home screen</b> 💗</>
          )}
        </div>
      )}
    </div>
  );
}

/* ── header ──────────────────────────────────── */

function Header({ title, subtitle }) {
  return (
    <div
      style={{
        borderRadius: 28,
        overflow: "hidden",
        background: `linear-gradient(180deg, ${C.skyTop} 0%, ${C.skyMid} 62%, ${C.skyLow} 100%)`,
        boxShadow: "0 10px 30px rgba(107,33,69,.25)",
        position: "relative",
        marginBottom: 18,
        padding: "22px 16px 20px",
        textAlign: "center",
        color: "#fff",
      }}
    >
      <span style={{ position: "absolute", top: 16, left: 20, fontSize: 15, opacity: 0.85 }}>✨</span>
      <span style={{ position: "absolute", top: 26, right: 22, fontSize: 13, opacity: 0.75 }}>✨</span>
      <span style={{ position: "absolute", top: 46, left: 58, fontSize: 10, opacity: 0.6 }}>✨</span>
      <svg viewBox="0 0 64 40" width="56" height="35" style={{ display: "block", margin: "0 auto 4px" }}>
        <path d="M32 8 a5 5 0 1 1 5 -5" fill="none" stroke={C.gold} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M32 8 L32 13 L4 32 Q2 35 6 35 L58 35 Q62 35 60 32 L32 13" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div style={{ fontFamily: fontScript, fontSize: 36, lineHeight: 1.1, textShadow: "0 2px 8px rgba(0,0,0,.2)" }}>{title}</div>
      <div style={{ fontFamily: fontBody, fontSize: 13, fontWeight: 600, opacity: 0.92, marginTop: 4 }}>{subtitle}</div>
      <InstallButton />
    </div>
  );
}

/* ── WARDROBE ────────────────────────────────── */

function SeasonPicker({ active, onPick }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
      {SEASONS.map((s) => {
        const on = s.id === active;
        return (
          <button
            key={s.id}
            onClick={() => onPick(s.id)}
            style={{
              fontFamily: fontBody,
              textAlign: "left",
              cursor: "pointer",
              borderRadius: 20,
              padding: "12px 14px",
              border: on ? `2.5px solid ${C.pink}` : `1.5px solid ${C.border}`,
              background: on ? "#FFF6FA" : C.card,
              boxShadow: on ? "0 6px 16px rgba(231,91,141,.22)" : "none",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 16, color: C.berry }}>
              {s.emoji} {s.name}
            </div>
            <div style={{ fontSize: 12.5, color: C.sub, fontWeight: 600, margin: "2px 0 7px" }}>{s.colours}</div>
            <div style={{ display: "flex", gap: 5 }}>
              {s.swatches.map((c) => (
                <span key={c} style={{ width: 16, height: 16, borderRadius: "50%", background: c, border: "1.5px solid rgba(0,0,0,.12)" }} />
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function DeleteBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Delete item"
      style={{ background: C.blushSoft, color: C.deepPink, border: "none", borderRadius: "50%", width: 30, height: 30, minWidth: 30, fontWeight: 700, fontSize: 16, cursor: "pointer" }}
    >
      ×
    </button>
  );
}

function SmallPinkBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ ...btnBase, padding: "8px 16px", fontSize: 14, background: `linear-gradient(135deg, ${C.pink}, ${C.deepPink})`, color: "#fff", whiteSpace: "nowrap" }}>
      {children}
    </button>
  );
}

function EditBar({ editing, setEditing, onRestore, restoreLabel }) {
  const [confirm, setConfirm] = useState(false);
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 12 }}>
      <PinkButton small ghost={!editing} onClick={() => { setEditing((e) => !e); setConfirm(false); }}>
        {editing ? "✓ Finished editing" : "✏️ Edit items"}
      </PinkButton>
      {editing && !confirm && (
        <PinkButton small ghost onClick={() => setConfirm(true)}>↺ {restoreLabel}</PinkButton>
      )}
      {editing && confirm && (
        <>
          <PinkButton small onClick={() => { onRestore(); setConfirm(false); }}>Yes, restore</PinkButton>
          <PinkButton small ghost onClick={() => setConfirm(false)}>Cancel</PinkButton>
        </>
      )}
    </div>
  );
}

/* wardrobe item row — tick, describe, and in edit mode rename / delete */
function ItemRow({ item, state, onChange, editing, onRename, onDelete, onToggleOptional }) {
  const [describing, setDescribing] = useState(false);
  const have = !!state?.have;
  const name = state?.name || "";

  if (editing) {
    return (
      <div style={{ padding: "9px 0", borderBottom: `1px dashed ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <TextInput value={item.label} onChange={onRename} placeholder="Item name" />
          <DeleteBtn onClick={onDelete} />
        </div>
        {!item.extra && (
          <button
            onClick={onToggleOptional}
            style={{ marginTop: 6, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: fontBody, fontSize: 13, fontWeight: 700, color: item.optional ? C.deepPink : C.sub }}
          >
            {item.optional ? "☑ Optional (not on the needed list)" : "☐ Make optional"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "9px 0", borderBottom: `1px dashed ${C.border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => onChange({ have: !have, name })} style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }} aria-label={have ? "Mark as needed" : "Mark as have"}>
          <Tick on={have} />
        </button>
        <button
          onClick={() => setDescribing((e) => !e)}
          style={{ flex: 1, textAlign: "left", background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: fontBody }}
        >
          <div style={{ fontSize: 15, fontWeight: 600, color: item.extra && !have ? C.sub : C.ink }}>
            {item.label}
            {item.optional && <span style={{ fontSize: 12, color: C.sub, fontWeight: 600 }}> · optional</span>}
          </div>
          {name && !describing && <div style={{ fontSize: 13.5, color: C.deepPink, fontStyle: "italic", marginTop: 1 }}>{name}</div>}
          {!name && !describing && <div style={{ fontSize: 12, color: "#C99AB2", marginTop: 1 }}>tap to describe it</div>}
        </button>
      </div>
      {describing && (
        <div style={{ display: "flex", gap: 8, marginTop: 8, marginLeft: 38 }}>
          <TextInput value={name} autoFocus onChange={(v) => onChange({ have, name: v })} onEnter={() => setDescribing(false)} placeholder="e.g. green linen tee" />
          <button onClick={() => setDescribing(false)} style={{ ...btnBase, padding: "8px 14px", fontSize: 13.5, background: C.blushSoft, color: C.deepPink }}>
            Done
          </button>
        </div>
      )}
    </div>
  );
}

function CategoryCard({ cat, seasonState, update, editing, editCat }) {
  const [open, setOpen] = useState(true);
  const [draft, setDraft] = useState("");
  const [draftOptional, setDraftOptional] = useState(false);
  const counted = cat.items.filter((i) => !i.extra);
  const done = counted.filter((i) => seasonState[`${cat.id}.${i.id}`]?.have).length;

  const setItems = (fn) => editCat({ ...cat, items: fn(cat.items) });
  const add = () => {
    if (!draft.trim()) return;
    setItems((items) => [...items, { id: `n${Date.now()}`, label: draft.trim(), optional: draftOptional }]);
    setDraft("");
    setDraftOptional(false);
  };

  return (
    <Card>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: fontBody, textAlign: "left" }}>
        <CardTitle
          icon={cat.icon}
          title={cat.title}
          sub={cat.rule}
          right={
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Pill>{done}/{counted.length}</Pill>
              <span style={{ color: C.sub, fontSize: 14 }}>{open ? "▾" : "▸"}</span>
            </span>
          }
        />
      </button>
      {open && cat.items.map((item) => {
        const key = `${cat.id}.${item.id}`;
        return (
          <ItemRow
            key={key}
            item={item}
            state={seasonState[key]}
            onChange={(v) => update(key, v)}
            editing={editing}
            onRename={(label) => setItems((items) => items.map((i) => (i.id === item.id ? { ...i, label } : i)))}
            onDelete={() => setItems((items) => items.filter((i) => i.id !== item.id))}
            onToggleOptional={() => setItems((items) => items.map((i) => (i.id === item.id ? { ...i, optional: !i.optional } : i)))}
          />
        );
      })}
      {open && editing && (
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <TextInput value={draft} onChange={setDraft} onEnter={add} placeholder={`Add to ${cat.title.toLowerCase()}…`} />
            <SmallPinkBtn onClick={add}>Add</SmallPinkBtn>
          </div>
          <button
            onClick={() => setDraftOptional((o) => !o)}
            style={{ marginTop: 6, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: fontBody, fontSize: 13, fontWeight: 700, color: draftOptional ? C.deepPink : C.sub }}
          >
            {draftOptional ? "☑ Add as optional" : "☐ Add as optional"}
          </button>
        </div>
      )}
    </Card>
  );
}

function NeededCard({ cats, seasonState, season }) {
  const needed = [];
  const optional = [];
  cats.forEach((cat) =>
    cat.items.forEach((i) => {
      if (i.extra) return;
      if (seasonState[`${cat.id}.${i.id}`]?.have) return;
      (i.optional ? optional : needed).push({ cat: cat.title, icon: cat.icon, label: i.label });
    })
  );
  const total = cats.reduce((n, c) => n + c.items.filter((i) => !i.extra && !i.optional).length, 0);
  const have = total - needed.length;

  const group = (list) => {
    const g = {};
    list.forEach((x) => {
      const k = `${x.icon} ${x.cat}`;
      g[k] = g[k] || {};
      g[k][x.label] = (g[k][x.label] || 0) + 1;
    });
    return g;
  };

  return (
    <Card style={{ background: "linear-gradient(180deg, #FFF6FA, #FCE4EE)" }}>
      <CardTitle icon="🛍️" title={`Anything needed for ${season.name}`} right={<Pill>{have}/{total}</Pill>} />
      <ProgressBar done={have} total={total} />
      {needed.length === 0 ? (
        <div style={{ textAlign: "center", padding: "14px 0 4px" }}>
          <div style={{ fontFamily: fontScript, fontSize: 30, color: C.deepPink }}>Complete!</div>
          <div style={{ fontSize: 14, color: C.sub, fontWeight: 600 }}>Your {season.name.toLowerCase()} capsule is all there 💗</div>
        </div>
      ) : (
        <div style={{ marginTop: 12 }}>
          {Object.entries(group(needed)).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.berry }}>{cat}</div>
              {Object.entries(items).map(([label, n]) => (
                <div key={label} style={{ fontSize: 14.5, color: C.ink, fontWeight: 500, padding: "2px 0 2px 8px" }}>
                  💗 {n > 1 ? `${n} × ` : ""}{label}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {optional.length > 0 && (
        <div style={{ marginTop: 8, fontSize: 13, color: C.sub, fontWeight: 600, lineHeight: 1.5 }}>
          Optional, if you'd use it: {optional.map((o) => `${o.label.replace(/ — flex/, "")} (${o.cat.toLowerCase()})`).join(" · ")}
        </div>
      )}
      <div style={{ marginTop: 10, fontSize: 12.5, color: C.sub, lineHeight: 1.5 }}>
        Only buy if you'll use it regularly, it matches your system and it fills a real gap.
      </div>
    </Card>
  );
}

function WardrobeTab() {
  const [seasonId, setSeasonId] = usePersisted("season", seasonForToday());
  const [all, setAll] = usePersisted("wardrobe", {});
  const [customCats, setCustomCats] = usePersisted("wardrobeLists", {});
  const [editing, setEditing] = useState(false);
  const season = SEASONS.find((s) => s.id === seasonId) || SEASONS[0];
  const cats = customCats[season.id] || buildCategories(season);
  const seasonState = all[season.id] || {};

  const update = (key, v) =>
    setAll((prev) => ({ ...prev, [season.id]: { ...(prev[season.id] || {}), [key]: v } }));

  const editCat = (newCat) =>
    setCustomCats((prev) => ({
      ...prev,
      [season.id]: (prev[season.id] || buildCategories(season)).map((c) => (c.id === newCat.id ? newCat : c)),
    }));

  const restore = () =>
    setCustomCats((prev) => {
      const next = { ...prev };
      delete next[season.id];
      return next;
    });

  return (
    <>
      <Header title="My Capsule Wardrobe" subtitle="Everything mixes · no duplicates · no “just okay” items" />
      <SeasonPicker active={season.id} onPick={(id) => { setSeasonId(id); setEditing(false); }} />

      <Card style={{ textAlign: "center", padding: "14px 16px" }}>
        <div style={{ fontFamily: fontScript, fontSize: 30, color: C.deepPink, lineHeight: 1.2 }}>
          {season.emoji} {season.name}
        </div>
        <div style={{ fontSize: 14.5, color: C.ink, fontWeight: 600 }}>
          {season.colours} <span style={{ color: C.sub }}>{season.base}</span>
        </div>
        <div style={{ fontSize: 13, color: C.sub, marginTop: 4 }}>
          {editing ? "Rename, delete or add items below — changes save automatically" : "Tick what you have, tap an item to describe it"}
        </div>
        <EditBar editing={editing} setEditing={setEditing} onRestore={restore} restoreLabel={`Restore original ${season.name.toLowerCase()} items`} />
      </Card>

      {!editing && <NeededCard cats={cats} seasonState={seasonState} season={season} />}

      {cats.map((cat) => (
        <CategoryCard key={`${season.id}-${cat.id}`} cat={cat} seasonState={seasonState} update={update} editing={editing} editCat={editCat} />
      ))}
    </>
  );
}

/* ── clothing calculator ─────────────────────── */

const CLOTHES_SECTION_IDS = ["-me", "-mal"];
const isClothesSection = (s) => CLOTHES_SECTION_IDS.some((suffix) => s.id.endsWith(suffix));

const ceil = Math.ceil;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

/* split n tops across colour / white / black, colour first */
function splitTops(n) {
  const out = { colour: 0, white: 0, black: 0 };
  const order = ["colour", "white", "black"];
  for (let i = 0; i < n; i++) out[order[i % 3]]++;
  return out;
}

function planClothes({ season, nights, light, wash, meTwice, malTwice }) {
  const realDays = nights + 1;
  const washCap = light ? 4 : 7;
  const days = wash ? Math.min(realDays, washCap) : realDays;
  const meOutfits = meTwice ? ceil(days / 2) : days;
  const malOutfits = malTwice ? ceil(days / 2) : days;
  const pj = nights > 7 && !wash ? 2 : 1;
  const L = (cap, n) => (light ? Math.min(cap, n) : n);

  const me = [];
  const mal = [];
  const add = (list, id, text, n, note) => n > 0 && list.push({ id, text, n, note });

  if (season === "summer") {
    /* ── me, spring / summer ── */
    const dresses = L(2, clamp(Math.round(meOutfits * 0.4), 1, 4));
    const topOutfits = Math.max(1, meOutfits - dresses);
    const shortTops = L(2, Math.max(1, topOutfits - 1));
    const t = splitTops(shortTops);
    add(me, "lst", "Long sleeve top, black or white", 1, "wear for travel");
    add(me, "sst-c", "Season colour short sleeve top", t.colour);
    add(me, "sst-w", "White short sleeve top", t.white);
    add(me, "sst-b", "Black short sleeve top", t.black);
    add(me, "dress", "Dresses (1 black/white, 1 colour)", dresses);
    add(me, "shorts", "Shorts", L(1, clamp(ceil((topOutfits - 1) / 2), 1, 4)));
    add(me, "ltrou", "Light trousers", 1);
    add(me, "htrou", "Heavier trousers", light ? 0 : 1, "wear for travel");
    add(me, "layer", "Layers / cardigan", light ? 1 : 2, "1 worn");
    add(me, "swim", "Swimwear", 1);
    add(me, "shoes", "Pairs of shoes", light ? 1 : 2, light ? "worn" : "1 worn with warm socks, 1 packed");
    /* ── Maleeka ── */
    const mDresses = L(2, clamp(Math.round(malOutfits * 0.3), 1, 4));
    const mTopOutfits = Math.max(1, malOutfits - mDresses);
    add(mal, "lst", "Long sleeve top", 1, "wear for travel");
    add(mal, "sst", "Short sleeve tops — any colour", L(2, Math.max(1, mTopOutfits - 1)));
    add(mal, "dress", "Light dresses — any colour", mDresses);
    add(mal, "shorts", "Shorts", L(1, clamp(ceil((mTopOutfits - 1) / 2), 1, 5)));
    add(mal, "ltrou", "Light trousers", 1);
    add(mal, "htrou", "Heavier trousers", light ? 0 : 1, "wear for travel");
    add(mal, "jumper", "Jumper", 1, "wear for travel");
    add(mal, "swim", "Swimwear", light ? 1 : nights >= 5 ? 2 : 1);
    add(mal, "shoes", "Pairs of shoes", light ? 1 : 2, light ? "worn" : "1 worn");
  } else {
    /* ── me, autumn / winter ── */
    const wDresses = meOutfits >= 3 ? L(1, days > 7 ? 2 : 1) : 0;
    const tops = L(3, Math.max(2, meOutfits - wDresses));
    const longTops = Math.max(1, tops - 1);
    add(me, "lst-b", "Black long sleeve top", ceil(longTops / 2), "1 black or white worn");
    add(me, "lst-w", "White long sleeve top", Math.floor(longTops / 2));
    add(me, "sst-c", "Season colour short sleeve top", 1);
    add(me, "dress", "Winter dress", wDresses, "wear with tights & boots");
    add(me, "tights", "Pairs of black tights", wDresses > 0 ? wDresses + 1 : 0);
    add(me, "trou", "Trousers", L(1, clamp(ceil(meOutfits / 2) + 1, 2, 4)), "wear 1");
    add(me, "jumper", "Jumpers", L(1, days > 7 ? 3 : 2), "1 worn");
    add(me, "coat", "Coat", 1, "wear for travel");
    add(me, "socks", "Pairs of socks", L(5, days));
    add(me, "shoes", "Pairs of shoes", light ? 1 : 2, light ? "worn" : "1 worn, 1 packed");
    /* ── Maleeka ── */
    const mTops = L(3, Math.max(2, malOutfits));
    const mLong = Math.max(1, mTops - 1);
    add(mal, "lst", "Long sleeve tops — any colour", mLong, "1 worn");
    add(mal, "sst", "Short sleeve top — any colour", 1);
    add(mal, "trou", "Trousers", L(1, clamp(ceil(malOutfits / 2) + 1, 2, 5)), "wear 1");
    add(mal, "jumper", "Jumpers", L(1, days > 4 ? 2 : 1), "1 worn");
    add(mal, "coat", "Coat", 1, "wear for travel");
    add(mal, "socks", "Pairs of socks", L(5, days));
    add(mal, "shoes", "Pair of shoes", 1, "worn");
  }

  /* underwear + nightwear, both */
  add(me, "knick", "Knickers", Math.max(1, ceil((light ? Math.min(days, 5) : days) * 4 / 7)), "about 4 a week");
  add(me, "bra-b", "Black bra", 1);
  add(me, "bra-w", "White bra", 1);
  add(me, "bra-s", "Beige or season colour bra", days > 7 ? 1 : 0);
  add(me, "pj", "Nightie / sleepwear", pj);
  add(mal, "knick", "Knickers", L(5, days));
  add(mal, "pj", "Pyjamas / nightie", pj);

  return { me, mal, days, realDays, meOutfits, malOutfits, capped: wash && realDays > washCap, washCap };
}

/* ── PACKING ─────────────────────────────────── */

function PackSection({ section, ticks, toggle, editing, onAdd, onRemove, onRename }) {
  const [open, setOpen] = useState(true);
  const [draft, setDraft] = useState("");
  const done = section.items.filter((i) => ticks[i.id]).length;
  const add = () => {
    if (!draft.trim()) return;
    onAdd(draft.trim());
    setDraft("");
  };
  return (
    <Card>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: fontBody, textAlign: "left" }}>
        <CardTitle
          icon={section.icon}
          title={section.title}
          sub={section.note}
          right={
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Pill>{done === section.items.length && done > 0 ? "✓ all" : `${done}/${section.items.length}`}</Pill>
              <span style={{ color: C.sub, fontSize: 14 }}>{open ? "▾" : "▸"}</span>
            </span>
          }
        />
      </button>
      {open && (
        <>
          {section.items.map((item) =>
            editing ? (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: `1px dashed ${C.border}` }}>
                <TextInput value={item.text} onChange={(v) => onRename(item.id, v)} placeholder="Item name" />
                <DeleteBtn onClick={() => onRemove(item.id)} />
              </div>
            ) : (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: `1px dashed ${C.border}` }}>
                <button
                  onClick={() => toggle(item.id)}
                  style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: fontBody, textAlign: "left" }}
                >
                  <Tick on={!!ticks[item.id]} size={24} />
                  <span style={{ fontSize: 15, fontWeight: 600, color: C.ink, textDecoration: ticks[item.id] ? "line-through" : "none", opacity: ticks[item.id] ? 0.5 : 1 }}>
                    {item.text}
                  </span>
                </button>
              </div>
            )
          )}
          {editing && (
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <TextInput value={draft} onChange={setDraft} onEnter={add} placeholder="Add an item…" />
              <SmallPinkBtn onClick={add}>Add</SmallPinkBtn>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

function CountBtn({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 30, height: 30, minWidth: 30, borderRadius: "50%", border: "none",
        background: C.blushSoft, color: C.deepPink, fontWeight: 700, fontSize: 17,
        cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.35 : 1, fontFamily: fontBody, lineHeight: 1,
      }}
    >
      {children}
    </button>
  );
}

function ClothesSection({ who, icon, title, items, ticks, toggle, adjust, setAdjust }) {
  const [open, setOpen] = useState(true);
  const rows = items
    .map((it) => {
      const key = `${who}.${it.id}`;
      return { ...it, key, count: Math.max(0, it.n + (adjust[key] || 0)), changed: !!adjust[key] };
    });
  const shown = rows.filter((r) => r.count > 0 || r.changed);
  const totalPieces = rows.reduce((n, r) => n + r.count, 0);
  const done = shown.filter((r) => r.count > 0 && ticks[r.key]).length;
  const countable = shown.filter((r) => r.count > 0).length;

  return (
    <Card>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: fontBody, textAlign: "left" }}>
        <CardTitle
          icon={icon}
          title={title}
          sub={`${totalPieces} pieces altogether`}
          right={
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Pill>{done === countable && done > 0 ? "✓ all" : `${done}/${countable}`}</Pill>
              <span style={{ color: C.sub, fontSize: 14 }}>{open ? "▾" : "▸"}</span>
            </span>
          }
        />
      </button>
      {open &&
        shown.map((r) => {
          const on = r.count > 0 && !!ticks[r.key];
          return (
            <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px dashed ${C.border}` }}>
              <button
                onClick={() => r.count > 0 && toggle(r.key)}
                style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: fontBody, textAlign: "left" }}
              >
                <Tick on={on} size={24} />
                <span style={{ opacity: on ? 0.5 : r.count === 0 ? 0.4 : 1 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: C.deepPink }}>{r.count} × </span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: C.ink, textDecoration: on ? "line-through" : "none" }}>{r.text}</span>
                  {r.note && <div style={{ fontSize: 12.5, color: C.sub, fontWeight: 600 }}>{r.note}</div>}
                </span>
              </button>
              <CountBtn disabled={r.count === 0} onClick={() => setAdjust(r.key, (adjust[r.key] || 0) - 1)}>−</CountBtn>
              <CountBtn onClick={() => setAdjust(r.key, (adjust[r.key] || 0) + 1)}>+</CountBtn>
            </div>
          );
        })}
    </Card>
  );
}

function Toggle({ on, onClick, label }) {
  return (
    <button
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: "none", border: "none", padding: "7px 0", cursor: "pointer", fontFamily: fontBody, textAlign: "left" }}
    >
      <span style={{ width: 44, height: 26, minWidth: 44, borderRadius: 999, background: on ? `linear-gradient(135deg, ${C.pink}, ${C.deepPink})` : C.border, position: "relative", transition: "all .15s" }}>
        <span style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "all .15s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
      </span>
      <span style={{ fontSize: 14.5, fontWeight: 600, color: C.ink }}>{label}</span>
    </button>
  );
}

function Segmented({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            style={{
              flex: 1, fontFamily: fontBody, fontWeight: 700, fontSize: 13.5, cursor: "pointer", borderRadius: 18,
              padding: "10px 6px", lineHeight: 1.3,
              border: on ? `2.5px solid ${C.pink}` : `1.5px solid ${C.border}`,
              background: on ? "#FFF6FA" : C.card, color: on ? C.deepPink : C.sub,
            }}
          >
            <div style={{ fontSize: 20 }}>{o.emoji}</div>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function PackingTab() {
  const [season, setSeason] = usePersisted("tripSeason", "summer");
  const [style, setStyle] = usePersisted("tripStyle", "suitcase");
  const [nights, setNights] = usePersisted("tripNights", 7);
  const [wash, setWash] = usePersisted("tripWash", false);
  const [meTwice, setMeTwice] = usePersisted("tripMeTwice", true);
  const [malTwice, setMalTwice] = usePersisted("tripMalTwice", false);
  const [lists, setLists] = usePersisted("packingLists", DEFAULT_PACKING);
  const [ticks, setTicks] = usePersisted("packingTicks2", {});
  const [adjustAll, setAdjustAll] = usePersisted("packingAdjust", {});
  const [editing, setEditing] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const light = style === "light";
  const listKey = light ? "light" : season;
  const tripKey = `${season}-${style}`;
  const adjust = adjustAll[tripKey] || {};
  const setAdjust = (key, v) => setAdjustAll((p) => ({ ...p, [tripKey]: { ...(p[tripKey] || {}), [key]: v } }));

  const plan = planClothes({ season, nights, light, wash, meTwice, malTwice });
  const sections = (lists[listKey] || DEFAULT_PACKING[listKey]).filter((s) => !isClothesSection(s));
  const tripTicks = ticks[tripKey] || {};

  const clothesRows = [
    ...plan.me.map((i) => ({ key: `me.${i.id}`, n: i.n })),
    ...plan.mal.map((i) => ({ key: `mal.${i.id}`, n: i.n })),
  ].filter((r) => r.n + (adjust[r.key] || 0) > 0);
  const total = clothesRows.length + sections.reduce((n, s) => n + s.items.length, 0);
  const done =
    clothesRows.filter((r) => tripTicks[r.key]).length +
    sections.reduce((n, s) => n + s.items.filter((i) => tripTicks[i.id]).length, 0);

  const toggle = (id) => setTicks((p) => ({ ...p, [tripKey]: { ...(p[tripKey] || {}), [id]: !(p[tripKey] || {})[id] } }));
  const changeSection = (sid, fn) =>
    setLists((p) => ({ ...p, [listKey]: (p[listKey] || DEFAULT_PACKING[listKey]).map((s) => (s.id === sid ? { ...s, items: fn(s.items) } : s)) }));
  const addItem = (sid, text) => changeSection(sid, (items) => [...items, { id: `${sid}-${Date.now()}`, text }]);
  const removeItem = (sid, id) => changeSection(sid, (items) => items.filter((i) => i.id !== id));
  const renameItem = (sid, id, text) => changeSection(sid, (items) => items.map((i) => (i.id === id ? { ...i, text } : i)));
  const restoreList = () => {
    setLists((p) => ({ ...p, [listKey]: DEFAULT_PACKING[listKey] }));
    setAdjustAll((p) => ({ ...p, [tripKey]: {} }));
  };
  const resetTicks = () => {
    setTicks((p) => ({ ...p, [tripKey]: {} }));
    setConfirmReset(false);
  };

  const changeNights = (n) => setNights(clamp(n, 1, 28));
  const seasonName = season === "summer" ? "Spring / Summer" : "Autumn / Winter";

  return (
    <>
      <Header title="Holiday Packing" subtitle="Tell me the trip · I'll work out the clothes" />

      <Card>
        <CardTitle icon="🗓️" title="Your trip" />
        <Segmented
          value={season}
          onChange={(v) => { setSeason(v); setConfirmReset(false); setEditing(false); }}
          options={[{ id: "summer", label: "Spring / Summer", emoji: "☀️" }, { id: "winter", label: "Autumn / Winter", emoji: "🧣" }]}
        />
        <div style={{ height: 10 }} />
        <Segmented
          value={style}
          onChange={(v) => { setStyle(v); setConfirmReset(false); setEditing(false); }}
          options={[{ id: "suitcase", label: "Suitcase", emoji: "🧳" }, { id: "light", label: "Light packing", emoji: "🪶" }]}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, margin: "18px 0 6px" }}>
          <button onClick={() => changeNights(nights - 1)} style={{ ...btnBase, width: 46, height: 46, padding: 0, fontSize: 22, background: C.blushSoft, color: C.deepPink }}>−</button>
          <div style={{ textAlign: "center", minWidth: 90 }}>
            <div style={{ fontFamily: fontScript, fontSize: 46, color: C.deepPink, lineHeight: 1 }}>{nights}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.berry }}>{nights === 1 ? "night" : "nights"}</div>
          </div>
          <button onClick={() => changeNights(nights + 1)} style={{ ...btnBase, width: 46, height: 46, padding: 0, fontSize: 22, background: C.blushSoft, color: C.deepPink }}>+</button>
        </div>
        <div style={{ textAlign: "center", fontSize: 13, color: C.sub, fontWeight: 600, marginBottom: 8 }}>
          {plan.realDays} days including travel
        </div>

        <div style={{ borderTop: `1px dashed ${C.border}`, paddingTop: 6 }}>
          <Toggle on={meTwice} onClick={() => setMeTwice((v) => !v)} label="I wear each outfit twice" />
          <Toggle on={malTwice} onClick={() => setMalTwice((v) => !v)} label="Maleeka wears each outfit twice" />
          <Toggle on={wash} onClick={() => setWash((v) => !v)} label={`I can do a wash while away`} />
        </div>
      </Card>

      <Card style={{ background: "linear-gradient(180deg, #FFF6FA, #FCE4EE)" }}>
        <CardTitle icon="✨" title={`${seasonName} · ${light ? "Light" : "Suitcase"}`} right={<Pill>{done}/{total} packed</Pill>} />
        <ProgressBar done={done} total={total} />
        <div style={{ fontSize: 14, color: C.ink, fontWeight: 600, lineHeight: 1.6, marginTop: 10 }}>
          💗 {plan.meOutfits} outfits for you{meTwice ? ", each worn twice" : ""}
          <br />💗 {plan.malOutfits} outfits for Maleeka{malTwice ? ", each worn twice" : ""}
          {plan.capped && (
            <>
              <br />🧺 Packed for {plan.washCap} days — plan a wash to cover the rest
            </>
          )}
          {light && !wash && plan.realDays > 4 && (
            <>
              <br />🧺 Light packing caps the clothes — plan a wash or turn on washing
            </>
          )}
        </div>
        <div style={{ fontSize: 12.5, color: C.sub, marginTop: 6 }}>Use − and + on any clothing line if you want more or less.</div>
        {done === total && total > 0 && !editing && (
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <div style={{ fontFamily: fontScript, fontSize: 30, color: C.deepPink }}>All packed!</div>
            <div style={{ fontSize: 14, color: C.sub, fontWeight: 600 }}>Have a beautiful trip, you two 💗</div>
          </div>
        )}
        {editing && (
          <div style={{ fontSize: 13, color: C.sub, textAlign: "center", marginTop: 10, fontWeight: 600 }}>
            Rename, delete or add items below — changes save automatically
          </div>
        )}
        <EditBar editing={editing} setEditing={setEditing} onRestore={restoreList} restoreLabel="Restore original list" />
        {!editing && (
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {!confirmReset ? (
              <PinkButton small ghost onClick={() => setConfirmReset(true)}>☐ Untick everything</PinkButton>
            ) : (
              <>
                <PinkButton small onClick={resetTicks}>Yes, untick all</PinkButton>
                <PinkButton small ghost onClick={() => setConfirmReset(false)}>Cancel</PinkButton>
              </>
            )}
          </div>
        )}
      </Card>

      {!editing && (
        <>
          <ClothesSection who="me" icon="👚" title="My clothes" items={plan.me} ticks={tripTicks} toggle={toggle} adjust={adjust} setAdjust={setAdjust} />
          <ClothesSection who="mal" icon="🎀" title="Maleeka's clothes" items={plan.mal} ticks={tripTicks} toggle={toggle} adjust={adjust} setAdjust={setAdjust} />
        </>
      )}

      {sections.map((s) => (
        <PackSection
          key={`${listKey}-${s.id}`}
          section={s}
          ticks={tripTicks}
          toggle={toggle}
          editing={editing}
          onAdd={(text) => addItem(s.id, text)}
          onRemove={(id) => removeItem(s.id, id)}
          onRename={(id, text) => renameItem(s.id, id, text)}
        />
      ))}

      <Card>
        <CardTitle icon="💡" title="Travel tips" />
        {TRAVEL_TIPS.map((t) => (
          <div key={t} style={{ fontSize: 14.5, color: C.ink, fontWeight: 500, padding: "3px 0" }}>💗 {t}</div>
        ))}
      </Card>
    </>
  );
}

/* ── MY SYSTEM (rules, declutter, drawers) ───── */

const DECLUTTER_QS = [
  "Do I wear it regularly?",
  "Does it match 2+ items?",
  "Does it fit and feel good?",
  "Does it match my colours?",
  "Would I wear it tomorrow?",
];

function DeclutterCheck() {
  const [answers, setAnswers] = useState({});
  const anyNo = Object.values(answers).includes(false);
  const allYes = DECLUTTER_QS.every((_, i) => answers[i] === true);

  const yn = (i, val) => setAnswers((a) => ({ ...a, [i]: val }));
  const pick = (i, val) => ({
    ...btnBase,
    padding: "6px 14px",
    fontSize: 13.5,
    background: answers[i] === val ? (val ? C.green : C.deepPink) : C.blushSoft,
    color: answers[i] === val ? "#fff" : C.sub,
  });

  return (
    <Card>
      <CardTitle icon="🌿" title="Declutter check" sub="Hold the item and answer honestly" />
      {DECLUTTER_QS.map((q, i) => (
        <div key={q} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: `1px dashed ${C.border}` }}>
          <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: C.ink }}>{q}</span>
          <button style={pick(i, true)} onClick={() => yn(i, true)}>Yes</button>
          <button style={pick(i, false)} onClick={() => yn(i, false)}>No</button>
        </div>
      ))}
      {(anyNo || allYes) && (
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <div style={{ fontFamily: fontScript, fontSize: 32, color: anyNo ? C.deepPink : C.green }}>
            {anyNo ? "It goes" : "Keep it"}
          </div>
          <div style={{ fontSize: 14, color: C.sub, fontWeight: 600 }}>
            {anyNo ? "It failed one — let it go with love 🌸" : "It earns its place in your capsule 💗"}
          </div>
        </div>
      )}
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <PinkButton small ghost onClick={() => setAnswers({})}>Next item ↷</PinkButton>
      </div>
    </Card>
  );
}

const DRAWERS = [
  ["1", "Bras — 2 black, 2 white, 1 beige or seasonal"],
  ["2", "Knickers (5) · socks (6) · nightwear · swimwear in summer"],
  ["3", "Season colour tops — 3 in spring/summer, 2 (1 of each colour, +1 flex) in autumn/winter"],
  ["4", "White tops — 2 short + 1 long (2 white/cream long in autumn/winter)"],
  ["5", "Black tops — 2 short + 1 long (2 long + 1 short in autumn/winter)"],
  ["6", "Shorts — black, season colour, white or denim"],
  ["7", "Trousers — black, dark denim, season colour (+ warm pair in winter)"],
  ["8", "Dresses — 3, up to 4 in spring/summer · 3 winter dresses in autumn/winter"],
];

function Lines({ lines }) {
  return lines.map((l) => (
    <div key={l} style={{ fontSize: 14.5, color: C.ink, fontWeight: 500, padding: "3px 0" }}>💗 {l}</div>
  ));
}

function SystemTab() {
  return (
    <>
      <Header title="My System" subtitle="The rules that keep it simple" />

      <Card>
        <CardTitle icon="🎨" title="Core idea" sub="Each season" />
        <Lines lines={["1–2 seasonal colours", "Black + white base", "Denim / neutral trousers — colour goes in your tops", "Everything must mix", "No duplicates (except basics)", "No “just okay” items"]} />
      </Card>

      <Card>
        <CardTitle icon="🌈" title="Season colours" />
        {SEASONS.map((s) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: `1px dashed ${C.border}` }}>
            <span style={{ fontSize: 20 }}>{s.emoji}</span>
            <span style={{ flex: 1 }}>
              <span style={{ fontWeight: 700, color: C.berry, fontSize: 15 }}>{s.name}</span>
              <span style={{ fontSize: 13.5, color: C.sub, fontWeight: 600 }}> · {s.colours} {s.base}</span>
            </span>
            <span style={{ display: "flex", gap: 4 }}>
              {s.swatches.slice(0, 2).map((c) => (
                <span key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />
              ))}
            </span>
          </div>
        ))}
      </Card>

      <Card>
        <CardTitle icon="🛍️" title="Rule for anything needed" sub="Only add it if…" />
        <Lines lines={["You actually use it regularly", "It matches your system", "It fills a real gap", "Max 1 extra per category"]} />
      </Card>

      <DeclutterCheck />

      <Card style={{ textAlign: "center", background: "linear-gradient(180deg, #FFF6FA, #FCE4EE)" }}>
        <div style={{ fontSize: 13, color: C.sub, fontWeight: 700, letterSpacing: 1 }}>🌸 FINAL RULE 🌸</div>
        <div style={{ fontFamily: fontScript, fontSize: 30, color: C.deepPink, marginTop: 4 }}>If it fails one, it goes</div>
      </Card>

      <Card>
        <CardTitle icon="🗂️" title="Drawer plan" />
        {DRAWERS.map(([n, text]) => (
          <div key={n} style={{ display: "flex", gap: 12, alignItems: "center", padding: "7px 0", borderBottom: `1px dashed ${C.border}` }}>
            <span style={{ width: 30, height: 30, minWidth: 30, borderRadius: 10, background: C.blushSoft, color: C.deepPink, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              {n}
            </span>
            <span style={{ fontSize: 14.5, color: C.ink, fontWeight: 600 }}>{text}</span>
          </div>
        ))}
      </Card>

      <Card>
        <CardTitle icon="📦" title="Seasonal storage bags" />
        <div style={{ fontWeight: 700, color: C.berry, fontSize: 15, marginBottom: 2 }}>☀️ Spring / Summer bag</div>
        <Lines lines={["Seasonal extras", "Max 4 shorts", "Max 4 dresses", "Cardigan", "Light jacket", "Sliders / sandals", "Swimwear", "1 bag"]} />
        <div style={{ fontWeight: 700, color: C.berry, fontSize: 15, margin: "12px 0 2px" }}>🧣 Autumn / Winter bag</div>
        <Lines lines={["Seasonal extras", "Jumpers", "Coats", "Winter dresses + tights", "Boots", "1 bag"]} />
      </Card>
    </>
  );
}

/* ── app shell ───────────────────────────────── */

const TABS = [
  { id: "wardrobe", label: "Wardrobe", icon: "👗" },
  { id: "packing", label: "Packing", icon: "🧳" },
  { id: "system", label: "My System", icon: "🌿" },
];

export default function App() {
  const [tab, setTab] = usePersisted("tab", "wardrobe");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tab]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: fontBody, color: C.ink }}>
      <style>{FONT_CSS}</style>
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "18px 14px 110px" }}>
        {tab === "wardrobe" && <WardrobeTab />}
        {tab === "packing" && <PackingTab />}
        {tab === "system" && <SystemTab />}
      </div>

      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(255,255,255,.96)",
          borderTop: `1.5px solid ${C.border}`,
          boxShadow: "0 -6px 20px rgba(231,91,141,.10)",
          display: "flex",
          justifyContent: "center",
          paddingBottom: "env(safe-area-inset-bottom)",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", width: "100%", maxWidth: 520 }}>
          {TABS.map((t) => {
            const on = t.id === tab;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "10px 0 12px",
                  fontFamily: fontBody,
                  fontWeight: 700,
                  fontSize: 12.5,
                  color: on ? C.deepPink : C.sub,
                }}
              >
                <div style={{ fontSize: 22, opacity: on ? 1 : 0.55, transform: on ? "scale(1.1)" : "none", transition: "all .15s" }}>{t.icon}</div>
                {t.label}
                <div style={{ height: 3, width: 26, borderRadius: 3, margin: "4px auto 0", background: on ? C.pink : "transparent" }} />
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
