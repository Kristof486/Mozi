const felGomb = document.getElementById("felGomb");
const filmekElem = document.getElementById("filmek");

// Fel gomb megjelenítése görgetéskor
window.addEventListener("scroll", () => {
    felGomb.classList.toggle("latszik", window.scrollY > 300);
});

// Filmek betöltése
fetch("filmek.json")
    .then(valasz => valasz.json())
    .then(filmek => {
        filmekElem.innerHTML = filmek.map(f => `
            <div class="col-sm-6 col-lg-4">
                <div class="card film-card">
                    <img src="${f.kep}" alt="${f.cim} plakát">

                    <div class="card-body">
                        <h5>${f.cim}</h5>
                        <p>${f.mufaj}, ${f.hossz} perc, ${f.terem}</p>
                        <p>${f.leiras}</p>
                        <p>Kezdés: ${f.idopontok.join(", ")}</p>

                        <a href="urlap.html?film=${f.id}" class="btn btn-primary w-100">
                            Foglalás
                        </a>
                    </div>
                </div>
            </div>
        `).join("");
    })
    .catch(() => {
        filmekElem.innerHTML = "<p>A filmek nem tölthetők be!</p>";
    });