import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import polyMariage from "@/assets/invite-mariage.jpg";
import polySoiree from "@/assets/invite-soiree.jpg";
import polyEvjf from "@/assets/invite-evjf.jpg";

const EVENT = {
  name: "Mariage de Julie & Thomas",
  date: "15 septembre 2026 · Domaine de Valbrune",
  validCode: "JULIE2026",
  hosts: ["Julie", "Thomas"],
  stats: [
    { num: "3 jours", lbl: "Galerie ouverte" },
    { num: "∞", lbl: "Photos & vidéos" },
  ],
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIRSTNAME_RE = /^[A-Za-zÀ-ÖØ-öø-ÿ'’-]+$/;
const PALETTES: [string, string][] = [
  ["#FFD9D6", "#FF6961"], ["#FFE2C0", "#FFA94D"], ["#D6E9FF", "#669EFF"],
  ["#FFDCEC", "#FF6BAA"], ["#D9F2E1", "#3DBA76"], ["#E5DBFF", "#9A7BFF"],
  ["#FFF1B8", "#FFC95A"], ["#E1F4F4", "#5BC0BE"], ["#FFE6D5", "#FF8A65"],
];

const BrandPanel = () => (
  <aside className="gi-brand">
    <div className="gi-brand-top">
      <Link to="/" className="gi-logo"><span className="gi-logo-dot" />Kapsul</Link>
    </div>
    <div className="gi-hero">
      <span className="gi-eyebrow"><span className="gi-eyebrow-dot" />Galerie privée</span>
      <h1 className="gi-event-title">{EVENT.name}</h1>
      <p className="gi-event-meta">{EVENT.date}</p>
      <p className="gi-event-meta" style={{ marginBottom: 0, fontSize: 15 }}>
        Partagez vos plus beaux clichés, retrouvez ceux des autres invités, et récupérez l'album complet à la fin de l'événement.
      </p>
      <div className="gi-event-stats">
        {EVENT.stats.map((s, i) => (
          <div key={i}><div className="gi-stat-num">{s.num}</div><div className="gi-stat-lbl">{s.lbl}</div></div>
        ))}
      </div>
    </div>
    <div className="gi-polaroid-stack" aria-hidden>
      <div className="gi-polaroid gi-poly-1">
        <div className="gi-poly-img" style={{ backgroundImage: `url(${polyMariage})` }} />
        <div className="gi-poly-caption">Mariage</div>
      </div>
      <div className="gi-polaroid gi-poly-2">
        <div className="gi-poly-img" style={{ backgroundImage: `url(${polySoiree})` }} />
        <div className="gi-poly-caption">Soirée entre amis</div>
      </div>
      <div className="gi-polaroid gi-poly-3">
        <div className="gi-poly-img" style={{ backgroundImage: `url(${polyEvjf})` }} />
        <div className="gi-poly-caption">EVJF</div>
      </div>
    </div>
    <div className="gi-brand-footer">
      <div className="gi-host-avatars">
        <div className="gi-host-avatar" style={{ background: "linear-gradient(135deg,#FFD9D6,#FF6961)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>J</div>
      </div>
      <span>Organisé par {EVENT.hosts[0]}</span>
    </div>
  </aside>
);

const StepDots = ({ step }: { step: 1 | 2 }) => (
  <div className="gi-step">
    <div className="gi-dots">
      {[1, 2].map((n) => (
        <span key={n} className={`gi-dot ${step === n ? "is-active" : step > n ? "is-done" : ""}`} />
      ))}
    </div>
    Étape {step} sur 2
  </div>
);

const Screen1 = ({ onSubmit }: { onSubmit: (d: { email: string }) => void }) => {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const emailValid = EMAIL_RE.test(email.trim());
  const emailError = emailTouched && !emailValid ? (email.trim() ? "Format d'email invalide." : "Email obligatoire.") : null;
  const canSubmit = code.trim() && emailValid;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!emailValid) { setEmailTouched(true); return; }
    if (!code.trim()) return;
    if (code.trim().toUpperCase() === EVENT.validCode) { setCodeError(null); onSubmit({ email }); }
    else setCodeError("Code incorrect. Vérifiez et réessayez.");
  };

  return (
    <form className="gi-screen" onSubmit={handleSubmit} noValidate>
      <StepDots step={1} />
      <h2 className="gi-h1">Vous êtes invité !</h2>
      <p className="gi-sub">Entrez le code reçu par les organisateurs pour rejoindre la galerie.</p>

      <div className="gi-field">
        <div className="gi-label-row"><span className="gi-label">Code d'accès</span><span className="gi-badge">Obligatoire</span></div>
        <input
          className={`gi-input uppercase ${codeError ? "is-error" : ""}`}
          type="text" autoCapitalize="characters" autoComplete="off"
          placeholder="ex : JULIE2026" value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setCodeError(null); }}
          autoFocus
        />
        {codeError && <div className="gi-error"><span className="gi-error-dot">!</span>{codeError}</div>}
      </div>

      <div className="gi-field">
        <div className="gi-label-row"><span className="gi-label">Votre email</span><span className="gi-badge">Obligatoire</span></div>
        <input
          className={`gi-input ${emailError ? "is-error" : ""}`}
          type="email" autoComplete="email" placeholder="prenom@exemple.com"
          value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setEmailTouched(true)}
        />
        {emailError ? (
          <div className="gi-error"><span className="gi-error-dot">!</span>{emailError}</div>
        ) : (
          <div className="gi-help">Pour recevoir le ZIP des photos à la fin de l'événement.</div>
        )}
      </div>

      <button type="submit" className="gi-cta" disabled={!canSubmit}>Accéder à la galerie →</button>
      <p className="gi-footnote">En continuant, vous acceptez les <a href="#">conditions</a> et la <a href="#">politique de confidentialité</a>.</p>
    </form>
  );
};

const Screen2 = ({ onSubmit, onBack }: { onSubmit: (p: { firstName: string; avatar: string | null }) => void; onBack: () => void }) => {
  const [firstName, setFirstName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const valid = FIRSTNAME_RE.test(firstName.trim());

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(f);
  };

  return (
    <form className="gi-screen" onSubmit={(e) => { e.preventDefault(); if (valid) onSubmit({ firstName, avatar }); }}>
      <StepDots step={2} />
      <h2 className="gi-h1">Présentez-vous</h2>
      <p className="gi-sub">Pour que les autres invités sachent qui a pris quelle photo.</p>

      <div className="gi-avatar-wrap">
        <button
          type="button" onClick={() => fileRef.current?.click()}
          className={`gi-avatar-btn ${avatar ? "has-img" : ""}`}
          style={avatar ? { backgroundImage: `url(${avatar})` } : undefined}
          aria-label={avatar ? "Changer la photo" : "Ajouter une photo"}
        >
          {!avatar && (firstName.trim() ? firstName.trim()[0].toUpperCase() : "＋")}
          {avatar && <span className="gi-avatar-edit">✎</span>}
        </button>
        <button type="button" className="gi-avatar-action" onClick={() => fileRef.current?.click()}>
          {avatar ? "Changer la photo" : "Ajouter une photo"}
        </button>
        <span className="gi-avatar-hint">Optionnel · JPG ou PNG · 5 Mo max</span>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} style={{ display: "none" }} />
      </div>

      <div className="gi-field">
        <div className="gi-label-row"><span className="gi-label">Votre prénom</span><span className="gi-badge">Obligatoire</span></div>
        <input
          className={`gi-input ${firstName.trim() && !FIRSTNAME_RE.test(firstName.trim()) ? "is-error" : ""}`}
          type="text"
          placeholder="Votre prénom"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value.replace(/\s+/g, " ").trimStart())}
          autoComplete="given-name"
          autoFocus
        />
        {firstName.trim() && !FIRSTNAME_RE.test(firstName.trim()) && (
          <div className="gi-error"><span className="gi-error-dot">!</span>Un seul prénom (sans espace ni chiffre).</div>
        )}
      </div>

      <div className="gi-cta-row">
        <button type="button" onClick={onBack} className="gi-cta-back" aria-label="Retour">←</button>
        <button type="submit" className="gi-cta" disabled={!valid} style={{ marginTop: 0, flex: 1 }}>Rejoindre la galerie →</button>
      </div>
    </form>
  );
};

const Invite = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [, setEmailFromStep1] = useState("");
  const [, setProfile] = useState<{ firstName: string; avatar: string | null } | null>(null);

  return (
    <div className="gi-shell">
      <BrandPanel />
      <main className="gi-form-panel">
        <div className="gi-form-inner">
          {step === 1 && <Screen1 onSubmit={({ email }) => { setEmailFromStep1(email); setStep(2); }} />}
          {step === 2 && <Screen2 onBack={() => setStep(1)} onSubmit={(p) => { setProfile(p); }} />}
        </div>
      </main>
    </div>
  );
};

export default Invite;
