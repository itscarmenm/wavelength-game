const pairs = [
  ["Gay", "Hetero"],
  ["Persona de izquierdas", "Persona de derechas"],
  ["Cantante famosa", "Cantante flop"],
  ["Triunfitos exitosos", "trunfitos flop"],
  ["Profesor bueno", "profesor malo"],
  ["Asignatura buena", "asignatura mala"],
  ["Carrera con salidas", "carrera sin salidas"],
  ["Woke", "Conservador"],
  ["Gay", "Lesbiana"],
  ["Canción hit", "Canción flop"],
  ["Generación Z", "Millennial"],
  ["Album icónico", "Álbum flop"],
  ["Green flag", "Red flag"],
  ["Mal trabajo", "Buen trabajo"],
  ["Mala ciudad para vivir", "Buena ciudad para vivir"],
  ["País bueno", "País malo"],
  ["Caro", "Barato"],
  ["Cuernos", "No cuernos"]
];

let jugadorActual = 1;
let posicionObjetivo = 0;
let animacionId = null;
let anguloActual = 0;
let anguloObjetivo = 0;
let dibujando = false;
let agujaRojaVisible = false;

let currentPair = pairs[Math.floor(Math.random() * pairs.length)];

const turnInfo = document.getElementById("turn-info");
const cardContainer = document.getElementById("card-container");
const canvas = document.getElementById("dial-canvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spin-btn");
const hidePointerBtn = document.getElementById("hide-pointer-btn");
const guessRange = document.getElementById("guess-range");
const guessValue = document.getElementById("guess-value");
const submitBtn = document.getElementById("submit-guess");
const newRoundBtn = document.getElementById("new-round-btn");
const newCategoryBtn = document.getElementById("new-category-btn");
const result = document.getElementById("result");

function actualizarInterfaz() {
  turnInfo.innerText = jugadorActual === 1
    ? "Jugador 1: Presiona Girar o 'Otra categoría' y da la pista"
    : "Jugador 2: Escucha la pista y elige la posición";

  cardContainer.innerText = `Par: ${currentPair[0]} ←→ ${currentPair[1]}`;

  hidePointerBtn.style.display = agujaRojaVisible && jugadorActual === 1 ? "inline-block" : "none";

  if (jugadorActual === 2) {
    guessRange.style.display = "inline-block";
    guessRange.disabled = false;
    guessValue.style.display = "inline-block";
    submitBtn.style.display = "inline-block";
    submitBtn.disabled = false;

    spinBtn.style.display = "none";
    newCategoryBtn.style.display = "none";
  } else {
    guessRange.style.display = "none";
    guessRange.disabled = true;
    guessValue.style.display = "none";
    submitBtn.style.display = "none";
    submitBtn.disabled = true;

    spinBtn.style.display = "inline-block";
    newCategoryBtn.style.display = "inline-block";
  }

  newRoundBtn.style.display = "none";
  result.innerText = "";
  guessRange.value = 50;
  guessValue.innerText = "50";
}

function dibujarFlecha(cx, cy, angulo, longitud, colorCuerpo, colorBorde) {
  const anchoBase = 8;
  const largoCabeza = 28;
  const anchoCabeza = 18;

  const bx1 = cx + anchoBase / 2 * Math.cos(angulo - Math.PI / 2);
  const by1 = cy + anchoBase / 2 * Math.sin(angulo - Math.PI / 2);
  const bx2 = cx + anchoBase / 2 * Math.cos(angulo + Math.PI / 2);
  const by2 = cy + anchoBase / 2 * Math.sin(angulo + Math.PI / 2);

  const fx1 = bx1 + (longitud - largoCabeza) * Math.cos(angulo);
  const fy1 = by1 + (longitud - largoCabeza) * Math.sin(angulo);
  const fx2 = bx2 + (longitud - largoCabeza) * Math.cos(angulo);
  const fy2 = by2 + (longitud - largoCabeza) * Math.sin(angulo);

  const tipx = cx + longitud * Math.cos(angulo);
  const tipy = cy + longitud * Math.sin(angulo);

  const headx1 = fx1 + anchoCabeza / 2 * Math.cos(angulo - Math.PI / 2);
  const heady1 = fy1 + anchoCabeza / 2 * Math.sin(angulo - Math.PI / 2);
  const headx2 = fx2 + anchoCabeza / 2 * Math.cos(angulo + Math.PI / 2);
  const heady2 = fy2 + anchoCabeza / 2 * Math.sin(angulo + Math.PI / 2);

  ctx.save();

  ctx.beginPath();
  ctx.moveTo(bx1, by1);
  ctx.lineTo(fx1, fy1);
  ctx.lineTo(headx1, heady1);
  ctx.lineTo(tipx, tipy);
  ctx.lineTo(headx2, heady2);
  ctx.lineTo(fx2, fy2);
  ctx.lineTo(bx2, by2);
  ctx.closePath();
  ctx.strokeStyle = "white";
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(bx1, by1);
  ctx.lineTo(fx1, fy1);
  ctx.lineTo(headx1, heady1);
  ctx.lineTo(tipx, tipy);
  ctx.lineTo(headx2, heady2);
  ctx.lineTo(fx2, fy2);
  ctx.lineTo(bx2, by2);
  ctx.closePath();
  ctx.fillStyle = colorCuerpo;
  ctx.fill();
  ctx.strokeStyle = colorCuerpo;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
}

function dibujarDial(anguloIndicador, mostrarObjetivo = agujaRojaVisible) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height;
  const radio = 220;
  const colores = ['#8CCBA4', '#B9E399', '#FED18C', '#B9E399', '#8CCBA4'];
  const numSectores = colores.length;
  const anguloInicio = Math.PI;
  const anguloSector = Math.PI / numSectores;

  for (let i = 0; i < numSectores; i++) {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.fillStyle = colores[i];
    ctx.strokeStyle = "#555555"; // borde gris oscuro suave, más fino
    ctx.lineWidth = 1.2;
    ctx.arc(centerX, centerY, radio, anguloInicio + i * anguloSector, anguloInicio + (i + 1) * anguloSector);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  if (mostrarObjetivo && anguloIndicador !== null) {
    dibujarFlecha(
      centerX,
      centerY,
      anguloIndicador,
      radio * 0.98,
      "#e74c3c",
      "white"
    );

    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "#c0392b";
    ctx.fill();
    ctx.stroke();
  }
}

function rotarAObjetivo() {
  dibujando = true;
  agujaRojaVisible = true;
  hidePointerBtn.style.display = "inline-block";

  const vueltas = 3;
  const anguloTotalObjetivo = 2 * Math.PI * vueltas + anguloObjetivo;
  const pasoMin = 0.05;
  let anguloActualInterno = anguloActual;

  if (!animacionId) animacionId = requestAnimationFrame(animarRotacion);

  function animarRotacion() {
    const diferencia = anguloTotalObjetivo - anguloActualInterno;
    let paso = Math.max(pasoMin, diferencia * 0.1);

    if (diferencia < pasoMin) {
      anguloActual = anguloObjetivo;
      dibujarDial(anguloActual, agujaRojaVisible);
      cancelAnimationFrame(animacionId);
      animacionId = null;
      dibujando = false;
      return;
    }

    anguloActualInterno += paso;
    anguloActual = anguloActualInterno % (2 * Math.PI);

    dibujarDial(anguloActual, agujaRojaVisible);
    animacionId = requestAnimationFrame(animarRotacion);
  }
}

spinBtn.addEventListener("click", () => {
  if (jugadorActual !== 1) return;
  posicionObjetivo = Math.random() * 100;
  anguloObjetivo = Math.PI + (posicionObjetivo / 100) * Math.PI;
  rotarAObjetivo();
  actualizarInterfaz();

  spinBtn.style.display = "none"; 
  newCategoryBtn.style.display = "none";
});

newCategoryBtn.addEventListener("click", () => {
  if (jugadorActual !== 1 || dibujando) return;
  currentPair = pairs[Math.floor(Math.random() * pairs.length)];
  actualizarInterfaz();
});

hidePointerBtn.addEventListener("click", () => {
  agujaRojaVisible = false;
  hidePointerBtn.style.display = "none";
  jugadorActual = 2;
  actualizarInterfaz();
  dibujarDial(null, agujaRojaVisible);
});

guessRange.addEventListener("input", (e) => {
  guessValue.innerText = e.target.value;
  if (jugadorActual !== 2) return;
  const anguloGuess = Math.PI + (e.target.value / 100) * Math.PI;

  dibujarDial(null, agujaRojaVisible);

  const length = 210;
  dibujarFlecha(
    canvas.width / 2,
    canvas.height,
    anguloGuess,
    length,
    "#3f7ad3ff",
    "white"
  );
});

submitBtn.addEventListener("click", () => {
  if (jugadorActual !== 2) return;
  const guess = parseInt(guessRange.value);
  const distanciaAbsoluta = Math.abs(posicionObjetivo - guess);
  const porcentajeExito = Math.max(0, 100 - distanciaAbsoluta);
  result.innerText = `Distancia: ${distanciaAbsoluta.toFixed(2)}. Éxito: ${porcentajeExito.toFixed(2)}%.`;

  dibujarDial(Math.PI + (posicionObjetivo / 100) * Math.PI, true);

  const anguloGuess = Math.PI + (guess / 100) * Math.PI;
  const length = 210;

  dibujarFlecha(
    canvas.width / 2,
    canvas.height,
    anguloGuess,
    length,
    "#3f7ad3ff",
    "white"
  );

  guessRange.style.display = "none";
  submitBtn.style.display = "none";
  guessValue.style.display = "none";

  newRoundBtn.style.display = "inline-block";
  hidePointerBtn.style.display = "none";

  if (porcentajeExito >= 95) {
    confetti({
      particleCount: 200,
      spread: 60,
      origin: { y: 0.6 }
    });
  }
});

newRoundBtn.addEventListener("click", () => {
  jugadorActual = 1;
  currentPair = pairs[Math.floor(Math.random() * pairs.length)];
  result.innerText = "";
  newRoundBtn.style.display = "none";
  agujaRojaVisible = false;
  hidePointerBtn.style.display = "none";
  spinBtn.style.display = "inline-block"; 
  actualizarInterfaz();
  dibujarDial(null);
});

actualizarInterfaz();
dibujarDial(null);
