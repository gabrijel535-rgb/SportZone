function ProductCard({ proizvod, dodajUKosaricu }) {
  return (
    <article className="product-card">
      <div className="product-image">{proizvod.slika}</div>

      <div className="product-info">
        <span>{proizvod.kategorija}</span>
        <h3>{proizvod.naziv}</h3>
        <p className="price">{proizvod.cijena.toFixed(2).replace(".", ",")} €</p>

        <button onClick={() => dodajUKosaricu(proizvod)}>
  Dodaj u košaricu
</button>
      </div>
    </article>
  );
}

export default ProductCard;