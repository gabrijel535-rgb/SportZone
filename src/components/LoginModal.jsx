import { useState } from "react";

function LoginModal({ zatvoriPrijavu, uspjesnaPrijava }) {
  const [registracija, setRegistracija] = useState(false);

  const [ime, setIme] = useState("");
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [ponovljenaLozinka, setPonovljenaLozinka] = useState("");

  const [poruka, setPoruka] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setPoruka("");

    // REGISTRACIJA OBIČNOG KORISNIKA
    if (registracija) {
      if (
        ime.trim() === "" ||
        email.trim() === "" ||
        lozinka.trim() === "" ||
        ponovljenaLozinka.trim() === ""
      ) {
        setPoruka("Molimo ispunite sva polja.");
        return;
      }

      if (lozinka.length < 4) {
        setPoruka("Lozinka mora imati najmanje 4 znaka.");
        return;
      }

      if (lozinka !== ponovljenaLozinka) {
        setPoruka("Lozinke se ne podudaraju.");
        return;
      }

      if (email.toLowerCase() === "admin@sportzone.hr") {
        setPoruka("Ova email adresa je rezervirana za administratora.");
        return;
      }

      const noviKorisnik = {
        ime: ime,
        email: email,
        lozinka: lozinka,
        role: "user",
      };

      localStorage.setItem(
        "sportzoneKorisnik",
        JSON.stringify(noviKorisnik)
      );

      setPoruka("Registracija uspješna! Sada se možete prijaviti.");

      setRegistracija(false);
      setIme("");
      setLozinka("");
      setPonovljenaLozinka("");

      return;
    }

    // PRIJAVA
    if (email.trim() === "" || lozinka.trim() === "") {
      setPoruka("Unesite email i lozinku.");
      return;
    }

    // ADMIN RAČUN
    if (
      email.toLowerCase() === "admin@sportzone.hr" &&
      lozinka === "admin123"
    ) {
      const admin = {
        ime: "Administrator",
        email: "admin@sportzone.hr",
        role: "admin",
      };

      localStorage.setItem(
        "prijavljeniKorisnik",
        JSON.stringify(admin)
      );

      uspjesnaPrijava(admin);
      zatvoriPrijavu();
      return;
    }

    // OBIČNI KORISNIK
    const spremljeniKorisnik = localStorage.getItem(
      "sportzoneKorisnik"
    );

    if (!spremljeniKorisnik) {
      setPoruka("Korisnik nije pronađen. Prvo se registrirajte.");
      return;
    }

    const korisnik = JSON.parse(spremljeniKorisnik);

    if (
      korisnik.email.toLowerCase() === email.toLowerCase() &&
      korisnik.lozinka === lozinka
    ) {
      localStorage.setItem(
        "prijavljeniKorisnik",
        JSON.stringify(korisnik)
      );

      uspjesnaPrijava(korisnik);
      zatvoriPrijavu();
    } else {
      setPoruka("Pogrešan email ili lozinka.");
    }
  };

  const promijeniNacin = () => {
    setRegistracija(!registracija);
    setPoruka("");
    setIme("");
    setEmail("");
    setLozinka("");
    setPonovljenaLozinka("");
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <div className="login-header">
          <h2>{registracija ? "Registracija" : "Prijava"}</h2>

          <button type="button" onClick={zatvoriPrijavu}>
            ✕
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {registracija && (
            <>
              <label htmlFor="ime">Ime i prezime</label>
              <input
                id="ime"
                type="text"
                placeholder="Unesite ime i prezime"
                value={ime}
                onChange={(e) => setIme(e.target.value)}
              />
            </>
          )}

          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            placeholder="vas@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="login-lozinka">Lozinka</label>
          <input
            id="login-lozinka"
            type="password"
            placeholder="Unesite lozinku"
            value={lozinka}
            onChange={(e) => setLozinka(e.target.value)}
          />

          {registracija && (
            <>
              <label htmlFor="ponovi-lozinku">
                Ponovite lozinku
              </label>

              <input
                id="ponovi-lozinku"
                type="password"
                placeholder="Ponovite lozinku"
                value={ponovljenaLozinka}
                onChange={(e) =>
                  setPonovljenaLozinka(e.target.value)
                }
              />
            </>
          )}

          {poruka && (
            <p className="login-message">{poruka}</p>
          )}

          <button type="submit" className="login-submit">
            {registracija ? "Registriraj se" : "Prijavi se"}
          </button>
        </form>

        <div className="register-link">
          <p>
            {registracija
              ? "Već imate račun?"
              : "Nemate račun?"}
          </p>

          <button type="button" onClick={promijeniNacin}>
            {registracija ? "Prijavi se" : "Registriraj se"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;