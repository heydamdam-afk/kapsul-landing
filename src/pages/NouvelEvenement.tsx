import { useEffect, useMemo, useState, forwardRef, ReactNode, CSSProperties } from "react";
import { useLocation, Link } from "react-router-dom";
import { PhoneMockup } from "@/components/kapsul/PhoneMockup";

// ============ Tokens ============
const ACCENT = "#FF4842";
const ACCENT_LIGHT = "rgba(255,72,66,0.10)";
const TEXT = "#212B36";
const TEXT_2 = "#637381";
const TEXT_3 = "#919EAB";
const BG = "#F4F6F8";
const SUCCESS = "#00AB55";
const BORDER = "#E5E8EB";

// ============ Plans ============
type Plan = {
  id: string;
  name: string;
  price: number;
  photos: string;
  duree: string;
  invites: string;
  hint: string;
  popular?: boolean;
};

const PLANS: Plan[] = [
  { id: "decouverte", name: "Découverte", price: 0, photos: "100 photos", duree: "7 jours", invites: "≈ 10 invités", hint: "Parfait pour un EVJF ou un anniversaire intime." },
  { id: "essentiel", name: "Essentiel", price: 29, photos: "500 photos", duree: "1 mois", invites: "≈ 20 invités", hint: "Idéal pour un anniversaire ou une fête de famille." },
  { id: "standard", name: "Standard", price: 79, photos: "2 000 photos", duree: "1 mois", invites: "≈ 100 invités", hint: "Parfait pour un mariage ou un séminaire.", popular: true },
  { id: "premium", name: "Premium", price: 149, photos: "5 000 photos", duree: "1 mois", invites: "≈ 200 invités", hint: "Pour un grand mariage ou un festival." },
  { id: "illimite", name: "Illimitée", price: 199, photos: "Photos illimitées", duree: "1 mois", invites: "Invités illimités", hint: "Aucune limite — pour vos plus grands événements." },
];

// ============ Helpers ============
const suggestCodeFromName = (name: string) => {
  if (!name || !name.trim()) return "";
  const cleaned = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const SKIP = ["mariage", "anniversaire", "soiree", "soirée", "fete", "fête", "evjf", "event", "séminaire", "seminaire", "baby", "shower", "le", "la", "les", "de", "des", "du", "d", "et", "a", "à", "au"];
  const tokens = cleaned.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((t) => t && !SKIP.includes(t));
  const base = (tokens.length ? tokens.join("") : cleaned.replace(/[^a-z0-9]/gi, "")).toUpperCase().slice(0, 8);
  if (!base) return "";
  return base + new Date().getFullYear();
};

const formatDateFR = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
};

const formatCardNumber = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const formatExpiry = (v: string) => {
  const n = v.replace(/\D/g, "").slice(0, 4);
  if (n.length < 3) return n;
  return n.slice(0, 2) + "/" + n.slice(2);
};
const formatCVC = (v: string) => v.replace(/\D/g, "").slice(0, 4);

// ============ Reusable controls ============
const Field = ({ label, sublabel, error, children, optional }: { label: string; sublabel?: string; error?: string; children: ReactNode; optional?: boolean }) => (
  <div style={{ marginBottom: 22 }}>
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
      <label style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 14, fontWeight: 600, color: TEXT }}>
        {label}
        {optional && <span style={{ color: TEXT_2, fontWeight: 400, marginLeft: 6 }}>· optionnel</span>}
      </label>
      {sublabel && <span style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 12, color: TEXT_2 }}>{sublabel}</span>}
    </div>
    {children}
    {error && <div style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 13, color: ACCENT, marginTop: 6 }}>{error}</div>}
  </div>
);

type TextInputProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  transform?: (v: string) => string;
  type?: string;
};
const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({ value, onChange, placeholder, maxLength, transform, type = "text" }, ref) => {
  const [focused, setFocused] = useState(false);
  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={(e) => onChange(transform ? transform(e.target.value) : e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={placeholder}
      maxLength={maxLength}
      style={{
        width: "100%",
        padding: "13px 14px",
        fontFamily: '"Public Sans", sans-serif',
        fontSize: 15,
        color: TEXT,
        background: "#fff",
        border: `1.5px solid ${focused ? ACCENT : BORDER}`,
        borderRadius: 12,
        outline: "none",
        boxShadow: focused ? `0 0 0 4px ${ACCENT_LIGHT}` : "none",
        transition: "all 0.18s",
        boxSizing: "border-box",
      }}
    />
  );
});
TextInput.displayName = "TextInput";

const PrimaryButton = ({ children, onClick, disabled, fullWidth, large, type = "button" }: { children: ReactNode; onClick?: () => void; disabled?: boolean; fullWidth?: boolean; large?: boolean; type?: "button" | "submit" }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    style={{
      background: disabled ? "#DFE3E8" : ACCENT,
      color: disabled ? "#919EAB" : "#fff",
      border: "none",
      borderRadius: 100,
      padding: large ? "16px 28px" : "13px 22px",
      fontFamily: '"Public Sans", sans-serif',
      fontWeight: 600,
      fontSize: large ? 15 : 14,
      cursor: disabled ? "not-allowed" : "pointer",
      width: fullWidth ? "100%" : "auto",
      boxShadow: disabled ? "none" : `0 8px 20px ${ACCENT}40`,
      transition: "all 0.18s",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    }}
  >
    {children}
  </button>
);

// ============ Split layout ============
type LeftProps = {
  title?: string;
  subtitle?: string;
  bullets?: { icon: string; text: string }[];
  showPhone?: boolean;
};

const SplitLayout = ({ left, children }: { left?: LeftProps; children: ReactNode }) => {
  const L = {
    title: "Votre galerie en quelques minutes",
    subtitle: "Partagez vos plus beaux moments avec tous vos invités.",
    bullets: [
      { icon: "📸", text: "Upload illimité depuis mobile" },
      { icon: "⚡", text: "QR code prêt en 1 minute" },
      { icon: "🔒", text: "Galerie privée et sécurisée" },
    ],
    showPhone: true,
    ...(left || {}),
  };

  return (
    <div className="kw-split">
      <aside className="kw-brand">
        <div className="kw-brand-bg" aria-hidden="true"></div>
        <Link to="/" className="kw-brand-logo">
          <span className="kw-brand-dot"></span>
          Kapsul
        </Link>
        <div className="kw-brand-hero">
          <h1 className="kw-brand-title">{L.title}</h1>
          <p className="kw-brand-sub">{L.subtitle}</p>
        </div>
        {L.showPhone && (
          <div className="kw-brand-phone">
            <PhoneMockup />
          </div>
        )}
        <ul className="kw-brand-bullets">
          {L.bullets.map((b, i) => (
            <li key={i}>
              <span className="kw-brand-bullet-icon">{b.icon}</span>
              <span>{b.text}</span>
            </li>
          ))}
        </ul>
      </aside>
      <main className="kw-main">
        <div className="kw-main-inner">{children}</div>
      </main>
    </div>
  );
};

// ============ Step 1 ============
type WizardData = {
  plan: string;
  name: string;
  code: string;
  codeManuallyEdited: boolean;
  date: string;
  email: string;
};

const PlanSelector = ({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) => {
  const visible = PLANS;
  return (
    <div
      role="radiogroup"
      aria-label="Choix du plan"
      className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-[18px]"
    >
      {visible.map((p) => {
        const active = p.id === selectedId;
        const isUnlimited = p.id === "illimite";
        return (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onSelect(p.id)}
            style={{
              position: "relative",
              textAlign: "left",
              padding: "10px 10px 11px",
              background: active ? "#fff" : "#F8F9FA",
              border: `1.5px solid ${active ? ACCENT : BORDER}`,
              borderRadius: 12,
              cursor: "pointer",
              transition: "all 0.18s",
              boxShadow: active ? `0 0 0 4px ${ACCENT_LIGHT}` : "none",
              fontFamily: '"Public Sans", sans-serif',
              minWidth: 0,
            }}
          >
            {p.popular && (
              <span
                style={{
                  position: "absolute",
                  top: -7,
                  right: 6,
                  background: ACCENT,
                  color: "#fff",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "2px 6px",
                  borderRadius: 100,
                }}
              >
                Top
              </span>
            )}
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                color: active ? ACCENT : TEXT_2,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {p.name}
            </div>
            <div
              style={{
                fontFamily: '"Josefin Sans", sans-serif',
                fontWeight: 700,
                fontSize: 18,
                color: TEXT,
                letterSpacing: "-0.02em",
                marginTop: 2,
                lineHeight: 1.1,
              }}
            >
              {isUnlimited ? `${p.price}€` : `${p.price}€`}
            </div>
            <div
              style={{
                fontSize: 11,
                color: TEXT_2,
                marginTop: 4,
                lineHeight: 1.3,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {p.photos}
            </div>
            <div
              style={{
                fontSize: 10.5,
                color: TEXT_3,
                marginTop: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {p.invites}
            </div>
          </button>
        );
      })}
    </div>
  );
};

const Step1 = ({ data, setData, onNext }: { data: WizardData; setData: React.Dispatch<React.SetStateAction<WizardData>>; onNext: () => void }) => {
  const suggested = useMemo(() => suggestCodeFromName(data.name), [data.name]);
  const codeIsAuto = !data.codeManuallyEdited;
  const effectiveCode = codeIsAuto ? suggested : data.code;
  const showSuggestion = !codeIsAuto && suggested && suggested !== (data.code || "").toUpperCase();
  const plan = PLANS.find((p) => p.id === data.plan) || PLANS[1];

  const setName = (v: string) => setData((d) => ({ ...d, name: v, code: codeIsAuto ? suggestCodeFromName(v) : d.code }));
  const setCode = (v: string) => setData((d) => ({ ...d, code: v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 16), codeManuallyEdited: true }));
  const useSuggested = () => setData((d) => ({ ...d, code: suggested, codeManuallyEdited: false }));

  const valid = !!(data.name.trim() && (effectiveCode || "").length >= 3 && data.date && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((data.email || "").trim()));

  return (
    <SplitLayout>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
        <Link to="/" style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 13, color: TEXT_3, textDecoration: "none", fontWeight: 500 }}>
          ← Retour
        </Link>
      </div>

      <PlanSelector selectedId={plan.id} onSelect={(id) => setData((d) => ({ ...d, plan: id }))} />

      <h2 style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: 24, color: TEXT, margin: "0 0 8px", letterSpacing: "-0.015em" }}>Créez votre événement</h2>
      <p style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 14.5, color: TEXT_2, margin: "0 0 22px", lineHeight: 1.5 }}>Quelques infos sur votre événement et c'est parti.</p>

      <div
        key={plan.id}
        style={{
          marginBottom: 22,
          padding: "12px 16px",
          background: "rgba(255,72,66,0.06)",
          borderLeft: `3px solid ${ACCENT}`,
          borderRadius: 8,
          fontFamily: '"Public Sans", sans-serif',
          fontSize: 13.5,
          color: TEXT_2,
          lineHeight: 1.5,
          animation: "kapsulFadeIn 0.3s ease",
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 16 }}>💡</span>
        <span>{plan.hint}</span>
      </div>

      <Field label="Nom de l'événement" sublabel="🔒 Définitif après création">
        <TextInput value={data.name} onChange={setName} placeholder="Mariage de Julie & Thomas" maxLength={80} />
      </Field>

      <Field label="Date de l'événement">
        <input
          type="date"
          value={data.date}
          onChange={(e) => setData((d) => ({ ...d, date: e.target.value }))}
          style={{
            width: "100%",
            padding: "13px 14px",
            fontFamily: '"Public Sans", sans-serif',
            fontSize: 15,
            color: TEXT,
            background: "#fff",
            border: `1.5px solid ${BORDER}`,
            borderRadius: 12,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </Field>

      <Field label="Code d'accès invités" sublabel="Ce que vos invités saisiront pour rejoindre la galerie">
        <TextInput value={effectiveCode || ""} onChange={setCode} placeholder={suggested || "EX : MARIAGE2026"} maxLength={16} />
        {showSuggestion && (
          <button
            type="button"
            onClick={useSuggested}
            style={{
              marginTop: 8,
              background: ACCENT_LIGHT,
              color: ACCENT,
              border: "none",
              borderRadius: 100,
              padding: "6px 14px",
              fontFamily: '"Public Sans", sans-serif',
              fontWeight: 600,
              fontSize: 12.5,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 14 }}>✨</span> Utiliser la suggestion : {suggested}
          </button>
        )}
        {codeIsAuto && suggested && (
          <div style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 12.5, color: TEXT_3, marginTop: 6 }}>Suggestion auto · modifiable</div>
        )}
      </Field>

      <Field label="Votre email">
        <TextInput value={data.email} onChange={(v) => setData((d) => ({ ...d, email: v }))} placeholder="vous@exemple.com" type="email" />
      </Field>

      <div style={{ marginTop: 26 }}>
        <PrimaryButton onClick={onNext} disabled={!valid} fullWidth large>
          {plan.price === 0 ? "Créer ma galerie gratuite →" : "Continuer vers le paiement →"}
        </PrimaryButton>
        {plan.price === 0 && (
          <p style={{ textAlign: "center", margin: "10px 0 0", fontFamily: '"Public Sans", sans-serif', fontSize: 12.5, color: TEXT_3 }}>Aucune carte bancaire requise</p>
        )}
      </div>
    </SplitLayout>
  );
};

// ============ Step 2 ============
const STRIPE_PURPLE = "#635BFF";
const inputBase: CSSProperties = {
  width: "100%",
  padding: "13px 14px",
  fontFamily: '"Public Sans", sans-serif',
  fontSize: 15,
  color: TEXT,
  background: "#fff",
  border: `1.5px solid ${BORDER}`,
  borderRadius: 12,
  outline: "none",
  boxSizing: "border-box",
};

const Step2 = ({ data, onBack, onPay }: { data: WizardData; onBack: () => void; onPay: () => void }) => {
  const plan = PLANS.find((p) => p.id === data.plan) || PLANS[1];
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [processing, setProcessing] = useState(false);

  const cardValid =
    card.number.replace(/\s/g, "").length >= 16 &&
    /^\d{2}\/\d{2}$/.test(card.expiry) &&
    card.cvc.length >= 3 &&
    card.name.trim().length > 0;

  const pay = () => {
    if (!cardValid || processing) return;
    setProcessing(true);
    setTimeout(() => onPay(), 900);
  };

  return (
    <SplitLayout
      left={{
        title: "Plus qu'une étape",
        subtitle: "Paiement sécurisé · vos données ne sont jamais stockées chez nous.",
        bullets: [
          { icon: "🔒", text: "Paiement chiffré via Stripe" },
          { icon: "↺", text: "Remboursable 7 jours" },
          { icon: "✓", text: "Activation immédiate" },
        ],
        showPhone: true,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            fontFamily: '"Public Sans", sans-serif',
            fontSize: 13,
            color: TEXT_3,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          ← Retour
        </button>
      </div>

      <h2 style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: 24, color: TEXT, margin: "0 0 6px", letterSpacing: "-0.015em" }}>Validez votre formule</h2>
      <p style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 14.5, color: TEXT_2, margin: "0 0 22px" }}>Un paiement unique, pas d'abonnement.</p>

      {/* Recap */}
      <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "16px 18px", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 11.5, fontWeight: 700, color: ACCENT, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
              Plan {plan.name}
            </div>
            <div style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: 17, color: TEXT, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {data.name || "Votre événement"}
            </div>
            <div style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 13, color: TEXT_2, marginTop: 2 }}>
              {data.date ? formatDateFR(data.date) : "—"} · {plan.photos} · {plan.duree}
            </div>
          </div>
          <div style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: 32, color: TEXT, letterSpacing: "-0.025em", flexShrink: 0 }}>{plan.price}€</div>
        </div>
      </div>

      {/* Stripe-style payment card */}
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 16, padding: "20px 20px 22px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: STRIPE_PURPLE,
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: '"Josefin Sans", sans-serif',
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "-0.02em",
            }}
          >
            S
          </div>
          <div style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 13, fontWeight: 600, color: TEXT }}>Paiement sécurisé par Stripe</div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
            {["VISA", "MC", "AMEX"].map((c) => (
              <span
                key={c}
                style={{
                  fontFamily: '"Public Sans", sans-serif',
                  fontSize: 9.5,
                  fontWeight: 700,
                  background: BG,
                  color: TEXT_2,
                  padding: "3px 7px",
                  borderRadius: 4,
                  letterSpacing: "0.04em",
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <Field label="Numéro de carte">
          <input
            type="text"
            inputMode="numeric"
            placeholder="1234 5678 9012 3456"
            value={card.number}
            onChange={(e) => setCard((c) => ({ ...c, number: formatCardNumber(e.target.value) }))}
            style={inputBase}
          />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Expiration">
            <input
              type="text"
              inputMode="numeric"
              placeholder="MM/AA"
              value={card.expiry}
              onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))}
              style={inputBase}
            />
          </Field>
          <Field label="CVC">
            <input
              type="text"
              inputMode="numeric"
              placeholder="123"
              value={card.cvc}
              onChange={(e) => setCard((c) => ({ ...c, cvc: formatCVC(e.target.value) }))}
              style={inputBase}
            />
          </Field>
        </div>

        <Field label="Nom sur la carte">
          <input
            type="text"
            placeholder="JULIE MOREAU"
            value={card.name}
            onChange={(e) => setCard((c) => ({ ...c, name: e.target.value.toUpperCase() }))}
            style={{ ...inputBase, textTransform: "uppercase", letterSpacing: "0.04em" }}
          />
        </Field>
      </div>

      <PrimaryButton onClick={pay} disabled={!cardValid || processing} fullWidth large>
        {processing ? "Paiement en cours…" : `Payer ${plan.price}€ →`}
      </PrimaryButton>

      <p style={{ textAlign: "center", margin: "14px 0 0", fontFamily: '"Public Sans", sans-serif', fontSize: 12.5, color: TEXT_3, lineHeight: 1.5 }}>
        🔒 Paiement sécurisé · Données chiffrées de bout en bout
      </p>
    </SplitLayout>
  );
};

// ============ Wizard ============
const NouvelEvenement = () => {
  const location = useLocation();
  const initialPlan = useMemo(() => {
    const p = new URLSearchParams(location.search).get("plan");
    if (p && PLANS.some((pl) => pl.id === p)) return p;
    return "essentiel";
  }, [location.search]);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [data, setData] = useState<WizardData>({
    plan: initialPlan,
    name: "",
    code: "",
    codeManuallyEdited: false,
    date: "",
    email: "",
  });
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    setData((d) => ({ ...d, plan: initialPlan }));
  }, [initialPlan]);

  const plan = PLANS.find((p) => p.id === data.plan) || PLANS[1];

  const goNext = () => {
    if (plan.price === 0) {
      setPaid(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setDirection("forward");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setDirection("back");
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onPaid = () => {
    setPaid(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (paid) {
    return (
      <SplitLayout
        left={{
          title: "C'est parti !",
          subtitle: "Votre galerie est prête. Partagez le code à vos invités.",
          bullets: [
            { icon: "✓", text: "Galerie créée" },
            { icon: "📤", text: "Partagez le code" },
            { icon: "📸", text: "Recevez les photos" },
          ],
        }}
      >
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #00AB55, #00D26A)",
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            ✓
          </div>
          <h2 style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: 28, color: TEXT, margin: "0 0 10px" }}>Galerie créée !</h2>
          <p style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 15, color: TEXT_2, margin: "0 0 24px", lineHeight: 1.55 }}>
            Un email a été envoyé à <strong style={{ color: TEXT }}>{data.email}</strong> avec le lien pour gérer votre galerie.
          </p>
          <div style={{ background: BG, borderRadius: 16, padding: "20px", marginBottom: 24 }}>
            <div style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 12, color: TEXT_2, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Code d'accès</div>
            <div style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: 32, color: ACCENT, letterSpacing: "0.04em" }}>{data.code || suggestCodeFromName(data.name)}</div>
          </div>
          <Link to="/" style={{ textDecoration: "none" }}>
            <PrimaryButton fullWidth large>Retour à l'accueil</PrimaryButton>
          </Link>
        </div>
      </SplitLayout>
    );
  }

  return (
    <div key={step} style={{ minHeight: "100vh", animation: `kapsulSlide${direction === "forward" ? "In" : "InBack"} 0.35s cubic-bezier(.22,1,.36,1)` }}>
      {step === 1 ? (
        <Step1 data={data} setData={setData} onNext={goNext} />
      ) : (
        <Step2 data={data} onBack={goBack} onPay={onPaid} />
      )}
    </div>
  );
};

export default NouvelEvenement;
