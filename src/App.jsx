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
  const cats = [
    {
      id: "trousers", icon: "👖", title: "Trousers", rule: "Max 6 — 4 folded, 2 hanging",
      items: [
        it("t1", sc), it("t2", sc),
        it("t3", "Neutral / denim (black or light denim)"), it("t4", "Neutral / denim (black or light denim)"),
        it("h1", "Hanging — heavier season colour or denim"),
        it("h2", "Hanging — heavier neutral / denim"),
        extraSlot(),
      ],
    },
    {
      id: "tops", icon: "👕", title: "Tops", rule: "Max 11 + flex",
      items: [
        it("s1", sc), it("s2", sc), it("s3", sc), opt("s4", `${sc} — flex`),
        it("ws1", "White short sleeve"), it("ws2", "White short sleeve"),
        it("wl1", "White long sleeve"), it("wl2", "White long sleeve"),
        it("bs1", "Black short sleeve"), it("bs2", "Black short sleeve"),
        it("bl1", "Black long sleeve"), it("bl2", "Black long sleeve"),
        extraSlot(),
      ],
    },
  ];
  if (s.warm) {
    cats.push(
      {
        id: "shorts", icon: "🩳", title: "Shorts", rule: "Spring / Summer",
        items: [it("b", "Black"), it("w", "White"), it("s", sc), opt("d", "Denim"), extraSlot()],
      },
      {
        id: "dresses", icon: "👗", title: "Dresses", rule: "Up to 4",
        items: [it("s1", sc), it("s2", sc), it("n1", "Neutral"), opt("n2", "Neutral"), extraSlot()],
      }
    );
  }
  cats.push({
    id: "jumpers", icon: "🧶", title: "Jumpers", rule: "Kept outside the drawers",
    items: [it("b1", "Black"), opt("b2", "Black"), it("w1", "White"), opt("w2", "White"), it("s", sc), extraSlot()],
  });
  if (!s.warm) {
    cats.push({
      id: "coats", icon: "🧥", title: "Coats", rule: "Autumn / Winter",
      items: [it("b", "Black"), it("s", sc), extraSlot()],
    });
  }
  cats.push(
    {
      id: "underwear", icon: "👙", title: "Underwear", rule: "5 bras · 5 knickers · 6 socks",
      items: [
        it("bb1", "Black bra"), it("bb2", "Black bra"),
        it("wb1", "White bra"), it("wb2", "White bra"),
        it("sb", `Beige or ${s.word} bra`),
        it("k", "Knickers × 5"), it("so", "Socks × 6"),
      ],
    },
    {
      id: "shoes", icon: "👟", title: "Shoes", rule: "Keep it to the essentials",
      items: [it("sl1", "Sliders"), opt("sl2", "Sliders"), it("bk1", "Black shoes / boots"), opt("bk2", "Black shoes / boots"), it("s", sc), extraSlot()],
    },
    {
      id: "bags", icon: "👜", title: "Bags", rule: "Small, practical, matching",
      items: [it("sb", "Small black bag"), it("r", "Neutral / black rucksack"), it("s1", sc), opt("s2", sc), extraSlot()],
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
      "2 dresses", "2 layers (1 worn)", "1 black bra", "1 white bra", "3 knickers", "Nightie / sleepwear",
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
      "1 jumper (worn)", "1 jumper", "3 knickers", "1 black bra", "1 white bra", "Nightie / sleepwear", "2 pairs shoes (1 worn, 1 packed)",
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

function PackingTab() {
  const [trip, setTrip] = usePersisted("trip", "summer");
  const [lists, setLists] = usePersisted("packingLists", DEFAULT_PACKING);
  const [ticks, setTicks] = usePersisted("packingTicks", {});
  const [editing, setEditing] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const sections = lists[trip] || DEFAULT_PACKING[trip];
  const tripTicks = ticks[trip] || {};
  const total = sections.reduce((n, s) => n + s.items.length, 0);
  const done = sections.reduce((n, s) => n + s.items.filter((i) => tripTicks[i.id]).length, 0);

  const toggle = (id) => setTicks((p) => ({ ...p, [trip]: { ...(p[trip] || {}), [id]: !(p[trip] || {})[id] } }));
  const changeSection = (sid, fn) =>
    setLists((p) => ({ ...p, [trip]: (p[trip] || DEFAULT_PACKING[trip]).map((s) => (s.id === sid ? { ...s, items: fn(s.items) } : s)) }));
  const addItem = (sid, text) => changeSection(sid, (items) => [...items, { id: `${sid}-${Date.now()}`, text }]);
  const removeItem = (sid, id) => changeSection(sid, (items) => items.filter((i) => i.id !== id));
  const renameItem = (sid, id, text) => changeSection(sid, (items) => items.map((i) => (i.id === id ? { ...i, text } : i)));
  const restoreList = () => setLists((p) => ({ ...p, [trip]: DEFAULT_PACKING[trip] }));

  const resetTicks = () => {
    setTicks((p) => ({ ...p, [trip]: {} }));
    setConfirmReset(false);
  };

  const label = TRIPS.find((t) => t.id === trip)?.label;

  return (
    <>
      <Header title="Holiday Packing" subtitle="Tick as you pack · it remembers where you got to" />

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {TRIPS.map((t) => {
          const on = t.id === trip;
          return (
            <button
              key={t.id}
              onClick={() => { setTrip(t.id); setConfirmReset(false); setEditing(false); }}
              style={{
                flex: 1,
                fontFamily: fontBody,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                borderRadius: 18,
                padding: "10px 6px",
                border: on ? `2.5px solid ${C.pink}` : `1.5px solid ${C.border}`,
                background: on ? "#FFF6FA" : C.card,
                color: on ? C.deepPink : C.sub,
                lineHeight: 1.3,
              }}
            >
              <div style={{ fontSize: 20 }}>{t.emoji}</div>
              {t.label}
            </button>
          );
        })}
      </div>

      <Card style={{ background: "linear-gradient(180deg, #FFF6FA, #FCE4EE)" }}>
        <CardTitle icon="🧳" title={label} right={<Pill>{done}/{total} packed</Pill>} />
        <ProgressBar done={done} total={total} />
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

      {sections.map((s) => (
        <PackSection
          key={`${trip}-${s.id}`}
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
  ["1", "5 knickers · 2 black bras · 2 white bras · 1 seasonal or neutral bra"],
  ["2", "Socks and knickers"],
  ["3", "Seasonal tops (3)"],
  ["4", "White tops — 2 long, 2 short"],
  ["5", "Black tops — 2 long, 2 short"],
  ["6", "Shorts — white, black, seasonal, denim"],
  ["7", "Trousers — 2 black/denim, 2 seasonal"],
  ["8", "Dresses — up to 4"],
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
        <Lines lines={["1–2 seasonal colours", "Black + white base", "Denim / neutral trousers", "Everything must mix", "No duplicates", "No “just okay” items"]} />
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
        <Lines lines={["Seasonal extras", "Max 4 shorts", "Max 4 dresses", "1 jumper", "1 bag", "1 shoes"]} />
        <div style={{ fontWeight: 700, color: C.berry, fontSize: 15, margin: "12px 0 2px" }}>🧣 Autumn / Winter bag</div>
        <Lines lines={["Seasonal extras", "Jumpers", "Coats", "1 bag", "1 shoes"]} />
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
