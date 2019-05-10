class App {
    init() {
        this.initControls();
        this.initSettings();
        this.initTimer();
    }

    initControls() {
        this.state = 0;
        this.buttonStart = document.getElementsByClassName('controls-start')[0];
        this.buttonPause = document.getElementsByClassName('controls-pause')[0];
        this.buttonReset = document.getElementsByClassName('controls-reset')[0];

        this.addOnClick(this.buttonStart);
        this.addOnClick(this.buttonPause);
        this.addOnClick(this.buttonReset);
    }

    initSettings() {
        this.sessionValue = 25;
        this.breakValue = 5;
        this.trueSessionTime = this.sessionValue * 60;
        this.trueBreakTime = this.breakValue * 60;
        this.initialSessionTime = this.trueSessionTime;
        this.initialBreakTime = this.trueBreakTime;

        this.sessionClass = 'settings__session';
        this.session = document.getElementsByClassName(this.sessionClass)[0];
        this.breakClass = 'settings__break';
        this.break = document.getElementsByClassName(this.breakClass)[0];

        this.sessionValueContainer = document.getElementsByClassName('session-value')[0];
        this.breakValueContainer = document.getElementsByClassName('break-value')[0];

        this.displayedTime = document.getElementsByClassName('current-time')[0];

        this.renderValues('initial');

        this.addButtonFunctions(this.session);
        this.addButtonFunctions(this.break);
    }

    initTimer() {
        this.circleLeft = document.getElementsByClassName('circle--left')[0];
        this.circleRight = document.getElementsByClassName('circle--right')[0];

        this.minutes = Math.floor(this.trueSessionTime / 60);
        this.seconds = this.trueSessionTime % 60;

        if (this.seconds < 10) {
            this.seconds = '0' + this.seconds;
        }
        setTimeout(() => {
            this.displayedTime.innerText = this.minutes + ':' + this.seconds;
        }, 0);
    }

    addButtonFunctions(element) {
        this.addButtonClick(element, 'increase', 1);
        this.addButtonClick(element, 'increase', 10);
        this.addButtonClick(element, 'decrease', -1);
        this.addButtonClick(element, 'decrease', -10);
    }

    addButtonClick(element, type, changeValue) {
        document.querySelector(`.${element.classList[0]} .${type}-${Math.abs(changeValue)}`)
            .addEventListener('click', () => {
            if (element.classList[0] === this.sessionClass) {
                this.updateValue(changeValue);
                this.renderValues('session');
            } else if (element.classList[0] === this.breakClass) {
                this.updateValue(changeValue);
                this.renderValues('break');
            } else {
                console.log('ERROR: No buttons found to add EventListener.')
            }
        });
    }

    addOnClick(element) {
        let elementClass = element.classList[2];

        element.addEventListener('click', () => {
            this.clearButtons();

            if (elementClass === 'controls-start') {
                if (this.state !== 1) {
                    if (this.trueSessionTime === 0) {
                        this.alert('You cannot start a timer for 0 minutes.');
                        console.log('ERROR: Cannot start a timer for 0 minutes.');
                    } else {
                        this.start();
                    }
                }

            } else if (elementClass === 'controls-pause') {
                if (this.state === 1) {
                    this.showActionIcon('pause');
                    this.pause();
                } else if (this.state === 0) {
                    this.alert('You cannot pause a timer that is not started.');
                    console.log('ERROR: Cannot pause a timer that is not started.');
                }

            } else if (elementClass === 'controls-reset') {
                if (this.state === 0) {
                    this.alert('The timer is already in initial state.');
                    console.log('ERROR: Cannot reset a timer that is not started.');
                } else {
                    this.showActionIcon('reset');
                    this.stop();
                }
            } else {
                console.log('ERROR: Unknown controls.');
            }
        });
    }

    clearButtons() {
        this.buttonStart.innerText = 'Start';
        this.buttonStart.classList.remove('active');
        this.buttonPause.innerText = 'Pause';
        this.buttonPause.classList.remove('active');
    }

    renderValues(valueType) {
        if (valueType === 'session') {
            this.sessionValueContainer.innerText = this.sessionValue;
        } else if (valueType === 'break') {
            this.breakValueContainer.innerText = this.breakValue;
        } else if (valueType === 'initial') {
            this.sessionValueContainer.innerText = this.sessionValue;
            this.breakValueContainer.innerText = this.breakValue;
        } else {
            console.log('ERROR: Undefined value container.');
        }
    }

    start() {
        this.initialSessionTime = this.sessionValue * 60;
        this.initialBreakValue = this.breakValue * 5;

        this.showActionIcon('start');
        this.buttonStart.classList.add('active');
        this.buttonStart.innerText = 'Started';
        this.disableButton('start');
        this.state = 1;

        this.timerInterval = setInterval(() => {
            this.trueSessionTime--;

            if (this.trueSessionTime < 0) {
                this.finished();
            } else {
                this.renderClock();
            }
        }, 1000);
    }

    pause() {
        this.buttonPause.classList.add('active');
        this.buttonPause.innerText = 'Paused';
        this.disableButton('pause');
        this.state = 2;

        clearInterval(this.timerInterval);
    }

    stop() {
        this.trueSessionTime = this.sessionValue * 60;
        this.disableButton('reset');
        this.state = 0;

        clearInterval(this.timerInterval);

        this.renderClock();
    }

    finished() {
        this.state = 0;
        this.clearButtons();

        clearInterval(this.timerInterval);
    }

    renderClock() {
        this.minutes = Math.floor(this.trueSessionTime / 60);
        this.seconds = this.trueSessionTime % 60;

        if (this.seconds < 10) {
            this.seconds = '0' + this.seconds;
        }

        this.displayedTime.innerText = this.minutes + ':' + this.seconds;
        this.renderCircle();
    }

    renderCircle() {
        let progress = this.initialSessionTime === 0 ? 0 : (this.initialSessionTime - this.trueSessionTime) / this.initialSessionTime * 360;

        console.log(progress);
        if (progress % 360 === 0) {
            this.circleLeft.setAttribute('style', `transform: rotate(0deg)`);
            this.circleRight.setAttribute('style', `transform: rotate(0deg)`);
        } else if (progress <= 180) {
            this.circleLeft.setAttribute('style', `transform: rotate(-${progress}deg)`);
            this.circleRight.setAttribute('style', `transform: rotate(0deg)`);
        } else {
            this.circleLeft.setAttribute('style', `transform: rotate(-180deg)`);
            this.circleRight.setAttribute('style', `transform: rotate(-${progress % 180}deg)`);
        }
    }

    alert(message) {
        let alert = document.getElementsByClassName('alert')[0];

        alert.innerText = message;
        alert.classList.remove('hidden');

        setTimeout(() => {
            alert.classList.add('hidden');
        }, 1500);
    }

    disableButton(button) {
        if (button === 'start') {
            this.buttonStart.classList.add('disabled');

            this.buttonPause.classList.remove('disabled');
            this.buttonReset.classList.remove('disabled');
        } else if (button === 'pause') {
            this.buttonPause.classList.add('disabled');

            this.buttonStart.classList.remove('disabled');
            this.buttonReset.classList.remove('disabled');
        } else if (button === 'reset') {
            this.buttonReset.classList.add('disabled');
            setTimeout(() => {
                this.buttonReset.classList.remove('disabled');
            },200);

            this.buttonStart.classList.remove('disabled');
            this.buttonPause.classList.remove('disabled');
        } else {
            console.log('ERROR: Unknown button.');
        }
    }
    updateValue(changeValue) {
        changeValue *= 60;

        if (this.trueSessionTime < -changeValue) {
            this.trueSessionTime = 0;
            this.initialSessionTime = 0;
        } else if (this.trueSessionTime + changeValue > 3600) {
            this.trueSessionTime = 3600;
            this.initialSessionTime = 3600;
            //TODO: add info that it's not possible to add more
        } else {
            this.trueSessionTime += changeValue;
            this.initialSessionTime += changeValue;
        }

        console.log(this.initialSessionTime, this.trueSessionTime, this.sessionValue);

        this.sessionValue = Math.floor(this.initialSessionTime / 60);
        this.renderClock();
    }

    showActionIcon(type) {
        document.getElementsByClassName(`action-${type}`)[0].classList.remove('hidden');

        setTimeout(() => {
            document.getElementsByClassName(`action-${type}`)[0].classList.add('hidden');
        }, 400)
    }

    toInput() {
        //TODO: add method changing value into input on click
    }
}

(function () {
    let app = new App;
    app.init();
})();
