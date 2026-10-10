const byId = (id) => document.getElementById(id);

const datum = byId("date");
const uzenet = document.getElementById("message");
const KarakterHosszusag = document.getElementById("charCount");

const Jegyár = 2500;
const évInput = document.getElementById("év");
const jegyekInput = document.getElementById("jegyek");
const végösszeg = document.getElementById("végösszeg");
const KedvezményText = document.getElementById("kedvezmény");
const filmSelect = document.getElementById("film");
const idoSelect = document.getElementById("ido");
const datumInput = document.getElementById("date");



function datumBeallitasa() {
  const ma = new Date();
  let ev = ma.getFullYear();
  let honap = ma.getMonth() + 1;
  let nap = ma.getDate();

  if (honap < 10) {
    honap = "0" + honap;
  }

  if (nap < 10) {
    nap = "0" + nap;
  }
  datum.min = ev + "-" + honap + "-" + nap; //mindátum

  //maxdátum
  const maxDatum = new Date();
  maxDatum.setFullYear(maxDatum.getFullYear() + 1);

  let maxEv = maxDatum.getFullYear();
  let maxHonap = maxDatum.getMonth() + 1;
  let maxNap = maxDatum.getDate();

  if (maxHonap < 10) {
    maxHonap = "0" + maxHonap;
  }

  if (maxNap < 10) {
    maxNap = "0" + maxNap;
  }

  datum.max = maxEv + "-" + maxHonap + "-" + maxNap;

}
datumBeallitasa();

function calculatePrice() {
  const év = Number(évInput.value);
  const jegyek = Number(jegyekInput.value);

  if (!év || !jegyek) {
    végösszeg.textContent = "0 Ft";
    KedvezményText.textContent = "Nincs";
    return;
  }

  const originalPrice = Jegyár * jegyek;

  let discount = 0;
  let discountName = "Nincs kedvezmény";

  // 18 év
  if (év < 18) {
    discount = 20;
    discountName = "18 év alatti kedvezmény (20%)";
  }
  // 65 év 
  else if (év >= 65) {
    discount = 15;
    discountName = "65 év feletti kedvezmény (15%)";
  }
  // 10 vagy több jegy 
  if (jegyek >= 10 && discount < 23) {
    discount = 23;
    discountName = "Csoportos kedvezmény (23%)";
  }
  const discountAmount = originalPrice * (discount / 100);
  const finalPrice = originalPrice - discountAmount;

  végösszeg.textContent =
    finalPrice.toLocaleString("hu-HU") + " Ft";

  KedvezményText.textContent = discountName;
}

jegyekInput.addEventListener("input", calculatePrice);
évInput.addEventListener("input", calculatePrice);

calculatePrice();

let filmek = [];
let foglalasok = [];

async function adatokBetoltese() {
  try {
    const filmekValasz = await fetch("./filmek.json");
    const foglalasokValasz = await fetch("./foglalasok.json");

    if (!filmekValasz.ok) {
      throw new Error("filmek.json: " + filmekValasz.status);
    }

    if (!foglalasokValasz.ok) {
      throw new Error("foglalasok.json: " + foglalasokValasz.status);
    }

    filmek = await filmekValasz.json();
    foglalasok = await foglalasokValasz.json();

    const filmSelect = document.getElementById("film");

    filmSelect.innerHTML =
      '<option value="">Válassz filmet...</option>';

    filmek.forEach(film => {
      filmSelect.add(new Option(film.cim, film.id));
    });

    idopontokBetoltese();

  } catch (hiba) {
    console.error("JSON betöltési hiba:", hiba);
  }
}

function idopontokBetoltese() {
  const film = filmek.find(
    f => Number(f.id) === Number(filmSelect.value)
  );

  idoSelect.innerHTML = '<option value="">Válassz időpontot...</option>';

  if (!film) {
    idoSelect.disabled = true;
    return;
  }

  film.idopontok.forEach(ido => {
    const foglalt = datumInput.value && foglalasok.some(f =>
      Number(f.filmId) === Number(film.id) &&
      f.datum === datumInput.value &&
      f.ido === ido &&
      f.torolve !== true
    );

    const option = new Option(
      foglalt ? ido + " (Foglalt)" : ido,
      ido
    );

    option.disabled = Boolean(foglalt);
    idoSelect.add(option);
  });

  idoSelect.disabled = false;
}

filmSelect.addEventListener("change", idopontokBetoltese);
datumInput.addEventListener("change", idopontokBetoltese);

adatokBetoltese();
