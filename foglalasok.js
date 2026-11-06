const $ = (id) => document.getElementById(id);
const toltes = (url) => fetch(url).then((r) => r.json());
const ft = (n) => n.toLocaleString("hu-HU") + " Ft";

let FILMEK = [];
let FOGLALASOK = [];
let nezet = "tabla";
let rend = { kulcs: "datum", irany: 1 };

const OSZLOPOK = [["nev", "Név"], ["film", "Film"], ["datum", "Dátum"], ["ido", "Idő"], ["helyek", "Helyek"], ["osszeg", "Összeg"]];
const filmAdat = (id) => FILMEK.find((f) => f.id == id);
const ertek = (b, k) => (k === "film" ? filmAdat(b.filmId).cim : k === "helyek" ? b.helyek.join(", ") : b[k]);

function lista() {
  const q = $("kereso").value.toLowerCase();
  const film = $("filmSzuro").value;
  const dat = $("datumSzuro").value;
  return FOGLALASOK
    .filter((b) => !b.torolve
      && (b.nev + " " + b.email).toLowerCase().includes(q)
      && (!film || b.filmId == film)
      && (!dat || b.datum === dat))
    .sort((a, b) => {
      const x = ertek(a, rend.kulcs), y = ertek(b, rend.kulcs);
      return (x > y ? 1 : x < y ? -1 : 0) * rend.irany;
    });
}

const torolGomb = (b) => `<button class="btn btn-sm btn-outline-danger fw-bold" data-torol="${b.id}">Törlés</button>`;

function tabla(l) {
  const fej = OSZLOPOK.map(([k, c]) =>
    `<th><button class="sortbtn" data-rend="${k}">${c}${rend.kulcs === k ? (rend.irany > 0 ? " ▲" : " ▼") : ""}</button></th>`).join("");
  const sorok = l.map((b) => `
    <tr>
      <td>${b.nev}</td><td>${filmAdat(b.filmId).cim}</td><td>${b.datum}</td><td>${b.ido}</td>
      <td>${b.helyek.join(", ")}</td><td>${ft(b.osszeg)}</td><td>${torolGomb(b)}</td>
    </tr>`).join("");
  return `<div class="tabla-doboz table-responsive">
    <table class="table table-hover align-middle mb-0">
      <thead class="table-dark"><tr>${fej}<th></th></tr></thead><tbody>${sorok}</tbody>
    </table></div>`;
}

function kartyak(l) {
  return `<div class="row g-4">${l.map((b) => {
    const f = filmAdat(b.filmId);
    return `<div class="col-md-6 col-lg-4"><div class="card film-card">
      <img class="kep-kicsi" src="${f.kep}" alt="">
      <div class="card-body">
        <h5 class="fw-bold">${f.cim}</h5>
        <p class="small mb-2">${b.datum}, ${b.ido}, ${f.terem}</p>
        <p class="mb-2"><b>${b.nev}</b><br>${b.email}<br>${b.telefon}</p>
        <p class="mb-3">Helyek: <b>${b.helyek.join(", ")}</b><br><b>${ft(b.osszeg)}</b> <span class="small">(${b.kedvezmeny})</span></p>
        ${torolGomb(b)}
      </div></div></div>`;
  }).join("")}</div>`;
}

function megjelenit() {
  const l = lista();
  $("talalat").textContent = l.length + " foglalás";
  $("nezet").innerHTML = !l.length
    ? '<div class="alert alert-info">Nincs a szűrésnek megfelelő foglalás.</div>'
    : nezet === "tabla" ? tabla(l) : kartyak(l);
  $("nezetTabla").classList.toggle("active", nezet === "tabla");
  $("nezetKartya").classList.toggle("active", nezet === "kartya");
}

$("nezet").addEventListener("click", (e) => {
  const t = e.target.closest("[data-torol]");
  const r = e.target.closest("[data-rend]");
  if (t) FOGLALASOK.find((b) => b.id == t.dataset.torol).torolve = true; // csak megjelöljük, nem töröljük
  if (r) rend = { kulcs: r.dataset.rend, irany: rend.kulcs === r.dataset.rend ? -rend.irany : 1 };
  megjelenit();
});

["kereso", "filmSzuro", "datumSzuro"].forEach((id) => $(id).addEventListener("input", megjelenit));
$("szuroTorles").addEventListener("click", () => {
  ["kereso", "filmSzuro", "datumSzuro"].forEach((id) => ($(id).value = ""));
  megjelenit();
});
$("nezetTabla").addEventListener("click", () => { nezet = "tabla"; megjelenit(); });
$("nezetKartya").addEventListener("click", () => { nezet = "kartya"; megjelenit(); });

const felGomb = $("felGomb");
window.addEventListener("scroll", () => felGomb.classList.toggle("latszik", window.scrollY > 300));

Promise.all([toltes("filmek.json"), toltes("foglalasok.json")])
  .then(([filmek, foglalasok]) => {
    FILMEK = filmek;
    FOGLALASOK = foglalasok;
    FILMEK.forEach((f) => $("filmSzuro").add(new Option(f.cim, f.id)));
    megjelenit();
  })
  .catch(() => {
    $("nezet").innerHTML = '<div class="alert alert-danger">Az adatok nem tölthetők be. Nyisd meg helyi szerverrel (pl. VS Code Live Server).</div>';
  });
