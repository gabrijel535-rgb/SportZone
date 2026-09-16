function CartDrawer({
  kosarica,
  zatvoriKosaricu,
  ukloniIzKosarice,
  otvoriCheckout,
}) {
  const ukupnaCijena = kosarica.reduce(
    (ukupno, proizvod) => ukupno + proizvod.cijena,
    0
  );

  return (
    <div className="cart-overlay">
      <div className="cart-drawer">
        <div className="cart-drawer-header">
          <h2>Moja košarica</h2>

          <button type="button" onClick={zatvoriKosaricu}>
            ✕
          </button>
        </div>

        {kosarica.length === 0 ? (
          <p>Košarica je prazna.</p>
        ) : (
          <>
            <div>
              {kosarica.map((proizvod, index) => (
                <div
                  className="cart-item"
                  key={`${proizvod.id}-${index}`}
                >
                  <span>{proizvod.slika}</span>

                  <div>
                    <h3>{proizvod.naziv}</h3>

                    <p>
                      {proizvod.cijena
                        .toFixed(2)
                        .replace(".", ",")}{" "}
                      €
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => ukloniIzKosarice(index)}
                  >
                    Ukloni
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-total">
              <h3>
                Ukupno:{" "}
                {ukupnaCijena
                  .toFixed(2)
                  .replace(".", ",")}{" "}
                €
              </h3>

              <button
                type="button"
                className="checkout-button"
                onClick={otvoriCheckout}
              >
                Naruči
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;