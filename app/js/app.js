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
        this.initialSessionValue = 25;
        this.initialBreakValue = 5;
        this.sessionValue = this.initialSessionValue;
        this.breakValue = this.initialBreakValue;

        //TODO: Continue with implementing seconds in the timer
        this.time = [this.sessionValue, 0];

        this.sessionClass = 'settings__session';
        this.session = document.getElementsByClassName(this.sessionClass)[0];
        this.breakClass = 'settings__break';
        this.break = document.getElementsByClassName(this.breakClass)[0];

        this.sessionValueContainer = document.getElementsByClassName('session-value')[0];
        this.breakValueContainer = document.getElementsByClassName('break-value')[0];

        this.displayedTime = document.getElementsByClassName('current-time')[0];
        console.log(this.displayedTime);

        this.renderValues('initial');

        this.addButtonFunctions(this.session);
        this.addButtonFunctions(this.break);
    }

    initTimer() {
        this.clock = document.getElementsByClassName('clock')[0];

        this.minutes = this.sessionValue;
        this.seconds = 0;
        setTimeout(() => {
            this.displayedTime.innerText = this.minutes + ':0' + this.seconds;
        }, 0);
    }

    addButtonFunctions(element) {
        this.addButtonClick(element, 'increase', 1);
        this.addButtonClick(element, 'increase', 10);
        this.addButtonClick(element, 'decrease', -1);
        this.addButtonClick(element, 'decrease', -10);
    }

    addButtonClick(element, type, changeValue) {
        document.querySelector(`.${element.classList[0]} .${type}-${Math.abs(changeValue)}`).addEventListener('click', () => {
            if (element.classList[0] === this.sessionClass) {
                this.sessionValue = this.updateValue('session', changeValue);
                this.renderValues('session')
            } else if (element.classList[0] === this.breakClass) {
                this.breakValue = this.updateValue('break', changeValue);
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
                    this.buttonStart.classList.add('active');
                    this.buttonStart.innerText = 'Started';
                    this.disableButton('start');
                    this.state = 1;
                    this.start();
                }
            } else if (elementClass === 'controls-pause') {
                if (this.state === 1) {
                    this.buttonPause.classList.add('active');
                    this.buttonPause.innerText = 'Paused';
                    this.disableButton('pause');
                    this.state = 2;
                    this.pause();
                } else if (this.state === 0) {
                    this.alert('You cannot pause a timer that is not started.');
                    console.log('ERROR: Cannot pause a timer that is not started.');
                } else {
                    this.buttonPause.classList.remove('paused');
                    this.buttonPause.innerText = 'Pause';
                }

            } else if (elementClass === 'controls-reset') {

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
            this.sessionValueContainer.innerText = this.initialSessionValue;
            this.breakValueContainer.innerText = this.initialBreakValue;
        } else {
            console.log('ERROR: Undefined value container.');
        }
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

    alert(message) {
        let alert = document.getElementsByClassName('alert')[0];

        alert.innerText = message;
        alert.classList.remove('hidden');

        setTimeout(() => {
            alert.classList.add('hidden');
        }, 2000);
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

            this.buttonStart.classList.remove('disabled');
            this.buttonPause.classList.remove('disabled');
        } else {
            console.log('ERROR: Unknown button.');
        }
    }
    updateValue(type, changeValue) {
        let value;
        let displayedValue;

        if (type === 'session') {
            value = this.sessionValue;
        } else if (type === 'break') {
            value = this.breakValue;
        } else {
            console.log('ERROR: No value specified to update.');
        }

        if (value < -changeValue) {
            value = 0;
        } else if (value + changeValue > 60) {
            value = 60;
            //TODO: add info that it's not possible to add more
        } else {
            value += changeValue;
        }

        if (value < 10) {
            displayedValue = '0' + value;
        } else {
            displayedValue = value;
        }

        this.displayedTime.innerText = displayedValue + this.seconds;

        return value;
    }

    toInput() {
        //TODO: add method changing value into input on click
    }
}

(function () {
    let app = new App;
    app.init();
})();
