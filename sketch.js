let particles = [];
let targetShape = [];

function setup() {
  createCanvas(600, 600);
  noStroke();
}

function draw() {
  background(0);

  // Partikel erzeugen
  let p = new Particle(random(width), random(height));
  particles.push(p);

  // Partikel bewegen und anzeigen
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.display();

    // Partikel langsam in Richtung einer zufälligen Form bewegen
    if (targetShape.length > 0) {
      p.moveToShape(targetShape);
    }

    // Wenn das Partikel zu alt ist, entfernen
    if (p.isFinished()) {
      particles.splice(i, 1);
    }
  }

  // Maus bewegt -> Zielform generieren
  if (mouseIsPressed) {
    generateTargetShape(mouseX, mouseY);
  }
}

// Zufällig eine Form generieren, die die Partikel annehmen sollen
function generateTargetShape(x, y) {
  targetShape = [];
  let numPoints = int(random(5, 10));
  let radius = 150;
  for (let i = 0; i < numPoints; i++) {
    let angle = map(i, 0, numPoints, 0, TWO_PI);
    let px = x + cos(angle) * radius;
    let py = y + sin(angle) * radius;
    targetShape.push(createVector(px, py));
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(5, 10);
    this.color = color(255, 215, 0); // Goldgelb
    this.lifetime = 255;
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.acceleration = createVector(0, 0);
  }

  // Partikel aktualisieren
  update() {
    this.velocity.add(this.acceleration);
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.acceleration.mult(0);
    this.lifetime -= 2;
  }

  // Partikel anzeigen
  display() {
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.lifetime);
    ellipse(this.x, this.y, this.size);
  }

  // Prüfen, ob das Partikel alt ist
  isFinished() {
    return this.lifetime <= 0;
  }

  // Bewege das Partikel zu einem Ziel in der Form
  moveToShape(shape) {
    if (shape.length > 0) {
      let closestPoint = this.findClosestPoint(shape);
      let direction = p5.Vector.sub(closestPoint, createVector(this.x, this.y));
      direction.setMag(0.05); // langsame Bewegung in Richtung der Form
      this.applyForce(direction);
    }
  }

  // Nächstes Punkt der Form finden
  findClosestPoint(shape) {
    let closest = shape[0];
    let minDist = dist(this.x, this.y, closest.x, closest.y);
    for (let i = 1; i < shape.length; i++) {
      let d = dist(this.x, this.y, shape[i].x, shape[i].y);
      if (d < minDist) {
        closest = shape[i];
        minDist = d;
      }
    }
    return closest;
  }

  // Kraft auf das Partikel anwenden
  applyForce(force) {
    this.acceleration.add(force);
  }
}