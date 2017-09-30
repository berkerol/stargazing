let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let background = document.getElementById("background");
let width, height;
resizeHandler();

let target = {
  x: width / 2,
  y: height / 2
};
let points = [];
let rgb = [];

let gap = 25;
let connections = 8;

let radius = Math.random() * 2 + 2;
let tweenDuration = Math.random() + 1;

let counter;
let duration = 100;

for (let x = 0; x < width; x += width / gap) {
  for (let y = 0; y < height; y += height / gap) {
    let px = x + Math.random() * width / gap;
    let py = y + Math.random() * height / gap;
    points.push({
      x: px,
      originX: px,
      y: py,
      originY: py
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
  p1.circle = new Circle(p1, radius);
}
changeColors();
animate();
for (let p of points) {
  shiftPoint(p);
}
document.addEventListener("click", changeColors);
document.addEventListener("mousemove", mouseMoveHandler);
document.addEventListener("resize", resizeHandler);

function getDistance(p1, p2) {
  return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
}

function Circle(position, radius) {
  return {
    position,
    radius
  };
}

function changeColors() {
  counter = 0;
  rgb[0] = Math.floor(Math.random() * 255);
  rgb[1] = Math.floor(Math.random() * 255);
  rgb[2] = Math.floor(Math.random() * 255);
}

function animate() {
  if (counter !== duration) {
    counter++;
  } else {
    changeColors();
  }
  ctx.clearRect(0, 0, width, height);
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
      ctx.strokeStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + point.active + ")";
      ctx.stroke();
    }
  }
}

function drawCircle(circle) {
  if (circle.active) {
    ctx.beginPath();
    ctx.arc(circle.position.x, circle.position.y, circle.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + circle.active + ")";
    ctx.fill();
  }
}

function shiftPoint(point) {
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
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  background.style.height = height + "px";
}
