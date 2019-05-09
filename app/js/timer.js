class Timer {
    init() {
        this.clock = document.getElementsByClassName('clock')[0];
        this.displayedTime = document.getElementsByClassName('current-time')[0];
        this.continue();
    }

    continue() {
        setTimeout(() => {
            this.displayedTime.innerText = this.sessionValue + ':00';
            }, 0);
    }
}

