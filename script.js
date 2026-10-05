const holder =
  document.getElementById("holder");

let dragging = false;

let currentX = 0;
let currentY = 0;

let startPointerX = 0;
let startPointerY = 0;

let startHolderX = 0;
let startHolderY = 0;

let lastPointerX = 0;
let lastPointerY = 0;

let velocityX = 0;
let velocityY = 0;

let animationFrame = null;


/* =========================
   SETTINGS
========================= */

const maxX = 150;

const minY = -40;
const maxY = 80;

const spring = 0.035;

const damping = 0.90;


/* =========================
   START DRAG
========================= */

holder.addEventListener(
  "pointerdown",
  function(event) {

    event.preventDefault();

    dragging = true;

    cancelAnimationFrame(
      animationFrame
    );

    startPointerX =
      event.clientX;

    startPointerY =
      event.clientY;

    startHolderX =
      currentX;

    startHolderY =
      currentY;

    lastPointerX =
      event.clientX;

    lastPointerY =
      event.clientY;

    velocityX = 0;
    velocityY = 0;

    holder.setPointerCapture(
      event.pointerId
    );

    holder.style.cursor =
      "grabbing";
  }
);


/* =========================
   DRAG
========================= */

holder.addEventListener(
  "pointermove",
  function(event) {

    if (!dragging) {
      return;
    }

    event.preventDefault();

    const deltaX =
      event.clientX -
      startPointerX;

    const deltaY =
      event.clientY -
      startPointerY;


    currentX =
      startHolderX +
      deltaX;

    currentY =
      startHolderY +
      deltaY;


    /* Limit kiri kanan */

    currentX =
      Math.max(
        -maxX,
        Math.min(
          maxX,
          currentX
        )
      );


    /* Limit atas bawah */

    currentY =
      Math.max(
        minY,
        Math.min(
          maxY,
          currentY
        )
      );


    /* Simpan kelajuan */

    velocityX =
      event.clientX -
      lastPointerX;

    velocityY =
      event.clientY -
      lastPointerY;

    lastPointerX =
      event.clientX;

    lastPointerY =
      event.clientY;


    updateVisual();
  }
);


/* =========================
   LEPASKAN
========================= */

holder.addEventListener(
  "pointerup",
  function(event) {

    if (!dragging) {
      return;
    }

    dragging = false;

    holder.style.cursor =
      "grab";

    try {

      holder.releasePointerCapture(
        event.pointerId
      );

    } catch(error) {

      // ignore
    }

    startSwing();
  }
);


/* =========================
   POINTER CANCEL
========================= */

holder.addEventListener(
  "pointercancel",
  function() {

    dragging = false;

    holder.style.cursor =
      "grab";

    startSwing();
  }
);


/* =========================
   UPDATE VISUAL
========================= */

function updateVisual() {

  const rotation =
    currentX * 0.05;

  holder.style.transform = `
    translateX(-50%)
    translate(
      ${currentX}px,
      ${currentY}px
    )
    rotate(${rotation}deg)
  `;
}


/* =========================
   SWING BALIK
========================= */

function startSwing() {

  cancelAnimationFrame(
    animationFrame
  );

  function animate() {

    /* spring force */

    velocityX +=
      -currentX *
      spring;

    velocityY +=
      -currentY *
      spring;


    /* damping */

    velocityX *=
      damping;

    velocityY *=
      damping;


    /* update posisi */

    currentX +=
      velocityX;

    currentY +=
      velocityY;


    updateVisual();


    const stopped =
      Math.abs(currentX) < 0.2 &&
      Math.abs(currentY) < 0.2 &&
      Math.abs(velocityX) < 0.2 &&
      Math.abs(velocityY) < 0.2;


    if (stopped) {

      currentX = 0;
      currentY = 0;

      velocityX = 0;
      velocityY = 0;

      updateVisual();

      return;
    }


    animationFrame =
      requestAnimationFrame(
        animate
      );
  }


  animate();
}


/* =========================
   INITIAL
========================= */

updateVisual();
