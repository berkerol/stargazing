let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let background = document.getElementById("background");
resizeHandler();

let gap = 25;
let connections = 8;

let mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2
};

let point = {
  highestDuration: 2,
  highestRadius: 4,
  highestX: 50,
  highestY: 50,
  lowestDuration: 1,
  lowestRadius: 2,
  lowestX: -50,
  lowestY: -50,
  color: [255, 215, 0],
  lineWidth: 2,
  randomColors: false
};

let points = [];

for (let x = 0; x < canvas.width; x += canvas.width / gap) {
  for (let y = 0; y < canvas.height; y += canvas.height / gap) {
    let px = x + Math.random() * canvas.width / gap;
    let py = y + Math.random() * canvas.height / gap;
    points.push({
      x: px,
      originX: px,
      y: py,
      originY: py,
      r: point.color[0],
      g: point.color[1],
      b: point.color[2]
    });
  }
}
for (let p1 of points) {
  let closest = [];
  for (let p2 of points) {
    if (p1 !== p2) {
      for (let i = 0; i < connections; i++) {
        if (closest[i] === undefined) {
          closest[i] = p2;
          break;
        }
        if (getDistance(p1, p2) < getDistance(p1, closest[i])) {
          closest[i] = p2;
          break;
        }
      }
    }
  }
  p1.closest = closest;
  p1.circle = {
    position: p1,
    radius: point.lowestRadius + Math.random() * (point.highestRadius - point.lowestRadius)
  };
}
draw();
for (let p of points) {
  shiftPoint(p);
}
document.addEventListener("mousedown", mouseDownHandler);
document.addEventListener("mousemove", mouseMoveHandler);
window.addEventListener("resize", resizeHandler);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p of points) {
    if (p.alpha > 0) {
      for (let c of p.closest) {
        drawLine(p, c);
      }
    }
  }
  for (let p of points) {
    if (p.circle.alpha > 0) {
      drawCircle(p);
    }
  }
  processPoints();
  requestAnimationFrame(draw);
}

function drawLine(p, c) {
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(c.x, c.y);
  ctx.lineWidth = point.lineWidth;
  ctx.strokeStyle = "rgba(" + c.r + "," + c.g + "," + c.b + "," + p.alpha + ")";
  ctx.stroke();
  ctx.closePath();
}

function drawCircle(p) {
  ctx.beginPath();
  ctx.arc(p.circle.position.x, p.circle.position.y, p.circle.radius, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(" + p.r + "," + p.g + "," + p.b + "," + p.circle.alpha + ")";
  ctx.fill();
  ctx.closePath();
}

function processPoints() {
  for (let p of points) {
    if (Math.abs(getDistance(mouse, p)) < 4000) {
      p.alpha = 0.3;
      p.circle.alpha = 0.6;
    } else if (Math.abs(getDistance(mouse, p)) < 20000) {
      p.alpha = 0.1;
      p.circle.alpha = 0.3;
    } else if (Math.abs(getDistance(mouse, p)) < 40000) {
      p.alpha = 0.02;
      p.circle.alpha = 0.1;
    } else {
      p.alpha = 0;
      p.circle.alpha = 0;
    }
  }
}

function shiftPoint(p) {
  if (point.randomColors) {
    assignRandomColor(p);
  }
  TweenLite.to(p, point.lowestDuration + Math.random() * (point.highestDuration - point.lowestDuration), {
    x: p.originX + point.lowestX + Math.random() * (point.highestX - point.lowestX),
    y: p.originY + point.lowestY + Math.random() * (point.highestY - point.lowestY),
    ease: Sine.easeInOut,
    onComplete: function() {
      shiftPoint(p);
    }
  });
}

function getDistance(p1, p2) {
  return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
}

function assignRandomColor(p) {
  p.r = Math.floor(Math.random() * 255);
  p.g = Math.floor(Math.random() * 255);
  p.b = Math.floor(Math.random() * 255);
}

function mouseDownHandler(e) {
  for (let p of points) {
    assignRandomColor(p);
  }
}

function mouseMoveHandler(e) {
  mouse.x = e.clientX - canvas.offsetLeft;
  mouse.y = e.clientY - canvas.offsetTop;
}

function resizeHandler() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  background.style.height = canvas.height + "px";
}
