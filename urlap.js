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

const ulesekElem = byId("ulesek");
const kivalasztottElem = byId("kivalasztottHelyek");
const ulesHiba = byId("ulesHiba");



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
let kivalasztottUlesek = [];

function aktualisFilm() {
  return filmek.find(
    film => String(film.id) === filmSelect.value
  );
}

async function adatokBetoltese() {
    try {
        const [filmekValasz, foglalasokValasz] = await Promise.all([
            fetch("./filmek.json"),
            fetch("./foglalasok.json")
        ]);

        if (!filmekValasz.ok || !foglalasokValasz.ok) {
            throw new Error("Nem sikerült betölteni a JSON-fájlokat.");
        }

        filmek = await filmekValasz.json();
        foglalasok = await foglalasokValasz.json();

        filmSelect.innerHTML =
            '<option value="">Válassz filmet...</option>';

        filmek.forEach(film => {
            filmSelect.add(new Option(film.cim, film.id));
        });

        idopontokBetoltese();
        ulesekFrissitese();

    } catch (hiba) {
        console.error("Betöltési hiba:", hiba);
        alert("Hiba történt! Ellenőrizd a JSON-fájlokat és a konzolt.");
    }
}

function idopontokBetoltese() {
    const film = filmek.find(
        f => String(f.id) === filmSelect.value
    );

    idoSelect.innerHTML = "";

    if (!film) {
        idoSelect.add(new Option("Először válassz filmet...", ""));
        idoSelect.disabled = true;
        return;
    }

    idoSelect.add(new Option("Válassz időpontot...", ""));

    film.idopontok.forEach(ido => {
        idoSelect.add(new Option(ido, ido));
    });

    idoSelect.disabled = false;
}

filmSelect.addEventListener("change", idopontokBetoltese);
datumInput.addEventListener("change", idopontokBetoltese);

const ulesek = document.querySelectorAll("#ulesek .seat");

function kivalasztottHelyekFrissitese() {
    kivalasztottElem.textContent =
        kivalasztottUlesek.length > 0
            ? kivalasztottUlesek.join(", ")
            : "Nincs";
}

function hibaMegjelenitese(uzenet) {
    ulesHiba.textContent = uzenet;
    ulesHiba.classList.remove("d-none");
}

function hibaElrejtese() {
    ulesHiba.textContent = "";
    ulesHiba.classList.add("d-none");
}

function foglaltHelyekLekerdezese() {
    if (
        !filmSelect.value ||
        !idoSelect.value ||
        !datumInput.value
    ) {
        return [];
    }

    return foglalasok
        .filter(foglalas =>
            String(foglalas.filmId) === filmSelect.value &&
            foglalas.datum === datumInput.value &&
            foglalas.ido === idoSelect.value &&
            foglalas.torolve !== true
        )
        .flatMap(foglalas => foglalas.helyek || []);
}

function ulesekFrissitese() {
    const foglaltak = foglaltHelyekLekerdezese();
    ulesek.forEach(ules => {
        const hely = ules.dataset.seat;
        ules.classList.remove(
            "szabad",
            "kivalasztott",
            "foglalt"
        );
        if (foglaltak.includes(hely)) {
            ules.classList.add("foglalt");
            ules.disabled = true;
            ules.title = "Ez a hely már foglalt";
            ules.setAttribute("aria-pressed", "false");
        } else {
            ules.disabled = false;
            ules.title = "";

            if (kivalasztottUlesek.includes(hely)) {
                ules.classList.add("kivalasztott");
                ules.setAttribute("aria-pressed", "true");
            } else {
                ules.classList.add("szabad");
                ules.setAttribute("aria-pressed", "false");
            }
        }
    });

    kivalasztottHelyekFrissitese();
}

function ulesKivalasztasa(hely) {
    const jegyekSzama = Number(jegyekInput.value);
    const foglaltak = foglaltHelyekLekerdezese();

    if (foglaltak.includes(hely)) {
        return;
    }

    if (kivalasztottUlesek.includes(hely)) {
        kivalasztottUlesek =
            kivalasztottUlesek.filter(ules => ules !== hely);
    } else {
        if (!Number.isInteger(jegyekSzama) || jegyekSzama < 1) {
            hibaMegjelenitese(
                "Először adj meg legalább 1 jegyet."
            );
            return;
        }

        if (kivalasztottUlesek.length >= jegyekSzama) {
            hibaMegjelenitese(
                `Legfeljebb ${jegyekSzama} ülőhelyet választhatsz.`
            );
            return;
        }

        kivalasztottUlesek.push(hely);
    }
    hibaElrejtese();
    ulesekFrissitese();
}

ulesek.forEach(ules => {
    ules.addEventListener("click", () => {
        ulesKivalasztasa(ules.dataset.seat);
    });
});

function vetitesValtozott() {
    kivalasztottUlesek = [];
    hibaElrejtese();
    ulesekFrissitese();
}

filmSelect.addEventListener("change", () => {
    idopontokBetoltese();
    vetitesValtozott();
});

datumInput.addEventListener("change", () => {
    idopontokBetoltese();
    vetitesValtozott();
});

jegyekInput.addEventListener("input", () => {
    const jegyekSzama = Number(jegyekInput.value);

    if (!Number.isInteger(jegyekSzama) || jegyekSzama < 1) {
        kivalasztottUlesek = [];
    } else {
        kivalasztottUlesek =
            kivalasztottUlesek.slice(0, jegyekSzama);
    }

    hibaElrejtese();
    ulesekFrissitese();
});
adatokBetoltese();