import './css/main.css';

class Game {
	constructor(container, bird) {
		this.bird = bird;
		this.container = container;
		this.isFlyingUp = false;
		this.isGameStart = false;
		this.isGameOver = false;
		this.flyHeight = 15;
		this.flyDuration = 300;
		this.flyCounter = 0;
		this.columnCounter = 0;
		this.score = 0;
		this.scoreContainer = document.querySelector('.score-container');
		this.scoreContainer.innerText = this.score;
		this.holeSize = 28;
		this.margin = 15;
		this.pixelPerSecond = 1000;
		document.querySelector('.results__button').addEventListener('click', this.restart);
		document.getElementById('main').style.height = document.documentElement.clientHeight + 'px';
		window.addEventListener('resize', () => {
			document.getElementById('main').style.height = document.documentElement.clientHeight + 'px';
		})
		window.addEventListener('keydown', (e) => {
			if (e.code === "Space") {
				if (!this.isGameStart) {
					this.startGame();
				}
				if (this.isGameOver) {
					return;
				}
				this.flyUp();
			}
		})

		window.addEventListener('mousedown', (e) => {
			if (!this.isGameStart) {
				this.startGame();
			}
			if (this.isGameOver) {
				return;
			}
			this.flyUp();
		})

		window.addEventListener('touchstart', (e) => {
			e.preventDefault();
			if (!this.isGameStart) {
				this.startGame();
			}
			if (this.isGameOver) {
				return;
			}	
			this.flyUp();
		})
	}

	startGame = () => {
		this.isGameStart = true;
		this.container.addEventListener('contextmenu', this.gameOver)
		setTimeout(() => {
			this.interval = setInterval(this.createTube, 1500);
		}, 1000)
	}

	restart = () => {
		document.querySelector('.results').classList.toggle('result--hidden');
		this.container.removeAttribute('style');
		this.bird.removeAttribute('style');
		const columns = document.querySelectorAll('.column');
		for (let i = 0; i < columns.length; i++) {
			columns[i].remove();
		}
		this.isFlyingUp = false;
		this.isGameStart = false;
		this.isGameOver = false;
		this.score = 0;
		this.scoreContainer.innerText = this.score;
		this.flyCounter = 0;
		this.columnCounter = 0;
	}

	gameOver = () => {
		if (this.isGameOver) {
			return false;
		} 
		this.isGameOver = true;
		this.bird.style.transform = 'translate(-50%, -50%) rotate(45deg)';
		clearInterval(this.interval);
		this.container.style.backgroundPosition = getComputedStyle(this.container).backgroundPosition;
		this.container.style.animationName = 'none';
		const columns = document.querySelectorAll('.column');
		for (let i = 0; i < columns.length; i++) {
			const item = columns[i];
			item.style.left = getComputedStyle(item).left;
			item.style.animationName = 'none';
		}
	}

	showResults = () => {
		document.querySelector('.results__score').innerText = this.score;
		document.querySelector('.results').classList.toggle('result--hidden');
		document.querySelector('.results__button').focus();
	}

	timingFunctionUp = (t) => {
		return t*(2-t);
	}

	timingFunctionDown = (t) => {
		return Math.pow(t, 1.2);
	}

	checkSmash = () => {
		const birdLeft = this.bird.getBoundingClientRect().left;
		const birdTop = this.bird.getBoundingClientRect().top;
		const birdWidth = this.bird.getBoundingClientRect().width;
		const birdHeight = this.bird.getBoundingClientRect().height;

		let columns = document.querySelectorAll('.column__top');
		columns.forEach = [].forEach;
		columns.forEach((item) => {
			const columnLeft = item.getBoundingClientRect().left;
			const columnTop = item.getBoundingClientRect().top;
			const columnWidth = item.getBoundingClientRect().width;
			const columnHeight = item.getBoundingClientRect().height;

			if ((columnTop + columnHeight - birdTop > 0) && (columnLeft - birdLeft < birdWidth) && (birdLeft - columnLeft < columnWidth)) {
				this.gameOver();
			}
		})

		columns = document.querySelectorAll('.column__bottom');
		columns.forEach = [].forEach;
		columns.forEach((item) => {
			const columnLeft = item.getBoundingClientRect().left;
			const columnTop = item.getBoundingClientRect().top;
			const columnWidth = item.getBoundingClientRect().width;

			if ((columnTop - birdHeight - birdTop < 0) && (columnLeft - birdLeft < birdWidth) && (birdLeft - columnLeft < columnWidth)) {
				this.gameOver();
			}
		})
	}

	checkScoreUp = () => {
		const column = document.querySelector(`.column[data-index='${this.score}']`);
		if (!column) {
			return;
		}
		const columnLeft = column.getBoundingClientRect().left;
		const columnWidth = column.getBoundingClientRect().width;
		const birdLeft = this.bird.getBoundingClientRect().left;
		if (columnLeft + columnWidth < birdLeft) {
			this.score++;
			this.scoreContainer.innerText = this.score;
		}
	}

	animateUp = (counter) => {
		if (counter < this.flyCounter) {
			return;
		}

		if (this.isGameOver) {
			this.isFlyingUp = false;
			this.flyDown();
			return;
		} 

		let time = performance.now() - this.startTime;
		if (time > this.flyDuration) {
			time = this.flyDuration;
		}
		const timing = this.timingFunctionUp(time / this.flyDuration);
		const top = this.startPos - timing * this.flyHeight;
		this.bird.style.top = top + '%';
		this.checkSmash();
		this.checkScoreUp();

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
		const timing = this.timingFunctionDown(time / this.flyDuration * 1.2);
		const top = this.startPos + timing * this.flyHeight;
		this.bird.style.top = top + '%';
		this.checkSmash();
		this.checkScoreUp();
		if (top > 105 && this.isGameOver) {
			this.showResults();
			return;
		}
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
		if (this.isGameOver) {
			return;
		}
		if (!this.isGameStart) {
			return;
		}
		const column = document.createElement('div');
		column.dataset.index = this.columnCounter++;
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