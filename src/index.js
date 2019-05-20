import './css/main.css';

class Game {
	constructor(container, bird) {
		this.bird = bird;
		this.container = container;
		this.isFlyingUp = false;
		this.isGame = false;
		this.flyHeight = 15;
		this.flyDuration = 300;
		this.flyCounter = 0;

		this.holeSize = 30;
		this.margin = 10;
		this.pixelPerSecond = 200;

		window.addEventListener('keydown', (e) => {
			if (e.code === "Space") {
				if (!this.isGame) {
					this.startGame();
				}
				this.flyUp();
			}
		})

		window.addEventListener('mousedown', (e) => {
			if (!this.isGame) {
				this.startGame();
			}
			this.flyUp();
		})

		window.addEventListener('touchstart', (e) => {
			if (!this.isGame) {
				this.startGame();
			}
			this.flyUp();
		})
	}

	startGame = () => {
		this.isGame = true;
		this.container.addEventListener('contextmenu', this.gameOver)
		setTimeout(() => {
			setInterval(this.createTube, 2000);
		}, 1000)
	}

	gameOver = (e) => {
		e.preventDefault();
		this.container.style.backgroundPosition = getComputedStyle(this.container).backgroundPosition;
		this.container.style.animationName = 'none';
		const columns = document.querySelectorAll('.column');
		for (let i = 0; i < columns.length; i++) {
			const item = columns[i];
			console.log(item);
			item.style.left = getComputedStyle(item).left;
			item.style.animationName = 'none';
		}
	}

	timingFunctionUp = (t) => {
		return t*(2-t);
	}

	timingFunctionDown = (t) => {
		return Math.pow(t, 1.2);
	}

	checkSmash = () => {

	}

	animateUp = (counter) => {
		if (counter < this.flyCounter) {
			return;
		}
		let time = performance.now() - this.startTime;
		if (time > this.flyDuration) {
			time = this.flyDuration;
		}
		const timing = this.timingFunctionUp(time / this.flyDuration);
		const top = this.startPos - timing * this.flyHeight;
		this.bird.style.top = top + '%';
		if (time < this.flyDuration) {
			requestAnimationFrame(() => {this.animateUp(counter)});
		} else {
			this.isFlyingUp = false;
			this.flyDown();
		}
	}


	animateDown = () => {
		if (this.isFlyingUp) {
			return;
		}
		let time = performance.now() - this.startTime;
		const timing = this.timingFunctionDown(time / this.flyDuration);
		const top = this.startPos + timing * this.flyHeight;
		this.bird.style.top = top + '%';
		requestAnimationFrame(this.animateDown);
	}

	flyUp = () => {
		this.startPos = parseInt(getComputedStyle(this.bird).top) / parseInt(getComputedStyle(this.container).height) * 100;
		this.startTime = performance.now();
		this.flyCounter += 1;
		this.isFlyingUp = true;
		requestAnimationFrame(() => {this.animateUp(this.flyCounter)});
	}

	flyDown = () => {
		this.startPos = parseInt(getComputedStyle(this.bird).top) / parseInt(getComputedStyle(this.container).height) * 100;
		this.startTime = performance.now();
		requestAnimationFrame(this.animateDown);
	}

	createTube = () => {
		const column = document.createElement('div');
		column.classList.add('column');
		column.style.top = '0';
		column.style.left = '100%';
		const min = this.margin + this.holeSize / 2;
		const max = 100 - min;
		const center = Math.floor(min + Math.random() * (max + 1 - min));

		const top = document.createElement('div');
		top.classList.add('column__top');
		top.style.height = center - this.holeSize / 2 + '%';

		const bottom = document.createElement('div');
		bottom.classList.add('column__bottom');
		bottom.style.height = 100 - center - this.holeSize / 2 + '%';

		column.appendChild(bottom);
		column.appendChild(top);
		this.container.append(column);
		column.addEventListener('animationend', this.remoteTube)
	}

	remoteTube = (e) => {
		e.target.remove();
	}
}

window.addEventListener('load', () => {
	const container = document.getElementById('container');
	const bird = document.getElementById('bird');
	const game = new Game(container, bird);
})