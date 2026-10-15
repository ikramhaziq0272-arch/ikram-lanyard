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

let swingFrame = null;


/* =========================
   SETTINGS
========================= */

const maxX = 150;

const minY = -60;
const maxY = 95;

const spring = 0.033;

const damping = 0.91;


/* =========================
   IDLE SETTINGS
========================= */

/* lebih jelas daripada versi sebelum ni */

const idleAmplitudeX = 16;

const idleAmplitudeY = 4;

const idleRotation = 2.2;

const idleSpeed = 1.05;


/* =========================
   DRAG START
========================= */

holder.addEventListener(
  "pointerdown",
  function(event) {

    event.preventDefault();

    dragging = true;

    cancelAnimationFrame(
      swingFrame
    );

    swingFrame = null;

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


    updateVisual(
      currentX,
      currentY,
      currentX * 0.05
    );
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

function updateVisual(
  renderX,
  renderY,
  rotation
) {

  holder.style.transform = `
    translateX(-50%)
    translate(
      ${renderX}px,
      ${renderY}px
    )
    rotate(${rotation}deg)
  `;


  updateStraps(
    renderX,
    renderY
  );
}


/* =========================
   UPDATE STRAPS
========================= */

function updateStraps(
  renderX,
  renderY
) {

  const sceneWidth =
    scene.clientWidth;


  const leftAnchorX =
    sceneWidth * 0.20 + 10;


  const rightAnchorX =
    sceneWidth * 0.80 - 10;


  const anchorY =
    23;


  const targetX =
    sceneWidth / 2 +
    renderX;


  const targetY =
    230 +
    renderY;


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


  const strapHalfWidth =
    window.innerWidth <= 500
      ? 23
      : 28;


  strap.style.left =
    `${startX - strapHalfWidth}px`;


  strap.style.top =
    `${startY}px`;


  strap.style.height =
    `${length}px`;


  strap.style.transform = `
    rotate(${angle}deg)
  `;
}


/* =========================
   SWING BALIK
========================= */

function startSwing() {

  cancelAnimationFrame(
    swingFrame
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


    updateVisual(
      currentX,
      currentY,
      currentX * 0.05
    );


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

      swingFrame = null;

      return;
    }


    swingFrame =
      requestAnimationFrame(
        animate
      );
  }


  swingFrame =
    requestAnimationFrame(
      animate
    );
}


/* =========================
   IDLE ANIMATION
========================= */

function idleLoop(time) {

  if (
    !dragging &&
    swingFrame === null
  ) {

    const t =
      time / 1000;


    /* kiri kanan */

    const idleX =
      Math.sin(
        t * idleSpeed
      ) *
      idleAmplitudeX;


    /* naik turun halus */

    const idleY =
      Math.sin(
        t *
        idleSpeed *
        1.7
      ) *
      idleAmplitudeY;


    /* senget kiri kanan */

    const rotation =
      Math.sin(
        t * idleSpeed
      ) *
      idleRotation;


    updateVisual(
      idleX,
      idleY,
      rotation
    );
  }


  requestAnimationFrame(
    idleLoop
  );
}


/* =========================
   RESIZE
========================= */

window.addEventListener(
  "resize",
  function() {

    updateVisual(
      currentX,
      currentY,
      currentX * 0.05
    );
  }
);


/* =========================
   START
========================= */

updateVisual(
  0,
  0,
  0
);

requestAnimationFrame(
  idleLoop
);
