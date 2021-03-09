const NUM_PARTICLES = 100;
const TOTAL_TICKS = 100;
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const DECAY = 0.9;
const GRAVITY = 1;
const RAD_ANGLE = 130 * (Math.PI / 180);
const RAD_SPREAD = 35 * (Math.PI / 180);
const START_VELOCITY = 30;

const COLORS = [
  (opacity) => `rgba(255, 154, 162, ${opacity})`,
  (opacity) => `rgba(255, 183, 178, ${opacity})`,
  (opacity) => `rgba(255, 218, 193, ${opacity})`,
  (opacity) => `rgba(226, 240, 203, ${opacity})`,
  (opacity) => `rgba(181, 234, 215, ${opacity})`,
  (opacity) => `rgba(199, 206, 234, ${opacity})`,
];

// helper function
const getRandNumberBetween = (min, max) => {
  return Math.random() * (max - min) + min;
};

class Confetti {
  constructor(
    x,
    y,
    angle,
    spread,
    decay,
    gravity,
    startVelocity,
    width,
    height,
    colorIndex,
    ctx
  ) {
    this.x = x;
    this.y = y;
    (this.velocity = startVelocity * 0.5 + Math.random() * startVelocity),
      (this.angle2D = -angle + (0.5 * spread - Math.random() * spread)),
      (this.width = width);
    this.height = height;
    this.colorIndex = colorIndex;
    this.colorOpacity = 1;
    this.currentTick = 0;
    this.progress = 0;
    this.decay = decay;
    this.gravity = gravity * 3;
    this.ctx = ctx;
    this.wobble = Math.random() * 10;
    this.wobbleX = 0;
    this.wobbleY = 0;
  }

  drawConfetti() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = COLORS[this.colorIndex](this.colorOpacity);
    this.ctx.fillStyle = COLORS[this.colorIndex](this.colorOpacity);
    this.ctx.fillRect(this.wobbleX, this.wobbleY, this.width, this.height);
    this.ctx.stroke();
  }

  updateConfetti(ctx) {
    this.wobble += 0.1;
    this.wobbleX = this.x + Math.cos(this.wobble);
    this.wobbleY = this.y + Math.sin(this.wobble);

    this.x += Math.cos(this.angle2D) * this.velocity;
    this.y += Math.sin(this.angle2D) * this.velocity + this.gravity;

    this.velocity *= this.decay;

    this.drawConfetti();
    this.currentTick++;

    this.progress = this.currentTick / TOTAL_TICKS;

    if (this.progress > 0.5) {
      const percentPassedBenchmark = (this.progress - 0.5) / 0.5;
      this.colorOpacity = 1 - percentPassedBenchmark;
    }
  }
}

const runConfetti = (originX, originY, ctx) => {
  let confettiParticles = [];
  for (let i = 0; i < NUM_PARTICLES; i++) {
    const colorIndex = Math.floor(getRandNumberBetween(0, 6));
    const width = getRandNumberBetween(5, 8);
    const height = getRandNumberBetween(5, 8);
    confettiParticles[i] = new Confetti(
      originX,
      originY,
      RAD_ANGLE,
      RAD_SPREAD,
      DECAY,
      GRAVITY,
      START_VELOCITY,
      width,
      height,
      colorIndex,
      ctx
    );
  }

  return new Promise((resolve, reject) => {
    const animate = () => {
      if (confettiParticles[NUM_PARTICLES - 1].currentTick <= TOTAL_TICKS) {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, screenWidth, screenHeight);
        for (let i = 0; i < NUM_PARTICLES; i++) {
          confettiParticles[i].updateConfetti();
        }
      } else {
        resolve();
      }
    };

    animate();
  });
};

const checkboxClick = async (e) => {
  const element = e.target;
  const targetClassName = element.className;
  const checked = element.checked;
  const body = document.getElementsByTagName("BODY")[0];

  if (targetClassName === "task-list-item-checkbox" && checked) {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    canvas.style.zIndex = 100;
    canvas.style.pointerEvents = "none";
    canvas.style.top = 0;

    body.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    var position = element.getBoundingClientRect();

    await runConfetti(position.left, position.top, ctx);

    body.removeChild(canvas);
  }
};

const discussion_bucket = document.getElementById("discussion_bucket")
const project_container = document.getElementsByClassName("js-project-container")[0]

project_container && project_container.addEventListener("click", checkboxClick)
discussion_bucket && discussion_bucket.addEventListener("click", checkboxClick)