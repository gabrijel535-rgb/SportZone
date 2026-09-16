import { useState } from "react";

function ProductManager({
  proizvodi,
  dodajProizvod,
  urediProizvod,
  obrisiProizvod,
}) {
  const [naziv, setNaziv] = useState("");
  const [kategorija, setKategorija] = useState("NOGOMET");
  const [cijena, setCijena] = useState("");
  const [urediId, setUrediId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (naziv.trim() === "" || cijena === "") {
      alert("Unesite naziv i cijenu proizvoda.");
      return;
    }

    if (Number(cijena) <= 0) {
      alert("Cijena mora biti veća od 0.");
      return;
    }

    const proizvod = {
      id: urediId ? urediId : Date.now(),
      naziv: naziv.trim(),
      kategorija: kategorija,
      cijena: Number(cijena),
      slika: odaberiSliku(kategorija),
    };

    if (urediId) {
      urediProizvod(proizvod);
      setUrediId(null);
    } else {
      dodajProizvod(proizvod);
    }

    ocistiFormu();
  };

  const odaberiSliku = (odabranaKategorija) => {
    if (odabranaKategorija === "NOGOMET") return "⚽";
    if (odabranaKategorija === "FITNESS") return "🏋️";
    if (odabranaKategorija === "TRČANJE") return "👟";
    if (odabranaKategorija === "KOŠARKA") return "🏀";

    return "🏅";
  };

  const pokreniUredivanje = (proizvod) => {
    setUrediId(proizvod.id);
    setNaziv(proizvod.naziv);
    setKategorija(proizvod.kategorija);
    setCijena(proizvod.cijena);
  };

  const ocistiFormu = () => {
    setNaziv("");
    setKategorija("NOGOMET");
    setCijena("");
  };

  const odustaniOdUredivanja = () => {
    setUrediId(null);
    ocistiFormu();
  };

  return (
    <section className="product-manager">
      <div className="section-heading">
        <p>UPRAVLJANJE PROIZVODIMA</p>
        <h2>
          {urediId ? "Uredi proizvod" : "Dodaj novi proizvod"}
        </h2>
      </div>

      <form
        className="product-manager-form"
        onSubmit={handleSubmit}
      >
        <label htmlFor="product-name">Naziv proizvoda</label>

        <input
          id="product-name"
          type="text"
          placeholder="Npr. Nogometne kopačke"
          value={naziv}
          onChange={(e) => setNaziv(e.target.value)}
        />

        <label htmlFor="product-category">Kategorija</label>

        <select
          id="product-category"
          value={kategorija}
          onChange={(e) => setKategorija(e.target.value)}
        >
          <option value="NOGOMET">Nogomet</option>
          <option value="FITNESS">Fitness</option>
          <option value="TRČANJE">Trčanje</option>
          <option value="KOŠARKA">Košarka</option>
        </select>

        <label htmlFor="product-price">Cijena (€)</label>

        <input
          id="product-price"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="49.99"
          value={cijena}
          onChange={(e) => setCijena(e.target.value)}
        />

        <button type="submit">
          {urediId ? "Spremi promjene" : "Dodaj proizvod"}
        </button>

        {urediId && (
          <button
            type="button"
            className="cancel-edit-button"
            onClick={odustaniOdUredivanja}
          >
            Odustani
          </button>
        )}
      </form>

      <div className="manager-products">
        <h3>Popis proizvoda</h3>

        {proizvodi.map((proizvod) => (
          <div
            className="manager-product"
            key={proizvod.id}
          >
            <div>
              <strong>
                {proizvod.slika} {proizvod.naziv}
              </strong>

              <p>
                {proizvod.kategorija} —{" "}
                {proizvod.cijena
                  .toFixed(2)
                  .replace(".", ",")}{" "}
                €
              </p>
            </div>

            <div className="manager-buttons">
              <button
                type="button"
                onClick={() => pokreniUredivanje(proizvod)}
              >
                Uredi
              </button>

              <button
                type="button"
                className="delete-product-button"
                onClick={() => obrisiProizvod(proizvod.id)}
              >
                Obriši
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductManager;