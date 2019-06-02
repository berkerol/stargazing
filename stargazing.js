/* global $ Sine TweenLite FPSMeter */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const background = document.getElementById('background');
resizeHandler();

FPSMeter.theme.colorful.container.height = '40px';
const meter = new FPSMeter({
  left: canvas.width - 130 + 'px',
  top: 'auto',
  bottom: '12px',
  theme: 'colorful',
  heat: 1,
  graph: 1
});

const gap = 25;
const connections = 8;

const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2
};

const point = {
  highestDuration: 2,
  highestRadius: 4,
  highestX: 50,
  highestY: 50,
  lowestDuration: 1,
  lowestRadius: 2,
  lowestX: -50,
  lowestY: -50,
  lineWidth: 2,
  color: 15,
  colors: [[255, 30, 40], [255, 150, 20], [255, 220, 0], [0, 255, 100], [100, 255, 20], [50, 200, 200], [120, 220, 255], [80, 180, 255], [220, 120, 255], [255, 100, 150], [240, 20, 200], [140, 140, 140], [170, 170, 170], [200, 200, 200]]
};

const points = [];

for (let x = 0; x < canvas.width; x += canvas.width / gap) {
  for (let y = 0; y < canvas.height; y += canvas.height / gap) {
    const px = x + Math.random() * canvas.width / gap;
    const py = y + Math.random() * canvas.height / gap;
    points.push({
      x: px,
      originX: px,
      y: py,
      originY: py
    });
  }
}
for (const p1 of points) {
  p1.color = generateRandomColor();
  const closest = [];
  for (const p2 of points) {
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
for (const p of points) {
  shiftPoint(p);
}
document.addEventListener('mousemove', mouseMoveHandler);
window.addEventListener('resize', resizeHandler);

function draw () {
  meter.tick();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = point.lineWidth;
  for (const p of points) {
    if (p.alpha > 0) {
      for (const c of p.closest) {
        drawLine(p, c);
      }
    }
  }
  for (const p of points) {
    if (p.circle.alpha > 0) {
      drawCircle(p);
    }
  }
  processPoints();
  window.requestAnimationFrame(draw);
}

function drawLine (p, c) {
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(c.x, c.y);
  ctx.strokeStyle = `rgba(${c.color[0]}, ${c.color[1]}, ${c.color[2]}, ${p.alpha})`;
  ctx.stroke();
  ctx.closePath();
}

function drawCircle (p) {
  ctx.beginPath();
  ctx.arc(p.circle.position.x, p.circle.position.y, p.circle.radius, 0, 2 * Math.PI);
  ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.circle.alpha})`;
  ctx.fill();
  ctx.closePath();
}

function processPoints () {
  for (const p of points) {
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

function shiftPoint (p) {
  if (point.color === point.colors.length + 2) {
    p.color = generateRandomColor();
  }
  TweenLite.to(p, point.lowestDuration + Math.random() * (point.highestDuration - point.lowestDuration), {
    x: p.originX + point.lowestX + Math.random() * (point.highestX - point.lowestX),
    y: p.originY + point.lowestY + Math.random() * (point.highestY - point.lowestY),
    ease: Sine.easeInOut,
    onComplete: function () {
      shiftPoint(p);
    }
  });
}

function getDistance (p1, p2) {
  return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
}

function generateRandomColor () {
  return point.colors[Math.floor(Math.random() * point.colors.length)];
}

$('.dropdown-menu li a').click(function () {
  $('#selected').text($(this).text());
  point.color = $(this).closest('li').data('value');
  if (point.color === point.colors.length + 2 || point.color === point.colors.length + 1) {
    for (const p of points) {
      p.color = generateRandomColor();
    }
  } else if (point.color === point.colors.length) {
    const color = generateRandomColor();
    for (const p of points) {
      p.color = color;
    }
  } else {
    for (const p of points) {
      p.color = point.colors[point.color];
    }
  }
});

function mouseMoveHandler (e) {
  mouse.x = e.clientX - canvas.offsetLeft;
  mouse.y = e.clientY - canvas.offsetTop;
}

function resizeHandler () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  background.style.height = canvas.height + 'px';
}
