const scene =
  document.getElementById("scene");

const holder =
  document.getElementById("holder");

const strapLeft =
  document.getElementById("strapLeft");

const strapRight =
  document.getElementById("strapRight");


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

const minY = -60;
const maxY = 95;

const spring = 0.033;

const damping = 0.91;


/* =========================
   DRAG START
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
   DRAG MOVE
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


    currentX =
      Math.max(
        -maxX,
        Math.min(
          maxX,
          currentX
        )
      );


    currentY =
      Math.max(
        minY,
        Math.min(
          maxY,
          currentY
        )
      );


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
   DRAG END
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

    } catch(error) {}

    startSwing();
  }
);


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
    currentX * 0.055;


  holder.style.transform = `
    translateX(-50%)
    translate(
      ${currentX}px,
      ${currentY}px
    )
    rotate(${rotation}deg)
  `;


  updateStraps();
}


/* =========================
   UPDATE STRAPS
========================= */

function updateStraps() {

  const sceneWidth =
    scene.clientWidth;


  const leftAnchorX =
    sceneWidth * 0.22 + 9;


  const rightAnchorX =
    sceneWidth * 0.78 - 9;


  const anchorY =
    23;


  const targetX =
    sceneWidth / 2 +
    currentX;


  const targetY =
    225 +
    currentY;


  positionStrap(
    strapLeft,
    leftAnchorX,
    anchorY,
    targetX,
    targetY
  );


  positionStrap(
    strapRight,
    rightAnchorX,
    anchorY,
    targetX,
    targetY
  );
}


/* =========================
   POSITION STRAP
========================= */

function positionStrap(
  strap,
  startX,
  startY,
  endX,
  endY
) {

  const dx =
    endX -
    startX;


  const dy =
    endY -
    startY;


  const length =
    Math.sqrt(
      dx * dx +
      dy * dy
    );


  const angle =
    Math.atan2(
      dy,
      dx
    ) *
    180 /
    Math.PI -
    90;


  strap.style.left =
    `${startX - 8}px`;


  strap.style.top =
    `${startY}px`;


  strap.style.height =
    `${length}px`;


  strap.style.transform = `
    rotate(${angle}deg)
  `;
}


/* =========================
   SWING
========================= */

function startSwing() {

  cancelAnimationFrame(
    animationFrame
  );


  function animate() {

    velocityX +=
      -currentX *
      spring;


    velocityY +=
      -currentY *
      spring;


    velocityX *=
      damping;


    velocityY *=
      damping;


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
   RESIZE
========================= */

window.addEventListener(
  "resize",
  updateVisual
);


/* =========================
   INITIAL
========================= */

updateVisual();
