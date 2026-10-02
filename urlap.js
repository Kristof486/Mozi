const byId = (id) => document.getElementById(id);
const uzemanyag = document.querySelectorAll("input[name='uzemanyag']");

const datum = byId("date");
const uzenet = document.getElementById("message");
const KarakterHosszusag = document.getElementById("charCount");
const végösszeg = document.getElementById("végösszeg");
const ageInput = document.getElementById("age");



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

    const age = Number(ageInput.value);
    const tickets = Number(ticketsInput.value);
    if (!age || !tickets) {
        totalPrice.textContent = "0 Ft";
        discountText.textContent = "Nincs";
        return;
    }
  
    const originalPrice =
        TICKET_PRICE * tickets;


    let discount = 0;
    let discountName = "Nincs kedvezmény";



    if (age < 18) {

        discount = 20;
        discountName = "18 év alatti kedvezmény (20%)";

    }

    if (age >= 65) {
        discount = 25;
        discountName = "65 év feletti kedvezmény (25%)";

    } 
    if (tickets >= 10 && discount < 30) {
        discount = 30;
        discountName = "Csoportos kedvezmény (30%)";

    }
 
    const discountAmount =
        originalPrice * (discount / 100);

    const finalPrice =
        originalPrice - discountAmount;


    totalPrice.textContent =
        finalPrice.toLocaleString("hu-HU") + " Ft";
    discountText.textContent =
        discountName;
}


// Karakterhosszúság
uzenet.addEventListener("input", function () {
  KarakterHosszusag.textContent = uzenet.value.length;
});


