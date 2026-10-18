const felGomb = document.getElementById("felGomb");
const filmekElem = document.getElementById("filmek");

window.addEventListener("scroll", () => {
    felGomb.classList.toggle("latszik", window.scrollY > 300);
});

fetch("filmek.json")
    .then((valasz) => valasz.json())
    .then((filmek) => {
        filmekElem.innerHTML = filmek.map((f) => `
      <div class="col-sm-6 col-lg-4">
        <div class="card film-card">
          <img src="${f.kep}" alt="${f.cim} plakát">

          <div class="card-body">
            <h5 class="fw-bold">${f.cim}</h5>

            <p class="small text-sotet mb-2">
              ${f.mufaj}, ${f.hossz} perc,
              ${f.korhatar ? f.korhatar + "+" : "korhatár nélkül"},
              ${f.terem}
              (${f.sorok * f.oszlopok} férőhely)
            </p>

            <p>${f.leiras}</p>

            <p class="small mb-3">
              <b>Kezdés:</b> ${f.idopontok.join(", ")}
            </p>

            <a class="btn btn-primary w-100"
              href="urlap.html?film=${encodeURIComponent(f.id)}">
              Foglalás
            </a>
          </div>
        </div>
      </div>
    `).join("");
    })
    .catch(() => {
        filmekElem.innerHTML = `
      <div class="alert alert-danger">
        A műsor nem tölthető be. Indítsd el az oldalt helyi szerverrel,például a VS Code Live Server bővítményével.
      </div>
    `;
    });