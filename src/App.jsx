import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import LoginModal from "./components/LoginModal";
import ProductManager from "./components/ProductManager";
import CheckoutModal from "./components/CheckoutModal";

const pocetniProizvodi = [
  {
    id: 1,
    naziv: "Sportske tenisice",
    kategorija: "TRČANJE",
    cijena: 89.99,
    slika: "👟",
  },
  {
    id: 2,
    naziv: "Nogometna lopta",
    kategorija: "NOGOMET",
    cijena: 34.99,
    slika: "⚽",
  },
  {
    id: 3,
    naziv: "Set utega",
    kategorija: "FITNESS",
    cijena: 59.99,
    slika: "🏋️",
  },
  {
    id: 4,
    naziv: "Košarkaška lopta",
    kategorija: "KOŠARKA",
    cijena: 29.99,
    slika: "🏀",
  },
];

function App() {
  const [pretraga, setPretraga] = useState("");
  const [odabranaKategorija, setOdabranaKategorija] = useState("SVE");

  const [kontaktIme, setKontaktIme] = useState("");
  const [kontaktEmail, setKontaktEmail] = useState("");
  const [kontaktPoruka, setKontaktPoruka] = useState("");
  const [kontaktStatus, setKontaktStatus] = useState("");

  const [proizvodi, setProizvodi] = useState(() => {
    const spremljeniProizvodi =
      localStorage.getItem("sportzoneProizvodi");

    return spremljeniProizvodi
      ? JSON.parse(spremljeniProizvodi)
      : pocetniProizvodi;
  });

  const [kosarica, setKosarica] = useState(() => {
    const spremljenaKosarica = localStorage.getItem("kosarica");

    return spremljenaKosarica
      ? JSON.parse(spremljenaKosarica)
      : [];
  });

  const [prijavljeniKorisnik, setPrijavljeniKorisnik] = useState(() => {
    const spremljeniKorisnik =
      localStorage.getItem("prijavljeniKorisnik");

    return spremljeniKorisnik
      ? JSON.parse(spremljeniKorisnik)
      : null;
  });

  const [kosaricaOtvorena, setKosaricaOtvorena] = useState(false);
  const [prijavaOtvorena, setPrijavaOtvorena] = useState(false);
  const [checkoutOtvoren, setCheckoutOtvoren] = useState(false);

  const filtriraniProizvodi = proizvodi.filter((proizvod) => {
    const odgovaraPretrazi = proizvod.naziv
      .toLowerCase()
      .includes(pretraga.toLowerCase());

    const odgovaraKategoriji =
      odabranaKategorija === "SVE" ||
      proizvod.kategorija === odabranaKategorija;

    return odgovaraPretrazi && odgovaraKategoriji;
  });

  const odaberiKategoriju = (kategorija) => {
    setOdabranaKategorija(kategorija);

    document.getElementById("proizvodi")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const dodajUKosaricu = (proizvod) => {
    setKosarica([...kosarica, proizvod]);
  };

  const ukloniIzKosarice = (indexZaBrisanje) => {
    setKosarica(
      kosarica.filter((_, index) => index !== indexZaBrisanje)
    );
  };

  const dodajProizvod = (noviProizvod) => {
    setProizvodi([...proizvodi, noviProizvod]);
  };

  const urediProizvod = (uredeniProizvod) => {
    setProizvodi(
      proizvodi.map((proizvod) =>
        proizvod.id === uredeniProizvod.id
          ? uredeniProizvod
          : proizvod
      )
    );
  };

  const obrisiProizvod = (id) => {
    const potvrda = window.confirm(
      "Želite li sigurno obrisati ovaj proizvod?"
    );

    if (!potvrda) return;

    setProizvodi(
      proizvodi.filter((proizvod) => proizvod.id !== id)
    );
  };

  const odjava = () => {
    localStorage.removeItem("prijavljeniKorisnik");
    setPrijavljeniKorisnik(null);
  };

  const posaljiKontakt = (e) => {
    e.preventDefault();
    setKontaktStatus("");

    if (
      kontaktIme.trim() === "" ||
      kontaktEmail.trim() === "" ||
      kontaktPoruka.trim() === ""
    ) {
      setKontaktStatus("Molimo ispunite sva polja.");
      return;
    }

    if (!kontaktEmail.includes("@")) {
      setKontaktStatus("Unesite ispravnu email adresu.");
      return;
    }

    setKontaktStatus("Poruka je uspješno poslana!");

    setKontaktIme("");
    setKontaktEmail("");
    setKontaktPoruka("");
  };
  const potvrdiNarudzbu = (narudzba) => {
  const stareNarudzbe = JSON.parse(
    localStorage.getItem("sportzoneNarudzbe") || "[]"
  );

  localStorage.setItem(
    "sportzoneNarudzbe",
    JSON.stringify([...stareNarudzbe, narudzba])
  );

  setKosarica([]);
  setCheckoutOtvoren(false);

  alert(
    `Narudžba je uspješno zaprimljena! Ukupno: ${narudzba.ukupno
      .toFixed(2)
      .replace(".", ",")} €`
  );
};

  useEffect(() => {
    localStorage.setItem("kosarica", JSON.stringify(kosarica));
  }, [kosarica]);

  useEffect(() => {
    localStorage.setItem(
      "sportzoneProizvodi",
      JSON.stringify(proizvodi)
    );
  }, [proizvodi]);

  return (
    <>
      <Header
        pretraga={pretraga}
        setPretraga={setPretraga}
        brojUKosarici={kosarica.length}
        otvoriKosaricu={() => setKosaricaOtvorena(true)}
        otvoriPrijavu={() => setPrijavaOtvorena(true)}
        prijavljeniKorisnik={prijavljeniKorisnik}
        odjava={odjava}
      />

      {kosaricaOtvorena && (
  <CartDrawer
    kosarica={kosarica}
    zatvoriKosaricu={() => setKosaricaOtvorena(false)}
    ukloniIzKosarice={ukloniIzKosarice}
    otvoriCheckout={() => {
      setKosaricaOtvorena(false);
      setCheckoutOtvoren(true);
    }}
  />
)}

{checkoutOtvoren && (
  <CheckoutModal
    kosarica={kosarica}
    zatvoriCheckout={() => setCheckoutOtvoren(false)}
    potvrdiNarudzbu={potvrdiNarudzbu}
    prijavljeniKorisnik={prijavljeniKorisnik}
  />
)}

{prijavaOtvorena && (
        <LoginModal
          zatvoriPrijavu={() => setPrijavaOtvorena(false)}
          uspjesnaPrijava={setPrijavljeniKorisnik}
        />
      )}

      <main>
        <section className="hero" id="pocetna">
          <div className="hero-content">
            <p className="small-title">SPORTSKA OPREMA ZA SVE</p>

            <h1>
              Pokreni se.
              <br />
              Ostvari svoj <span>cilj.</span>
            </h1>

            <p className="hero-description">
              Pronađi kvalitetnu sportsku opremu za trening,
              trčanje, nogomet, košarku i ostale sportske aktivnosti.
            </p>

            <a href="#proizvodi" className="main-button">
              Pogledaj proizvode
            </a>
          </div>
        </section>

        <section className="categories" id="kategorije">
          <div className="section-heading">
            <p>KATEGORIJE</p>
            <h2>Odaberi svoj sport</h2>
          </div>

          <div className="category-grid">
            <article
              className="category-card"
              onClick={() => odaberiKategoriju("NOGOMET")}
            >
              <div className="category-icon">⚽</div>
              <h3>Nogomet</h3>
              <p>Lopte, kopačke i oprema</p>
            </article>

            <article
              className="category-card"
              onClick={() => odaberiKategoriju("FITNESS")}
            >
              <div className="category-icon">🏋️</div>
              <h3>Fitness</h3>
              <p>Oprema za trening</p>
            </article>

            <article
              className="category-card"
              onClick={() => odaberiKategoriju("TRČANJE")}
            >
              <div className="category-icon">🏃</div>
              <h3>Trčanje</h3>
              <p>Tenisice i sportska odjeća</p>
            </article>

            <article
              className="category-card"
              onClick={() => odaberiKategoriju("KOŠARKA")}
            >
              <div className="category-icon">🏀</div>
              <h3>Košarka</h3>
              <p>Lopte i sportska oprema</p>
            </article>
          </div>
        </section>

        <section className="products" id="proizvodi">
          <div className="section-heading">
            <p>NAŠA PONUDA</p>
            <h2>Izdvojeni proizvodi</h2>
          </div>

          {odabranaKategorija !== "SVE" && (
            <div className="active-filter">
              <span>
                Kategorija: {odabranaKategorija}
              </span>

              <button
                type="button"
                onClick={() => setOdabranaKategorija("SVE")}
              >
                Prikaži sve
              </button>
            </div>
          )}

          {filtriraniProizvodi.length > 0 ? (
            <div className="product-grid">
              {filtriraniProizvodi.map((proizvod) => (
                <ProductCard
                  key={proizvod.id}
                  proizvod={proizvod}
                  dodajUKosaricu={dodajUKosaricu}
                />
              ))}
            </div>
          ) : (
            <p className="no-products">
              Nema proizvoda koji odgovaraju pretrazi.
            </p>
          )}
        </section>

        {prijavljeniKorisnik?.email === "admin@sportzone.hr" && (
  <ProductManager
    proizvodi={proizvodi}
    dodajProizvod={dodajProizvod}
    urediProizvod={urediProizvod}
    obrisiProizvod={obrisiProizvod}
  />
)}
        <section className="about" id="onama">
          <div className="about-text">
            <p className="small-title">O NAMA</p>
            <h2>Oprema za svaki trening</h2>

            <p>
              SportZone je web trgovina sportske opreme namijenjena
              rekreativcima i sportašima. Naš cilj je ponuditi
              kvalitetnu sportsku opremu na jednom mjestu.
            </p>

            <p>
              U ponudi možete pronaći proizvode za nogomet,
              košarku, fitness, trčanje i druge sportske aktivnosti.
            </p>
          </div>

          <div className="about-box">
            <h3>Zašto SportZone?</h3>
            <p>✓ Kvalitetna sportska oprema</p>
            <p>✓ Veliki izbor proizvoda</p>
            <p>✓ Jednostavna kupovina</p>
            <p>✓ Brza pretraga proizvoda</p>
          </div>
        </section>

        <section className="contact" id="kontakt">
          <div className="section-heading">
            <p>KONTAKT</p>
            <h2>Kontaktirajte nas</h2>
          </div>

          <div className="contact-container">
            <div className="contact-info">
              <h3>Imate pitanje?</h3>

              <p>
                Pošaljite nam poruku putem kontakt obrasca i
                odgovorit ćemo vam u najkraćem mogućem roku.
              </p>

              <p>
                <strong>Email:</strong> info@sportzone.hr
              </p>

              <p>
                <strong>Telefon:</strong> +385 91 123 4567
              </p>

              <p>
                <strong>Radno vrijeme:</strong> Pon - Pet, 08:00 - 20:00
              </p>
            </div>

            <form
              className="contact-form"
              onSubmit={posaljiKontakt}
            >
              <label htmlFor="name">Ime i prezime</label>

              <input
                id="name"
                type="text"
                placeholder="Vaše ime"
                value={kontaktIme}
                onChange={(e) => setKontaktIme(e.target.value)}
              />

              <label htmlFor="contact-email">Email</label>

              <input
                id="contact-email"
                type="email"
                placeholder="vas@email.com"
                value={kontaktEmail}
                onChange={(e) => setKontaktEmail(e.target.value)}
              />

              <label htmlFor="message">Poruka</label>

              <textarea
                id="message"
                placeholder="Napišite svoju poruku..."
                value={kontaktPoruka}
                onChange={(e) => setKontaktPoruka(e.target.value)}
              ></textarea>

              {kontaktStatus && (
                <p className="contact-status">
                  {kontaktStatus}
                </p>
              )}

              <button type="submit">
                Pošalji poruku
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div>
          <a href="#pocetna" className="logo">
            SPORT<span>ZONE</span>
          </a>

          <p>Sportska oprema za svaki cilj.</p>
        </div>

        <div>
          <h4>Brzi linkovi</h4>
          <a href="#pocetna">Početna</a>
          <a href="#proizvodi">Proizvodi</a>
          <a href="#onama">O nama</a>
          <a href="#kontakt">Kontakt</a>
        </div>

        <div>
          <h4>Kategorije</h4>
          <p>Nogomet</p>
          <p>Fitness</p>
          <p>Trčanje</p>
          <p>Košarka</p>
        </div>
      </footer>

      <div className="copyright">
        © 2026 SportZone. Sva prava pridržana.
      </div>
    </>
  );
}

export default App;