import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { FormShell, SuccessScreen, EyeIcon, ArrowRight, mockUser } from "@/components/kapsul/AuthShell";

const LoginForm = ({ onSuccess }: { onSuccess: (r: { kind: "login"; email: string }) => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canSubmit = email.trim().length > 0 && password.length > 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (email.trim().toLowerCase() === mockUser.email && password === mockUser.password) {
      setError(null);
      onSuccess({ kind: "login", email });
    } else {
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <form className="ka-screen" onSubmit={handleSubmit} noValidate>
      <h2 className="ka-h1">Bon retour !</h2>
      <p className="ka-sub">Connectez-vous pour gérer vos événements et galeries. Espace réservé aux organisateurs.</p>

      <div className="ka-field">
        <div className="ka-label-row"><span className="ka-label">Email</span></div>
        <input
          className={`ka-input ${error ? "is-error" : ""}`}
          type="email"
          autoComplete="email"
          placeholder="vous@exemple.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(null); }}
          autoFocus
        />
      </div>

      <div className="ka-field">
        <div className="ka-label-row">
          <span className="ka-label">Mot de passe</span>
          <a href="#" className="ka-forgot" onClick={(e) => { e.preventDefault(); alert("Réinitialisation à venir"); }}>Mot de passe oublié ?</a>
        </div>
        <div className="ka-input-wrap">
          <input
            className={`ka-input with-eye ${error ? "is-error" : ""}`}
            type={showPwd ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(null); }}
          />
          <button type="button" className="ka-eye" onClick={() => setShowPwd((s) => !s)} aria-label={showPwd ? "Masquer" : "Afficher"}>
            <EyeIcon off={showPwd} />
          </button>
        </div>
      </div>

      <button type="submit" className="ka-cta" disabled={!canSubmit}>
        Se connecter <ArrowRight />
      </button>

      {error && (
        <div className="ka-error-banner">
          <span className="ka-error-dot">!</span>
          {error}
        </div>
      )}

      <p className="ka-switch">
        Pas encore de compte ?
        <Link to="/signup">Créer un compte organisateur</Link>
      </p>
    </form>
  );
};

const Login = () => {
  const [result, setResult] = useState<{ kind: "login"; email: string } | null>(null);
  return (
    <FormShell brandVariant="login">
      {result ? <SuccessScreen result={result} /> : <LoginForm onSuccess={setResult} />}
    </FormShell>
  );
};

export default Login;
