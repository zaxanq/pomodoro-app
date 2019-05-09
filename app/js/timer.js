class Timer {
    init() {
        this.clock = document.getElementsByClassName('clock')[0];
        this.displayedTime = document.getElementsByClassName('current-time')[0];

        setTimeout(() => {
            this.displayedTime.innerText = this.sessionValue + ':00';
        }, 0);
    }

    start() {
        this.timerInterval = setInterval(() => {
            this.runTime();
        }, 1000);
    }

    runTime() {
        let minutes = parseInt(this.displayedTime.innerText.split(':')[0]);
        let seconds = parseInt(this.displayedTime.innerText.split(':')[1]);

        if (seconds === 0) {
            seconds = 59;
            minutes--;
        } else {
            seconds--;
        }
        this.renderClock(minutes + ':' + seconds);
    }

    renderClock(time) {
        this.displayedTime.innerText = time;
    }

    pause() {
        clearInterval(this.timerInterval);
    }
}

