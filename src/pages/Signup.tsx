import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { FormShell, SuccessScreen, EyeIcon, ArrowRight } from "@/components/kapsul/AuthShell";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const checkPwdRules = (pwd: string, confirm: string) => ({
  length: pwd.length >= 8,
  upper: /[A-Z]/.test(pwd),
  digit: /\d/.test(pwd),
  special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(pwd),
  match: pwd.length > 0 && pwd === confirm,
});

const SignupForm = ({ onSuccess }: { onSuccess: (r: { kind: "signup"; email: string }) => void }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [tos, setTos] = useState(false);

  const rules = checkPwdRules(password, confirm);
  const allRules = rules.length && rules.upper && rules.digit && rules.special && rules.match;
  const basicsFilled = firstName.trim() && lastName.trim() && EMAIL_RE.test(email.trim());
  const canSubmit = Boolean(basicsFilled && allRules && tos);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSuccess({ kind: "signup", email });
  };

  return (
    <form className="ka-screen" onSubmit={handleSubmit} noValidate>
      <h2 className="ka-h1">Créez votre compte organisateur</h2>
      <p className="ka-sub">Quelques infos et vous démarrez votre première galerie. Réservé aux organisateurs et administrateurs.</p>

      <div className="ka-field-row">
        <div>
          <div className="ka-label-row"><span className="ka-label">Prénom</span></div>
          <input className="ka-input" type="text" autoComplete="given-name" placeholder="Julie" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoFocus />
        </div>
        <div>
          <div className="ka-label-row"><span className="ka-label">Nom</span></div>
          <input className="ka-input" type="text" autoComplete="family-name" placeholder="Moreau" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
      </div>

      <div className="ka-field">
        <div className="ka-label-row"><span className="ka-label">Email professionnel</span></div>
        <input className="ka-input" type="email" autoComplete="email" placeholder="vous@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="ka-field">
        <div className="ka-label-row"><span className="ka-label">Mot de passe</span></div>
        <div className="ka-input-wrap">
          <input
            className="ka-input with-eye"
            type={showPwd ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" className="ka-eye" onClick={() => setShowPwd((s) => !s)} aria-label={showPwd ? "Masquer" : "Afficher"}>
            <EyeIcon off={showPwd} />
          </button>
        </div>
      </div>

      <div className="ka-field">
        <div className="ka-label-row"><span className="ka-label">Confirmer le mot de passe</span></div>
        <div className="ka-input-wrap">
          <input
            className={`ka-input with-eye ${confirm && !rules.match ? "is-error" : ""}`}
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button type="button" className="ka-eye" onClick={() => setShowConfirm((s) => !s)} aria-label={showConfirm ? "Masquer" : "Afficher"}>
            <EyeIcon off={showConfirm} />
          </button>
        </div>

        <div className="ka-checklist" role="status" aria-live="polite">
          {[
            { ok: rules.length, t: "8 caractères minimum" },
            { ok: rules.upper, t: "1 majuscule" },
            { ok: rules.digit, t: "1 chiffre" },
            { ok: rules.special, t: "1 caractère spécial" },
            { ok: rules.match, t: "Les 2 mots de passe correspondent" },
          ].map((r, i) => (
            <div key={i} className={`ka-check ${r.ok ? "ok" : "ko"}`}>
              <span className="ka-check-dot">{r.ok ? "✓" : "·"}</span>
              {r.t}
            </div>
          ))}
        </div>
      </div>

      <label className="ka-checkbox">
        <input type="checkbox" checked={tos} onChange={(e) => setTos(e.target.checked)} />
        <span className="ka-checkbox-box">✓</span>
        <span className="ka-checkbox-text">
          J'accepte les <a href="#">conditions d'utilisation</a> et la <a href="#">politique de confidentialité</a>.
        </span>
      </label>

      <button type="submit" className="ka-cta" disabled={!canSubmit}>
        Créer mon compte <ArrowRight />
      </button>

      <p className="ka-switch">
        Déjà un compte ?
        <Link to="/login">Se connecter</Link>
      </p>
    </form>
  );
};

const Signup = () => {
  const [result, setResult] = useState<{ kind: "signup"; email: string } | null>(null);
  return (
    <FormShell brandVariant="signup">
      {result ? <SuccessScreen result={result} /> : <SignupForm onSuccess={setResult} />}
    </FormShell>
  );
};

export default Signup;
