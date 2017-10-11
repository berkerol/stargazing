let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let background = document.getElementById("background");
resizeHandler();

let target = {
  x: canvas.width / 2,
  y: canvas.height / 2
};
let points = [];

let gap = 25;
let connections = 8;

let radius = Math.random() * 4 + 2;
let tweenDuration = Math.random() + 1;

for (let x = 0; x < canvas.width; x += canvas.width / gap) {
  for (let y = 0; y < canvas.height; y += canvas.height / gap) {
    let px = x + Math.random() * canvas.width / gap;
    let py = y + Math.random() * canvas.height / gap;
    points.push({
      x: px,
      originX: px,
      y: py,
      originY: py,
      red: Math.floor(Math.random() * 255),
      green: Math.floor(Math.random() * 255),
      blue: Math.floor(Math.random() * 255)
    });
  }
}
for (let p1 of points) {
  let closest = [];
  for (let p2 of points) {
    if (p1 !== p2) {
      let placed = false;
      for (let i = 0; i < connections; i++) {
        if (!placed) {
          if (closest[i] === undefined) {
            closest[i] = p2;
            placed = true;
          }
        }
      }
      for (let i = 0; i < connections; i++) {
        if (!placed) {
          if (getDistance(p1, p2) < getDistance(p1, closest[i])) {
            closest[i] = p2;
            placed = true;
          }
        }
      }
    }
  }
  p1.closest = closest;
  p1.circle = {
    position: p1,
    radius,
    red: Math.floor(Math.random() * 255),
    green: Math.floor(Math.random() * 255),
    blue: Math.floor(Math.random() * 255)
  };
}
animate();
for (let p of points) {
  shiftPoint(p);
}
document.addEventListener("mousemove", mouseMoveHandler);
window.addEventListener("resize", resizeHandler);

function getDistance(p1, p2) {
  return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p of points) {
    drawPoint(p);
    drawLines(p);
    drawCircle(p.circle);
  }
  requestAnimationFrame(animate);
}

function drawPoint(point) {
  if (Math.abs(getDistance(target, point)) < 4000) {
    point.active = 0.3;
    point.circle.active = 0.6;
  } else if (Math.abs(getDistance(target, point)) < 20000) {
    point.active = 0.1;
    point.circle.active = 0.3;
  } else if (Math.abs(getDistance(target, point)) < 40000) {
    point.active = 0.02;
    point.circle.active = 0.1;
  } else {
    point.active = 0;
    point.circle.active = 0;
  }
}

function drawLines(point) {
  if (point.active) {
    for (let p of point.closest) {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(p.x, p.y);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(" + p.red + "," + p.green + "," + p.blue + "," + point.active + ")";
      ctx.stroke();
    }
  }
}

function drawCircle(circle) {
  if (circle.active) {
    ctx.beginPath();
    ctx.arc(circle.position.x, circle.position.y, circle.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(" + circle.red + "," + circle.green + "," + circle.blue + "," + circle.active + ")";
    ctx.fill();
  }
}

function shiftPoint(point) {
  point.red = Math.floor(Math.random() * 255);
  point.green = Math.floor(Math.random() * 255);
  point.blue = Math.floor(Math.random() * 255);
  TweenLite.to(point, tweenDuration, {
    x: point.originX - 50 + Math.random() * 100,
    y: point.originY - 50 + Math.random() * 100,
    ease: Sine.easeInOut,
    onComplete: function() {
      shiftPoint(point);
    }
  });
}

function mouseMoveHandler(e) {
  target.x = e.clientX;
  target.y = e.clientY;
}

function resizeHandler() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  background.style.height = canvas.height + "px";
}
