function Header({
  pretraga,
  setPretraga,
  brojUKosarici,
  otvoriKosaricu,
  otvoriPrijavu,
  prijavljeniKorisnik,
  odjava,
}) {
  const handlePretraga = () => {
    const proizvodiSekcija = document.getElementById("proizvodi");

    if (proizvodiSekcija) {
      proizvodiSekcija.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header>
      <div className="top-header">
        <a href="#pocetna" className="logo">
          SPORT<span>ZONE</span>
        </a>

        <div className="search">
          <input
            type="text"
            placeholder="Pretraži proizvode..."
            value={pretraga}
            onChange={(e) => setPretraga(e.target.value)}
          />

          <button type="button" onClick={handlePretraga}>
            Pretraži
          </button>
        </div>

        <div className="user-actions">
          {prijavljeniKorisnik ? (
            <>
              <span className="user-name">
                👤 {prijavljeniKorisnik.ime}
              </span>

              <button
                type="button"
                className="login-button"
                onClick={odjava}
              >
                Odjava
              </button>
            </>
          ) : (
            <button
              type="button"
              className="login-button"
              onClick={otvoriPrijavu}
            >
              Prijava
            </button>
          )}

          <button
            type="button"
            className="cart-button"
            onClick={otvoriKosaricu}
          >
            🛒 Košarica ({brojUKosarici})
          </button>
        </div>
      </div>

      <nav>
        <a href="#pocetna">Početna</a>
        <a href="#proizvodi">Proizvodi</a>
        <a href="#kategorije">Kategorije</a>
        <a href="#onama">O nama</a>
        <a href="#kontakt">Kontakt</a>
      </nav>
    </header>
  );
}

export default Header;