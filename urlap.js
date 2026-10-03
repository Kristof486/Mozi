const byId = (id) => document.getElementById(id);
const uzemanyag = document.querySelectorAll("input[name='uzemanyag']");

const datum = byId("date");
const uzenet = document.getElementById("message");
const KarakterHosszusag = document.getElementById("charCount");


const Jegyár = 2500;
const évInput = document.getElementById("év");
const jegyekInput = document.getElementById("jegyek");
const végösszeg = document.getElementById("végösszeg");
const KedvezményText = document.getElementById("kedvezmény");



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
  datum.min = ev + "-" + honap + "-" + nap; //Ez úgy működik, hogy a mai naptól tudod csak leadni a rendelést.

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
