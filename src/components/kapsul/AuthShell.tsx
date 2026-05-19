import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export const mockUser = {
  prenom: "Julie",
  nom: "Moreau",
  email: "julie@agence-roses.fr",
  password: "Demo123!",
};

export const EyeIcon = ({ off }: { off?: boolean }) =>
  off ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

export const ArrowRight = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

type Variant = "login" | "signup";

const BRAND_COPY: Record<Variant, { eyebrow: string; title: string; lead: string; captions: [string, string, string] }> = {
  login: {
    eyebrow: "Espace organisateur",
    title: "Vos galeries vous attendent.",
    lead: "Retrouvez vos événements, suivez les photos en direct, et téléchargez l'album complet en un clic.",
    captions: ["Mariage · Julie & Thomas", "Anniversaire · Léa 30 ans", "Séminaire · Acme 2026"],
  },
  signup: {
    eyebrow: "Créer un compte",
    title: "Votre première galerie en 3 minutes.",
    lead: "Créez votre compte organisateur, lancez votre premier événement, partagez le QR code à vos invités — c'est tout.",
    captions: ["Mariage · J&T 09/26", "Soirée · Studio 14", "Voyage · Bali 2026"],
  },
};

const BrandPanel = ({ variant }: { variant: Variant }) => {
  const copy = BRAND_COPY[variant];
  return (
    <aside className="ka-brand">
      <div className="ka-brand-top">
        <Link to="/" className="ka-logo">
          <span className="ka-logo-dot" />
          Kapsul
        </Link>
        <Link to="/" className="ka-back-link">← Retour au site</Link>
      </div>

      <div className="ka-hero">
        <span className="ka-eyebrow">
          <span className="ka-eyebrow-dot" />
          {copy.eyebrow}
        </span>
        <h1 className="ka-h1-brand">{copy.title}</h1>
        <p className="ka-lead">{copy.lead}</p>
      </div>

      <div className="ka-polaroid-stack" aria-hidden>
        <div className="ka-polaroid ka-poly-1"><div className="ka-poly-img" /><div className="ka-poly-cap">{copy.captions[0]}</div></div>
        <div className="ka-polaroid ka-poly-2"><div className="ka-poly-img" /><div className="ka-poly-cap">{copy.captions[1]}</div></div>
        <div className="ka-polaroid ka-poly-3"><div className="ka-poly-img" /><div className="ka-poly-cap">{copy.captions[2]}</div></div>
      </div>

      <div className="ka-brand-footer">
        <div><div className="ka-stat-num">+500</div><div className="ka-stat-lbl">Événements</div></div>
        <div><div className="ka-stat-num">120k</div><div className="ka-stat-lbl">Photos partagées</div></div>
        <div><div className="ka-stat-num">4.9/5</div><div className="ka-stat-lbl">Satisfaction</div></div>
      </div>
    </aside>
  );
};

export const FormShell = ({ brandVariant, children }: { brandVariant: Variant; children: ReactNode }) => (
  <div className="ka-shell">
    <BrandPanel variant={brandVariant} />
    <main className="ka-form-panel">
      <div className="ka-form-top">
        <Link to="/" className="ka-form-top-back" aria-label="Retour à l'accueil">←</Link>
        <Link to="/" className="ka-logo"><span className="ka-logo-dot" />Kapsul</Link>
      </div>
      <div className="ka-form-inner">{children}</div>
    </main>
  </div>
);

export const SuccessScreen = ({ result }: { result: { kind: "login" | "signup"; email?: string } }) => (
  <div className="ka-screen ka-success-wrap">
    <div className="ka-success-icon">✓</div>
    <h2 className="ka-h1">{result.kind === "login" ? `Bienvenue ${mockUser.prenom} !` : "Compte créé !"}</h2>
    <p className="ka-sub" style={{ marginBottom: 24 }}>
      {result.kind === "login" ? (
        "Redirection vers votre tableau de bord…"
      ) : (
        <>Un email de vérification a été envoyé à <strong style={{ color: "#212B36" }}>{result.email}</strong>. Cliquez sur le lien pour activer votre compte.</>
      )}
    </p>
    {result.kind === "login" ? (
      <Link to="/nouvel-evenement" className="ka-cta">Aller au dashboard <ArrowRight /></Link>
    ) : (
      <Link to="/login" className="ka-cta">Aller à la connexion <ArrowRight /></Link>
    )}
  </div>
);
