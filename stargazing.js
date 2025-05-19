/* global gsap canvas ctx animation addPause loop paintCircle paintLine getDistance generateRandomNumber colorIndex colorCodes addDropdownListener addCustomColor generateRandomColor resizeHandler backgroundCanvas */
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
  lineWidth: 2
};

const points = [];

resizeHandler();
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
    radius: generateRandomNumber(point.lowestRadius, point.highestRadius)
  };
}
for (const p of points) {
  shiftPoint(p);
}
addDropdownListener(points);
addCustomColor();
addPause();
document.addEventListener('mousemove', mouseMoveHandler);
window.addEventListener('resize', resizeHandler);

loop(function () {
  ctx.drawImage(backgroundCanvas, 0, 0);
  ctx.lineWidth = point.lineWidth;
  for (const p of points) {
    if (p.alpha > 0) {
      for (const c of p.closest) {
        paintLine(p.x, p.y, c.x, c.y, `rgba(${c.color[0]}, ${c.color[1]}, ${c.color[2]}, ${p.alpha})`);
      }
    }
  }
  for (const p of points) {
    if (p.circle.alpha > 0) {
      paintCircle(p.circle.position.x, p.circle.position.y, p.circle.radius, `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.circle.alpha})`);
    }
  }
  processPoints();
});

function processPoints () {
  for (const p of points) {
    if (getDistance(mouse, p) < 63) {
      p.alpha = 0.3;
      p.circle.alpha = 0.6;
    } else if (getDistance(mouse, p) < 141) {
      p.alpha = 0.1;
      p.circle.alpha = 0.3;
    } else if (getDistance(mouse, p) < 200) {
      p.alpha = 0.02;
      p.circle.alpha = 0.1;
    } else {
      p.alpha = 0;
      p.circle.alpha = 0;
    }
  }
}

function shiftPoint (p) {
  if (colorIndex === colorCodes.length + 2) {
    p.color = generateRandomColor();
  }
  gsap.to(p, generateRandomNumber(point.lowestDuration, point.highestDuration), {
    x: p.originX + generateRandomNumber(point.lowestX, point.highestX),
    y: p.originY + generateRandomNumber(point.lowestY, point.highestY),
    ease: 'sine.inOut',
    onComplete: function () {
      shiftPoint(p);
    }
  });
}

function mouseMoveHandler (e) {
  if (animation !== undefined) {
    mouse.x = e.clientX - canvas.offsetLeft;
    mouse.y = e.clientY - canvas.offsetTop;
  }
}
