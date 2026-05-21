import { useEffect, useMemo, useState, FormEvent } from "react";
import { Reveal } from "@/components/kapsul/Reveal";
import { PhoneMockup } from "@/components/kapsul/PhoneMockup";
import feedScreen from "@/assets/phone-feed-screen.png";

const ACCENT = "#FF4842";

const hexToRgba = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

const Navbar = ({ accent }: { accent: string }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav style={{ position: "sticky", top: 0, background: "#fff", zIndex: 100, boxShadow: scrolled ? "0 4px 16px rgba(33,43,54,0.06)" : "none", transition: "box-shadow 0.3s" }}>
      <div className="kapsul-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 0" }}>
        <a href="#" style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: 26, color: accent, textDecoration: "none", letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: accent, display: "inline-block" }} />
          Kapsul
        </a>
        <div className="kapsul-nav-links" style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {["Fonctionnalités", "Tarifs", "Pour les pros"].map((l) => (
            <a key={l} href={`#${l}`} style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 14, color: "#212B36", fontWeight: 500, textDecoration: "none" }}>
              {l}
            </a>
          ))}
        </div>
        <div className="kapsul-nav-cta" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="#" style={{ background: accent, color: "#fff", border: "none", borderRadius: 100, padding: "11px 20px", fontFamily: '"Public Sans", sans-serif', fontWeight: 600, fontSize: 14, cursor: "pointer", textDecoration: "none", boxShadow: `0 6px 16px ${accent}33`, display: "inline-flex", alignItems: "center", gap: 8 }}>
            Me connecter
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
        <button className="kapsul-burger" onClick={() => setMobileOpen((o) => !o)} style={{ display: "none", background: "transparent", border: "none", cursor: "pointer", padding: 8 }} aria-label="Menu">
          <div style={{ width: 22, height: 2, background: "#212B36", margin: "4px 0" }} />
          <div style={{ width: 22, height: 2, background: "#212B36", margin: "4px 0" }} />
          <div style={{ width: 22, height: 2, background: "#212B36", margin: "4px 0" }} />
        </button>
      </div>
      {mobileOpen && (
        <div style={{ padding: "0 24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
          {["Fonctionnalités", "Tarifs", "Pour les pros"].map((l) => (
            <a key={l} href={`#${l}`} style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 16, color: "#212B36", fontWeight: 500, textDecoration: "none" }}>
              {l}
            </a>
          ))}
          <button style={{ background: accent, color: "#fff", border: "none", borderRadius: 100, padding: "12px 24px", fontFamily: '"Public Sans", sans-serif', fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Créer mon événement</button>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ accent, accentLight, onContact }: { accent: string; accentLight: string; onContact: () => void }) => {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const timers = [80, 280, 480, 700].map((t, i) => setTimeout(() => setStage((s) => Math.max(s, i + 1)), t));
    return () => timers.forEach(clearTimeout);
  }, []);
  const fade = (i: number) => ({ opacity: stage > i ? 1 : 0, transform: stage > i ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(.22,1,.36,1)" });

  const headline = "Ajoutez du **kapsul** à votre événement";
  const renderHeadline = () =>
    headline.split(/(\*\*.*?\*\*)/).map((p, i) =>
      p.startsWith("**") && p.endsWith("**") ? (
        <span key={i} style={{ color: accent, fontStyle: "italic" }}>{p.slice(2, -2)}</span>
      ) : (
        <span key={i}>{p}</span>
      )
    );

  return (
    <section style={{ padding: "60px 0 80px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -120, right: -80, width: 400, height: 400, background: `radial-gradient(circle, ${accent}15 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div className="kapsul-container">
        <div className="kapsul-hero-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 60, alignItems: "center" }}>
          <div>
            <div style={fade(0)}>
              <span style={{ display: "inline-block", background: accentLight, color: accent, fontFamily: '"Public Sans", sans-serif', fontWeight: 600, fontSize: 13, padding: "7px 16px", borderRadius: 100, marginBottom: 24 }}>● Galeries photo éphémères</span>
            </div>
            <h1 style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.02em", color: "#212B36", margin: "0 0 22px", textWrap: "balance" as never, ...fade(1) }}>
              {renderHeadline()}
            </h1>
            <p style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 17, lineHeight: 1.55, color: "#637381", margin: "0 0 32px", maxWidth: 520, ...fade(1) }}>
              Créez votre événement, partagez un QR code, et collectez tous les souvenirs de vos invités en temps réel. Sans app, sans inscription, sans prise de tête.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", ...fade(2) }}>
              <a href="#" style={{ background: accent, color: "#fff", border: "none", borderRadius: 100, padding: "16px 30px", fontFamily: '"Public Sans", sans-serif', fontWeight: 600, fontSize: 15, cursor: "pointer", textDecoration: "none", display: "inline-block", boxShadow: `0 10px 24px ${accent}40` }}>Créer mon événement — gratuitement</a>
              <button type="button" onClick={onContact} style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 14, color: "#212B36", fontWeight: 500, padding: "15px 22px", borderRadius: 100, border: "1.5px solid #DFE3E8", background: "#fff", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
                Je suis une agence ou une entreprise
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
            <div style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 13, color: "#919EAB", marginTop: 28, display: "flex", gap: 18, flexWrap: "wrap", ...fade(2) }}>
              <span>· +500 événements</span>
              <span>· Export photo inclus</span>
              <span>· Zéro inscription invité</span>
            </div>
          </div>
          <div style={fade(3)}>
            <PhoneMockup accent={accent} accentLight={accentLight} />
          </div>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = ({ accent, accentLight }: { accent: string; accentLight: string }) => {
  const steps = [
    { n: 1, t: "Créez votre événement", d: "Donnez un nom, choisissez votre formule, personnalisez l'apparence. Votre QR code est généré instantanément." },
    { n: 2, t: "Partagez le QR code", d: "Imprimez-le ou envoyez le lien. Vos invités accèdent sans app, sans compte." },
    { n: 3, t: "Profitez en temps réel", d: "Tous les souvenirs s'accumulent automatiquement. Visualisez ce que prennent vos invités grâce au feed et à la galerie." },
    { n: 4, t: "Exportez vos souvenirs", d: "Téléchargez toutes les photos prises par vos invités en haute qualité, à la fin de l'événement." },
  ];
  return (
    <section style={{ background: "#F4F6F8", padding: "100px 0" }}>
      <div className="kapsul-container">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 13, color: accent, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Comment ça marche</span>
            <h2 style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: "clamp(32px, 4vw, 44px)", color: "#212B36", margin: "12px 0 0", letterSpacing: "-0.02em" }}>En 3 minutes, c'est prêt</h2>
          </div>
        </Reveal>
        <div className="kapsul-steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 120}>
              <div style={{ background: "#fff", borderRadius: 20, padding: "36px 28px", height: "100%", boxSizing: "border-box" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", border: `2px solid ${accent}`, background: accentLight, color: accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: 22, marginBottom: 22 }}>{s.n}</div>
                <h3 style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: 22, color: "#212B36", margin: "0 0 10px", letterSpacing: "-0.01em" }}>{s.t}</h3>
                <p style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 14.5, lineHeight: 1.6, color: "#637381", margin: 0 }}>{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Features = ({ accent, accentLight }: { accent: string; accentLight: string }) => {
  const features = [
    { icon: "⇪", t: "Upload en masse", d: "50 photos simultanées, depuis le téléphone, sans app." },
    { icon: "⟳", t: "Feed temps réel", d: "Photos, likes et commentaires apparaissent instantanément pour tous." },
    { icon: "▤", t: "QR code prêt à imprimer", d: "PNG haute résolution 300 DPI." },
    { icon: "✦", t: "Zéro inscription invité", d: "Scan + prénom + code. Aucune friction." },
    { icon: "↗", t: "Export des photos", d: "Toutes les photos téléchargeable J+30." },
    { icon: "◔", t: "Sécurité & RGPD", d: "Stockage en europe, suppression automatique et RGPD-friendly." },
  ];
  return (
    <section id="Fonctionnalités" style={{ padding: "100px 0" }}>
      <div className="kapsul-container">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 13, color: accent, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Fonctionnalités</span>
            <h2 style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: "clamp(32px, 4vw, 44px)", color: "#212B36", margin: "12px 0 0", letterSpacing: "-0.02em" }}>Tout ce dont vous avez besoin</h2>
          </div>
        </Reveal>
        <Reveal>
          <div className="kapsul-features-feed" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 60, alignItems: "center", marginBottom: 80, background: `linear-gradient(135deg, ${accentLight} 0%, transparent 70%)`, borderRadius: 28, padding: "60px 60px 40px" }}>
            <div>
              <div style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 12, color: accent, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Le feed temps réel</div>
              <h3 style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: 32, color: "#212B36", margin: "0 0 18px", letterSpacing: "-0.02em" }}>Voyez les photos arriver en direct</h3>
              <p style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 16, lineHeight: 1.6, color: "#637381", margin: "0 0 14px" }}>
                Chaque photo prise par un invité apparaît instantanément dans le feed. Likes, commentaires, et une galerie complète à la fin de la soirée.
              </p>
              <div style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 13, color: "#919EAB", display: "flex", gap: 16, flexWrap: "wrap", marginTop: 18 }}>
                <span>● Mise à jour instantanée</span>
                <span>● Likes & commentaires</span>
                <span>● Vue galerie</span>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <PhoneMockup accent={accent} accentLight={accentLight} />
            </div>
          </div>
        </Reveal>
        <div className="kapsul-features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {features.map((f, i) => (
            <Reveal key={i} delay={(i % 3) * 100}>
              <div className="kapsul-feature-card" style={{ border: "1px solid #EEF0F2", borderRadius: 18, padding: 28, height: "100%", boxSizing: "border-box", background: "#fff" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: accentLight, color: accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 18, fontWeight: 700 }}>{f.icon}</div>
                <h3 style={{ fontFamily: '"Public Sans", sans-serif', fontWeight: 700, fontSize: 17, color: "#212B36", margin: "0 0 8px" }}>{f.t}</h3>
                <p style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 14, lineHeight: 1.55, color: "#637381", margin: 0 }}>{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = ({ accent, accentLight }: { accent: string; accentLight: string }) => {
  const plans = [
    { id: "essentiel", name: "Essentiel", price: "29", popular: false, bullets: ["500 photos", "1 mois de stockage (à partir du 1er jour)", "Environ 20 invités"], forWho: "Super pour anniversaire, baptême, fête de famille" },
    { id: "standard", name: "Standard", price: "79", popular: true, bullets: ["2 000 photos", "1 mois de stockage (à partir du 1er jour)", "Environ 100 invités"], forWho: "Super pour mariage, séminaire, fête d'entreprise" },
    { id: "premium", name: "Premium", price: "149", popular: false, bullets: ["5 000 photos", "1 mois de stockage (à partir du 1er jour)", "Environ 200 invités"], forWho: "Super pour grand mariage, festival, événement multi-jours" },
  ];
  return (
    <section id="Tarifs" style={{ background: "#F4F6F8", padding: "100px 0" }}>
      <div className="kapsul-container">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 13, color: accent, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Tarifs</span>
            <h2 style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: "clamp(32px, 4vw, 44px)", color: "#212B36", margin: "12px 0 8px", letterSpacing: "-0.02em" }}>Paiement unique — pas d'abonnement</h2>
            <p style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 16, color: "#637381", margin: 0 }}>Une formule par événement. Tout est inclus.</p>
          </div>
        </Reveal>
        <Reveal>
          <div style={{ background: "#fff", borderRadius: 16, padding: "32px 32px", marginBottom: 40, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap", border: `1px dashed ${accent}66` }}>
            <div style={{ flex: "1 1 320px" }}>
              <div style={{ display: "inline-block", background: accentLight, color: accent, fontFamily: '"Public Sans", sans-serif', fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>Gratuit</div>
              <h3 style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: 26, color: "#212B36", margin: "0 0 6px", letterSpacing: "-0.01em" }}>Découvrez Kapsul gratuitement</h3>
              <p style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 14.5, color: "#637381", margin: "0 0 6px" }}>50 photos · 7 jours · Zéro carte bancaire requise</p>
              <p style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 12, color: "#919EAB", margin: 0, fontStyle: "italic" }}>Parfait pour tester — EVJF, anniversaire intime</p>
            </div>
            <a href="#" style={{ background: "transparent", color: accent, border: `1.5px solid ${accent}`, borderRadius: 100, padding: "14px 26px", fontFamily: '"Public Sans", sans-serif', fontWeight: 600, fontSize: 14, cursor: "pointer", textDecoration: "none", flexShrink: 0 }}>Créer mon événement gratuit →</a>
          </div>
        </Reveal>
        <div className="kapsul-pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, alignItems: "stretch" }}>
          {plans.map((p, i) => (
            <Reveal key={i} delay={i * 100}>
              <div style={{ background: "#fff", borderRadius: 20, padding: p.popular ? "40px 32px" : "36px 32px", border: p.popular ? `3px solid ${accent}` : "1px solid #EEF0F2", position: "relative", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", transform: p.popular ? "translateY(-8px)" : "none", boxShadow: p.popular ? `0 20px 50px ${accent}25` : "none" }}>
                {p.popular && (
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: accent, color: "#fff", fontFamily: '"Public Sans", sans-serif', fontWeight: 700, fontSize: 11, padding: "6px 14px", borderRadius: 100, letterSpacing: "0.05em", textTransform: "uppercase" }}>★ Le plus populaire</div>
                )}
                <h3 style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: 22, color: "#212B36", margin: "0 0 4px" }}>{p.name}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8, marginTop: 4 }}>
                  <span style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: 48, color: "#212B36", lineHeight: 1, letterSpacing: "-0.03em" }}>{p.price}€</span>
                </div>
                <p style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 13, color: accent, margin: "4px 0 22px", fontStyle: "italic", fontWeight: 500 }}>{p.forWho}</p>
                <ul style={{ flex: 1, marginBottom: 24, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                  {p.bullets.map((b, k) => (
                    <li key={k} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontFamily: '"Public Sans", sans-serif', fontSize: 14.5, color: "#212B36", lineHeight: 1.45 }}>
                      <span style={{ flexShrink: 0, width: 18, height: 18, borderRadius: "50%", background: accentLight, color: accent, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, marginTop: 1 }}>✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <a href="#" style={{ background: p.popular ? accent : "transparent", color: p.popular ? "#fff" : accent, border: p.popular ? "none" : `1.5px solid ${accent}`, borderRadius: 100, padding: "14px 24px", fontFamily: '"Public Sans", sans-serif', fontWeight: 600, fontSize: 14, cursor: "pointer", width: "100%", textAlign: "center", textDecoration: "none", display: "inline-block", boxSizing: "border-box", boxShadow: p.popular ? `0 8px 20px ${accent}40` : "none" }}>Choisir {p.name}</a>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div style={{ textAlign: "center", marginTop: 60 }}>
            <a href="/gros-evenement" style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 15, color: "#637381", textDecoration: "none" }}>
              Vous organisez un grand événement ?{" "}
              <span style={{ color: accent, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 4 }}>Voir les offres sur-mesure →</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const B2B = ({ accent, onContact }: { accent: string; onContact: () => void }) => {
  const args = [
    { icon: "◐", t: "Marque blanche complète", d: "Votre logo, vos couleurs, votre domaine. Kapsul est invisible." },
    { icon: "⚡", t: "Galerie créée en 5 min", d: "Dashboard simple. QR code immédiat." },
    { icon: "€", t: "Facturation automatique", d: "Stripe gère tout — abonnements, factures, relances." },
  ];
  return (
    <section id="Pour les pros" style={{ background: "#212B36", padding: "100px 0", color: "#fff" }}>
      <div className="kapsul-container">
        <div className="kapsul-b2b-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <Reveal>
            <span style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 13, color: accent, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Pour les pros</span>
            <h2 style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: "clamp(30px, 3.6vw, 40px)", color: "#fff", margin: "12px 0 18px", letterSpacing: "-0.02em" }}>Vous êtes une entreprise, un wedding planner, une agence de voyage…</h2>
            <p style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.6)", margin: "0 0 36px" }}>
              Proposez Kapsul à vos clients sous votre propre marque. Une plateforme événementielle invisible, sous votre nom de domaine.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 22, marginBottom: 36 }}>
              {args.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${accent}28`, color: accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, flexShrink: 0 }}>{a.icon}</div>
                  <div>
                    <div style={{ fontFamily: '"Public Sans", sans-serif', fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 4 }}>{a.t}</div>
                    <div style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 14, lineHeight: 1.55, color: "rgba(255,255,255,0.55)" }}>{a.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={150}>
            <button type="button" onClick={onContact} style={{ display: "block", width: "100%", textAlign: "left", background: `linear-gradient(155deg, ${accent} 0%, ${accent}dd 100%)`, color: "#fff", borderRadius: 24, padding: "56px 48px", border: "none", cursor: "pointer", boxShadow: `0 24px 60px ${accent}40`, position: "relative", overflow: "hidden", fontFamily: "inherit" }}>
              <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
              <div style={{ position: "absolute", bottom: -80, left: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
              <div style={{ position: "relative" }}>
                <div style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", marginBottom: 24 }}>Parlons-en</div>
                <div style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: "clamp(34px, 3.6vw, 46px)", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 28 }}>Me contacter →</div>
                <div style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.92)", marginBottom: 36, maxWidth: 380 }}>
                  On échange sur vos besoins, je vous prépare une démo et un devis sur mesure sous 24 h.
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: '"Public Sans", sans-serif', fontSize: 15, color: "rgba(255,255,255,0.95)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ opacity: 0.7 }}>✉</span><span style={{ fontWeight: 500 }}>hello@kapsul.app</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ opacity: 0.7 }}>↻</span><span>Réponse sous 24 h</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ opacity: 0.7 }}>◆</span><span>Démo personnalisée gratuite</span></div>
                </div>
              </div>
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const JoyfulMosaic = ({ accent }: { accent: string }) => {
  const tiles = [
    { label: "Mariage", emoji: "💍", g: ["#FFE4D6", "#FFB199"] },
    { label: "Anniversaire", emoji: "🎂", g: ["#FFF4D6", "#FFD66B"] },
    { label: "Soirée famille", emoji: "🎉", g: ["#E6F0FF", "#A0CBF5"] },
    { label: "Baptême", emoji: "👶", g: ["#FFE9F2", "#FFB6CE"] },
    { label: "EVJF", emoji: "🥂", g: ["#F0E6FF", "#C8A8F5"] },
    { label: "Entre amis", emoji: "🍾", g: ["#E6FFF1", "#7FE0AD"] },
    { label: "Séminaire", emoji: "✨", g: ["#FFF0E6", "#F5B07F"] },
    { label: "Festival", emoji: "🎶", g: ["#FFE6E6", "#F58A8A"] },
  ];
  return (
    <section style={{ padding: "100px 0", background: "#fff" }}>
      <div className="kapsul-container">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 13, color: accent, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Pour tous les moments</span>
            <h2 style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: "clamp(32px, 4vw, 44px)", color: "#212B36", margin: "12px 0 12px", letterSpacing: "-0.02em" }}>Chaque souvenir mérite sa kapsul</h2>
            <p style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 16, color: "#637381", margin: 0 }}>De l'EVJF au grand mariage — Kapsul s'adapte à votre événement.</p>
          </div>
        </Reveal>
        <div className="kapsul-mosaic-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "180px", gap: 14 }}>
          {tiles.map((t, i) => (
            <Reveal key={i} delay={(i % 4) * 80}>
              <div className="kapsul-mosaic-tile" style={{ borderRadius: 18, background: `linear-gradient(135deg, ${t.g[0]}, ${t.g[1]})`, position: "relative", overflow: "hidden", height: "100%" }}>
                <div style={{ position: "absolute", top: 16, left: 18, fontSize: 28, lineHeight: 1 }}>{t.emoji}</div>
                <div style={{ position: "absolute", bottom: 16, left: 18, right: 18, fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: 18, color: "#212B36", letterSpacing: "-0.01em" }}>{t.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Comparison = ({ accent, accentLight }: { accent: string; accentLight: string }) => {
  const rows = [
    { f: "Feed temps réel", k: true, w: false, g: false },
    { f: "Galerie unique pour tout l'événement", k: true, w: false, g: true },
    { f: "Pas de discussions parasites", k: true, w: false, g: true },
    { f: "Photos en haute qualité", k: true, w: false, g: true },
    { f: "Stockage en Europe (RGPD)", k: true, w: false, g: false },
    { f: "Aucune inscription pour les invités", k: true, w: false, g: false },
    { f: "QR code prêt à imprimer", k: true, w: false, g: false },
    { f: "Export complet à la fin", k: true, w: false, g: true },
  ];
  const Yes = ({ on }: { on: boolean }) =>
    on ? (
      <span style={{ display: "inline-flex", width: 26, height: 26, borderRadius: "50%", background: accentLight, color: accent, alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>✓</span>
    ) : (
      <span style={{ display: "inline-flex", width: 26, height: 26, borderRadius: "50%", background: "#F4F6F8", color: "#C4CDD5", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>—</span>
    );

  return (
    <section style={{ padding: "100px 0", background: "#F4F6F8" }}>
      <div className="kapsul-container">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <span style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 13, color: accent, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Pourquoi Kapsul</span>
            <h2 style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: "clamp(32px, 4vw, 44px)", color: "#212B36", margin: "12px 0 12px", letterSpacing: "-0.02em" }}>Pourquoi pas WhatsApp ou Google Drive ?</h2>
            <p style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 16, color: "#637381", margin: "0 auto", maxWidth: 560 }}>Vos invités vous envoient des photos. Mais où ? Comment ? Voici ce que ça change avec Kapsul.</p>
          </div>
        </Reveal>
        <Reveal>
          <div style={{ background: "#fff", borderRadius: 24, overflow: "hidden", boxShadow: "0 8px 30px rgba(33,43,54,0.06)" }}>
            <div className="kapsul-compare-head" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", padding: "24px 28px", borderBottom: "1px solid #EEF0F2", alignItems: "center" }}>
              <div />
              <div style={{ textAlign: "center", fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: 18, color: accent, letterSpacing: "-0.01em" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: accent, display: "inline-block" }} />
                  Kapsul
                </span>
              </div>
              <div style={{ textAlign: "center", fontFamily: '"Public Sans", sans-serif', fontWeight: 600, fontSize: 14, color: "#637381" }}>WhatsApp</div>
              <div style={{ textAlign: "center", fontFamily: '"Public Sans", sans-serif', fontWeight: 600, fontSize: 14, color: "#637381" }}>Google Drive</div>
            </div>
            {rows.map((r, i) => (
              <div key={i} className="kapsul-compare-row" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", padding: "18px 28px", background: i % 2 === 0 ? "#fff" : "#FAFBFC", alignItems: "center" }}>
                <div style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 14.5, color: "#212B36", fontWeight: 500 }}>{r.f}</div>
                <div style={{ textAlign: "center" }}><Yes on={r.k} /></div>
                <div style={{ textAlign: "center" }}><Yes on={r.w} /></div>
                <div style={{ textAlign: "center" }}><Yes on={r.g} /></div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const Testimonials = ({ accent }: { accent: string }) => {
  const items = [
    { name: "Sarah M.", role: "Mariée · Bordeaux", quote: "On a récupéré 847 photos de nos invités. Sans Kapsul on en aurait eu 50.", avatar: "#FFB199" },
    { name: "Camille D.", role: "Wedding planner · Paris", quote: "Mes clients adorent. La marque blanche est parfaite, ils ne voient que mon agence.", avatar: "#A0CBF5" },
    { name: "Thomas R.", role: "Anniversaire 40 ans · Lyon", quote: "Le QR code projeté sur l'écran, et les photos arrivaient en direct. Magique.", avatar: "#F5D789" },
  ];
  return (
    <section style={{ padding: "100px 0" }}>
      <div className="kapsul-container">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 13, color: accent, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Témoignages</span>
            <h2 style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: "clamp(32px, 4vw, 44px)", color: "#212B36", margin: "12px 0 0", letterSpacing: "-0.02em" }}>Ils ont utilisé Kapsul</h2>
          </div>
        </Reveal>
        <div className="kapsul-testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {items.map((t, i) => (
            <Reveal key={i} delay={i * 100}>
              <div style={{ background: "#fff", border: "1px solid #EEF0F2", borderRadius: 20, padding: 32, height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 18, color: "#FFB400", fontSize: 18 }}>★★★★★</div>
                <p style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 16, lineHeight: 1.55, color: "#212B36", margin: "0 0 28px", fontStyle: "italic", flex: 1 }}>"{t.quote}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: t.avatar, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: '"Public Sans", sans-serif', fontWeight: 700, color: "#fff", fontSize: 16 }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontFamily: '"Public Sans", sans-serif', fontWeight: 700, fontSize: 14, color: "#212B36" }}>{t.name}</div>
                    <div style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 12, color: "#637381", marginTop: 2 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const FinalCTA = ({ accent }: { accent: string }) => (
  <section style={{ background: "#F4F6F8", padding: "100px 0" }}>
    <div className="kapsul-container">
      <Reveal>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: "clamp(28px, 3.4vw, 38px)", color: "#212B36", margin: "0 0 16px", letterSpacing: "-0.02em" }}>Votre événement mérite mieux qu'un album WhatsApp.</h2>
          <p style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 17, color: "#637381", margin: "0 0 36px" }}>Créez votre événement en 3 minutes.</p>
          <button style={{ background: accent, color: "#fff", border: "none", borderRadius: 100, padding: "18px 36px", fontFamily: '"Public Sans", sans-serif', fontWeight: 600, fontSize: 16, cursor: "pointer", boxShadow: `0 14px 30px ${accent}45` }}>Créer mon événement maintenant →</button>
        </div>
      </Reveal>
    </div>
  </section>
);

const Footer = ({ accent }: { accent: string }) => (
  <footer style={{ background: "#212B36", color: "rgba(255,255,255,0.5)", padding: "50px 0" }}>
    <div className="kapsul-container">
      <div className="kapsul-footer-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 40, alignItems: "start" }}>
        <div>
          <div style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: 24, color: accent, display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: accent }} />
            Kapsul
          </div>
          <div style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 13, lineHeight: 1.55 }}>
            Galeries photo éphémères<br />pour vos événements.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 28, fontFamily: '"Public Sans", sans-serif', fontSize: 13 }}>
          <a href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Mentions légales</a>
          <a href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>CGV</a>
          <a href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>RGPD</a>
          <a href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Contact</a>
        </div>
        <div style={{ textAlign: "right", fontFamily: '"Public Sans", sans-serif', fontSize: 13 }}>
          Fait avec soin <span style={{ color: accent }}>♥</span> en France
        </div>
      </div>
    </div>
  </footer>
);

const ContactModal = ({ accent, open, onClose }: { accent: string; open: boolean; onClose: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) { setSubmitted(false); setTouched(false); }
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  if (!open) return null;

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const firstNameValid = firstName.trim().length > 0;
  const lastNameValid = lastName.trim().length > 0;
  const emailValid = emailRe.test(email.trim());
  const phoneValid = phone.trim().replace(/[\s.+\-()]/g, "").length >= 8;
  const typeValid = !!type;
  const formValid = firstNameValid && lastNameValid && emailValid && phoneValid && typeValid;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!formValid) return;
    setSubmitted(true);
  };

  const inputStyle = (invalid: boolean) => ({
    width: "100%",
    padding: "14px 16px",
    fontFamily: '"Public Sans", sans-serif',
    fontSize: 15,
    color: "#212B36",
    background: "#fff",
    border: `1.5px solid ${invalid ? accent : "#E0E0E0"}`,
    borderRadius: 12,
    outline: "none",
    boxSizing: "border-box" as const,
  });
  const labelStyle = { fontFamily: '"Public Sans", sans-serif', fontSize: 13, fontWeight: 700, color: "#212B36", marginBottom: 8, display: "block" };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(33,43,54,0.55)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "kapsulFadeIn 0.2s ease" }}>
      <div onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" style={{ background: "#fff", borderRadius: 24, padding: 40, maxWidth: 560, width: "100%", maxHeight: "90vh", overflowY: "auto", animation: "kapsulSlideUp 0.3s cubic-bezier(.22,1,.36,1)", boxShadow: "0 30px 80px rgba(33,43,54,0.3)" }}>
        {submitted ? (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${accent}1a`, color: accent, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700, marginBottom: 18 }}>✓</div>
            <h3 style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: 26, margin: "0 0 10px", color: "#212B36" }}>Merci !</h3>
            <p style={{ fontFamily: '"Public Sans", sans-serif', color: "#637381", margin: "0 0 24px" }}>On revient vers vous sous 24 h.</p>
            <button onClick={onClose} style={{ background: accent, color: "#fff", border: "none", borderRadius: 100, padding: "12px 28px", fontFamily: '"Public Sans", sans-serif', fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Fermer</button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <h3 style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 700, fontSize: 28, color: "#212B36", margin: "0 0 6px", letterSpacing: "-0.01em" }}>Parlons-en</h3>
                <p style={{ fontFamily: '"Public Sans", sans-serif', fontSize: 14, color: "#637381", margin: 0 }}>Démo + devis sur mesure sous 24 h.</p>
              </div>
              <button onClick={onClose} aria-label="Fermer" style={{ background: "transparent", border: "none", fontSize: 24, cursor: "pointer", color: "#919EAB", padding: 4 }}>×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={labelStyle}>Prénom</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle(touched && !firstNameValid)} />
                </div>
                <div>
                  <label style={labelStyle}>Nom</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle(touched && !lastNameValid)} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle(touched && !emailValid)} />
              </div>
              <div>
                <label style={labelStyle}>Téléphone</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle(touched && !phoneValid)} />
              </div>
              <div>
                <label style={labelStyle}>Vous êtes…</label>
                <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle(touched && !typeValid)}>
                  <option value="">Sélectionner…</option>
                  <option value="wedding-planner">Wedding planner</option>
                  <option value="entreprise">Entreprise</option>
                  <option value="agence">Agence (voyage, événementiel…)</option>
                  <option value="autres">Autres</option>
                </select>
              </div>
              <button type="submit" style={{ marginTop: 10, background: accent, color: "#fff", border: "none", borderRadius: 100, padding: "15px 28px", fontFamily: '"Public Sans", sans-serif', fontWeight: 600, fontSize: 15, cursor: "pointer", boxShadow: `0 10px 24px ${accent}40` }}>Envoyer ma demande →</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const Index = () => {
  const accent = ACCENT;
  const accentLight = useMemo(() => hexToRgba(accent, 0.1), [accent]);
  const [contactOpen, setContactOpen] = useState(false);
  const openContact = () => setContactOpen(true);

  return (
    <div style={{ background: "#fff" }}>
      <Navbar accent={accent} />
      <Hero accent={accent} accentLight={accentLight} onContact={openContact} />
      <HowItWorks accent={accent} accentLight={accentLight} />
      <Features accent={accent} accentLight={accentLight} />
      <Pricing accent={accent} accentLight={accentLight} />
      <B2B accent={accent} onContact={openContact} />
      <JoyfulMosaic accent={accent} />
      <Comparison accent={accent} accentLight={accentLight} />
      <Testimonials accent={accent} />
      <FinalCTA accent={accent} />
      <Footer accent={accent} />
      <ContactModal accent={accent} open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
};

export default Index;
