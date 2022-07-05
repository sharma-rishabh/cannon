const randomInt = (upperLimit) => {
  return Math.floor(Math.random() * upperLimit);
};

const px = pixel => pixel + 'px';

class View {
  #viewSize;
  constructor(viewSize) {
    this.#viewSize = viewSize;
  };

  randomPoint() {
    const width = this.#viewSize.right - this.#viewSize.left;
    const height = this.#viewSize.bottom - this.#viewSize.top;
    return {
      x: this.#viewSize.left + randomInt(width),
      y: this.#viewSize.top + randomInt(height),
    }
  }

  get getInfo() {
    const height = this.#viewSize.bottom - this.#viewSize.top;
    const width = this.#viewSize.right - this.#viewSize.left;
    return {
      height,
      width,
      x: this.#viewSize.left,
      y: this.#viewSize.top
    }
  }

}

class Vector {
  #x;
  #y;
  constructor(x, y) {
    this.#x = x;
    this.#y = y;
  }
  add(otherVector) {
    const resultantX = this.#x + otherVector.#x;
    const resultantY = this.#y + otherVector.#y;
    return new Vector(resultantX, resultantY);
  }
  get direction() {
    return {
      x: this.#x,
      y: this.#y
    }
  }
}

class CannonBall {
  #id;
  #size;
  #velocity;
  #position;
  constructor(id, size, position, velocity) {
    this.#id = id;
    this.#size = size;
    this.#position = position;
    this.#velocity = velocity;
  }

  move(...influencers) {
    const totalForce = influencers.reduce((r, i) => r.add(i), new Vector(0, 0));

    this.#velocity = this.#velocity.add(totalForce);
    const effect = this.#velocity.direction;
    this.#position.x += effect.x;
    this.#position.y += effect.y;
  }

  get info() {
    return {
      id: this.#id,
      size: this.#size,
      position: { x: this.#position.x, y: this.#position.y }
    };
  }
}

const drawCannonBall = (cannonBall) => {
  const ballElement = document.createElement('div');
  const cannonBallInfo = cannonBall.info;

  ballElement.style.top = px(cannonBallInfo.position.y);
  ballElement.style.left = px(cannonBallInfo.position.x);
  ballElement.style.width = px(cannonBallInfo.size);
  ballElement.style.position = 'absolute';

  ballElement.id = cannonBallInfo.id;
  ballElement.className = 'cannon-ball'

  return ballElement;
}

const drawGame = (view, cannonBall) => {
  const viewInfo = view.getInfo;

  const viewElement = document.createElement('div');

  if (cannonBall) {
    viewElement.appendChild(drawCannonBall(cannonBall));
  }

  viewElement.id = 'view';
  viewElement.style.width = px(viewInfo.width);
  viewElement.style.height = px(viewInfo.height);
  viewElement.style.top = px(viewInfo.top);
  viewElement.style.left = px(viewInfo.left);

  document.body.appendChild(viewElement);
};

const updateGame = (view, cannonBall) => {
  const viewElement = document.getElementById('view');
  viewElement.remove();
  drawGame(view, cannonBall);
};

const convertToVector = (angle, speed) => {
  const radians = (Math.PI / 180) * angle;
  const x = speed * Math.cos(radians);
  const y = -speed * Math.sin(radians);
  return { x, y };
}

const createBall = () => {
  const getAngleElement = document.getElementById('angle');
  const getSpeedElement = document.getElementById('speed');
  const angle = getAngleElement.value;
  const speed = getSpeedElement.value;
  const vector = convertToVector(angle, speed);

  const velocity = new Vector(vector.x, vector.y);
  return new CannonBall('ball-1', 20, { x: 0, y: 700 }, velocity);
};

const isInsideWindow = (position) => {
  if (position.x < window.screenX) {
    return false;
  }
  if (position.x >= window.screen.availWidth) {
    return false;
  }
  if (position.y <= window.screenY) {
    return false;
  }
  if (position.y >= window.screen.availHeight) {
    return false;
  }
  return true;
};

const launchBall = (cannonBall, view, gravity, wind) => {
  const intervalId = setInterval(() => {
    if (!isInsideWindow(cannonBall.info.position)) {
      clearInterval(intervalId);
    }
    cannonBall.move(gravity, wind);
    updateGame(view, cannonBall);
  }, 100);
};

const main = () => {
  const view = new View({ top: 50, left: 50, bottom: 1800, right: 800 });
  const gravity = new Vector(0, 1);
  const wind = new Vector(-0.1, 0);

  const launchElement = document.getElementById('launch');

  launchElement.addEventListener('click', () => {
    const cannonBall = createBall();
    launchBall(cannonBall, view, gravity, wind);
    console.log('called');
  })
  drawGame(view);
};

window.onload = main;
