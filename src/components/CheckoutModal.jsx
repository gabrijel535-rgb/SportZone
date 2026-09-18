import { useState } from "react";
import emailjs from "@emailjs/browser";

function CheckoutModal({
  kosarica,
  zatvoriCheckout,
  potvrdiNarudzbu,
  prijavljeniKorisnik,
}) {
  const [ime, setIme] = useState(
    prijavljeniKorisnik?.ime || ""
  );

  const [email, setEmail] = useState(
    prijavljeniKorisnik?.email || ""
  );

  const [adresa, setAdresa] = useState("");
  const [grad, setGrad] = useState("");
  const [postanskiBroj, setPostanskiBroj] = useState("");
  const [poruka, setPoruka] = useState("");
  const [slanje, setSlanje] = useState(false);

  const ukupno = kosarica.reduce(
    (zbroj, proizvod) => zbroj + proizvod.cijena,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPoruka("");

    if (
      ime.trim() === "" ||
      email.trim() === "" ||
      adresa.trim() === "" ||
      grad.trim() === "" ||
      postanskiBroj.trim() === ""
    ) {
      setPoruka("Molimo ispunite sva polja.");
      return;
    }

    if (!email.includes("@")) {
      setPoruka("Unesite ispravnu email adresu.");
      return;
    }

    const narudzba = {
      id: Date.now(),
      datum: new Date().toLocaleString("hr-HR"),
      kupac: {
        ime,
        email,
        adresa,
        grad,
        postanskiBroj,
      },
      proizvodi: kosarica,
      ukupno,
    };

    const proizvodiTekst = kosarica
      .map(
        (proizvod) =>
          `${proizvod.naziv} - ${proizvod.cijena
            .toFixed(2)
            .replace(".", ",")} €`
      )
      .join("\n");

    const templateParams = {
      order_id: narudzba.id,
      datum: narudzba.datum,
      ime: ime,
      email: email,
      adresa: adresa,
      grad: grad,
      postanski_broj: postanskiBroj,
      proizvodi: proizvodiTekst,
      ukupno: `${ukupno
        .toFixed(2)
        .replace(".", ",")} €`,
    };

    try {
      setSlanje(true);

      await emailjs.send(
        "service_z7guk5i",
        "template_dytlany",
        templateParams,
        {
          publicKey: "p4XuOJhcZSLcqL9vn",
        }
      );

      potvrdiNarudzbu(narudzba);
    } catch (error) {
      console.error(
        "Greška pri slanju emaila:",
        error
      );

      setPoruka(
        "Došlo je do greške pri slanju narudžbe. Pokušajte ponovno."
      );
    } finally {
      setSlanje(false);
    }
  };

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal">
        <div className="checkout-header">
          <div>
            <span className="checkout-small-title">
              SPORTZONE
            </span>

            <h2>Završetak narudžbe</h2>

            <p>
              Provjerite proizvode i unesite podatke
              za dostavu.
            </p>
          </div>

          <button
            type="button"
            className="checkout-close"
            onClick={zatvoriCheckout}
          >
            ✕
          </button>
        </div>

        <div className="checkout-content">
          <div className="checkout-summary">
            <h3>Pregled narudžbe</h3>

            <div className="checkout-products">
              {kosarica.map((proizvod, index) => (
                <div
                  className="checkout-product"
                  key={`${proizvod.id}-${index}`}
                >
                  <div className="checkout-product-info">
                    <span className="checkout-product-icon">
                      {proizvod.slika}
                    </span>

                    <span>{proizvod.naziv}</span>
                  </div>

                  <strong>
                    {proizvod.cijena
                      .toFixed(2)
                      .replace(".", ",")}{" "}
                    €
                  </strong>
                </div>
              ))}
            </div>

            <div className="checkout-total">
              <span>Ukupno</span>

              <strong>
                {ukupno.toFixed(2).replace(".", ",")} €
              </strong>
            </div>
          </div>

          <div className="checkout-form-wrapper">
            <h3>Podaci za dostavu</h3>

            <form
              className="checkout-form"
              onSubmit={handleSubmit}
            >
              <div className="checkout-field">
                <label htmlFor="checkout-name">
                  Ime i prezime
                </label>

                <input
                  id="checkout-name"
                  type="text"
                  value={ime}
                  onChange={(e) =>
                    setIme(e.target.value)
                  }
                  placeholder="Npr. Ivan Horvat"
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="checkout-email">
                  Email adresa
                </label>

                <input
                  id="checkout-email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="vas@email.com"
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="checkout-address">
                  Adresa
                </label>

                <input
                  id="checkout-address"
                  type="text"
                  value={adresa}
                  onChange={(e) =>
                    setAdresa(e.target.value)
                  }
                  placeholder="Ulica i kućni broj"
                />
              </div>

              <div className="checkout-row">
                <div className="checkout-field">
                  <label htmlFor="checkout-city">
                    Grad
                  </label>

                  <input
                    id="checkout-city"
                    type="text"
                    value={grad}
                    onChange={(e) =>
                      setGrad(e.target.value)
                    }
                    placeholder="Osijek"
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="checkout-postcode">
                    Poštanski broj
                  </label>

                  <input
                    id="checkout-postcode"
                    type="text"
                    value={postanskiBroj}
                    onChange={(e) =>
                      setPostanskiBroj(
                        e.target.value
                      )
                    }
                    placeholder="31000"
                  />
                </div>
              </div>

              {poruka && (
                <p className="checkout-message">
                  {poruka}
                </p>
              )}

              <button
                type="submit"
                className="checkout-submit"
                disabled={slanje}
              >
                {slanje
                  ? "Slanje narudžbe..."
                  : "Potvrdi narudžbu"}
              </button>

              <p className="checkout-secure">
                🔒 Vaši podaci koriste se samo za
                obradu narudžbe.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutModal;