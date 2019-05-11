class App {
    init() {
        this.wrapper = document.getElementsByClassName('wrapper')[0];

        this.initSettings();
        this.initControls();
        this.initTimer();
    }

    /*
       current buglist:
        *   setting session time to 0 during running timer will stop the timer. but even if we change session time
            we still cannot start the timer.
                however pressing break button sets session time to what we changed it. worth checking out.
        *   if we start the timer (with session time smaller than 60 (!)) and keep current time below 60 minutes
            we can keep increasing session time for how long we want, even though it should max at 60.
        *   setting break time to 0 during running timer will stop the timer with green layout but with logic
            of session (red layout).

        feature-add list:
        *   maybe max time should be 120 minutes instead of 60, or maybe as much one desires (max 720?)
        *   session time number to change into input at click
     */

    initControls() {
        this.state = 0;
        this.sessionIsActive = true;
        this.buttonStart = document.getElementsByClassName('controls-start')[0];
        this.buttonPause = document.getElementsByClassName('controls-pause')[0];
        this.buttonReset = document.getElementsByClassName('controls-reset')[0];

        this.startSession = document.getElementsByClassName('controls-session')[0];
        this.startBreak = document.getElementsByClassName('controls-break')[0];

        this.switch(true);

        this.addOnClick(this.buttonStart);
        this.addOnClick(this.buttonPause);
        this.addOnClick(this.buttonReset);

        this.addOnClick(this.startSession);
        this.addOnClick(this.startBreak);
    }

    initSettings() {
        this.sessionValue = 25;
        this.breakValue = 5;
        this.updateTimes(this._session);
        this.updateTimes(this._break);


        this._session = 'session';
        this._break = 'break';
        this.sessionClass = `settings__${this._session}`;
        this.session = document.getElementsByClassName(this.sessionClass)[0];
        this.breakClass = `settings__${this._break}`;
        this.break = document.getElementsByClassName(this.breakClass)[0];

        this.sessionValueContainer = document.getElementsByClassName(`${this._session}-value`)[0];
        this.breakValueContainer = document.getElementsByClassName(`${this._break}-value`)[0];

        this.displayedTime = document.getElementsByClassName('current-time')[0];

        this.renderValues('initial');

        this.addButtonFunctions(this.session);
        this.addButtonFunctions(this.break);
    }

    initTimer() {
        this.circleLeft = document.getElementsByClassName('circle--left')[0];
        this.circleRight = document.getElementsByClassName('circle--right')[0];

        this.minutes = Math.floor(this.trueTime / 60);
        this.seconds = this.trueTime % 60;

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
                /*TODO: Add separation so that alert only shows when we are pressing button to actually click
                    for more than 60 or less than 0. Currently if we set break time to 0 and change session value
                    the alert keeps showing.
                 */
            if ((this.trueSessionTime === 3600 || this.trueBreakTime === 3600) && type === 'increase') {
                this.alert('Cannot add more time to the timer.');
            } else if ((this.trueSessionTime === 0 || this.trueBreakTime === 0) && type === 'decrease') {
                this.alert('Time value cannot be less than 0.');
            }

            if (element.classList[0] === this.sessionClass) {
                this.updateValue(this._session, changeValue);
                this.renderValues(this._session);
            } else if (element.classList[0] === this.breakClass) {
                this.updateValue(this._break, changeValue);
                this.renderValues(this._break);
            } else {
                console.log('ERROR: No buttons found to add EventListener.')
            }
        });
    }

    addOnClick(element) {
        let elementClass = element.classList[2];

        element.addEventListener('click', () => {
            if (elementClass === 'controls-start') {
                if (this.state !== 1) {
                    if (this.trueTime === 0) {
                        this.alert('You cannot start a timer for 0 minutes.');
                        console.log('ERROR: Cannot start a timer for 0 minutes.');
                    } else {
                        this.showActionIcon('start');
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
            } else if ((elementClass === `controls-${this._session}`) || (elementClass === `controls-${this._break}`)) {
                this.finished();
            } else {
                console.log('ERROR: Unknown controls.');
            }
        });
    }

    setContainer(type, value) {
        if (type === this._session) {
            this.sessionValueContainer.innerText =  value;
        } else if (type === this._break) {
            this.breakValueContainer.innerText =  value;
        }
    }

    updateTimes(type, trueTimes = false) {
        if (type === this._session) {
            this.trueSessionTime = this.sessionValue * 60;
            this.initialSessionTime = this.trueSessionTime;

            if (trueTimes) {
                this.trueTime = this.trueSessionTime;
                this.initialTime = this.initialSessionTime;
            }
        } else if (type === this._break) {
            this.trueBreakTime = this.breakValue * 60;
            this.initialBreakTime = this.trueBreakTime;

            if (trueTimes) {
                this.trueTime = this.trueBreakTime;
                this.initialTime = this.initialBreakTime;
            }
        }
    }

    renderValues(valueType) {
        if (valueType === 'initial') {
            this.setContainer(this._session, this.sessionValue);
            this.setContainer(this._break, this.breakValue);
            this.updateTimes(this._session);
            this.updateTimes(this._break);

        } else if (valueType === this._session && this.sessionIsActive) {
            this.setContainer(this._session, this.value);
            this.sessionValue = this.value;
            this.updateTimes(this._session);

        } else if (valueType === this._break && !this.sessionIsActive) {
            this.setContainer(this._break, this.value);
            this.breakValue = this.value;
            this.updateTimes(this._break);

        } else if (valueType === this._session) {
            this.setContainer(this._session, this.sessionValue);
            this.updateTimes(this._session);

        } else if (valueType === this._break) {
            this.setContainer(this._break, this.breakValue);
            this.updateTimes(this._break);

        } else {
            console.log('ERROR: Undefined value container.');
        }
    }

    start() {
        this.buttonStart.classList.add('active');
        this.buttonStart.innerText = 'Started';
        this.disableButton('start');
        this.state = 1;

        this.timerInterval = setInterval(() => {
            this.trueTime--;
            if (this.trueTime < 0) {
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
        this.trueTime = this.value * 60;
        this.disableButton('reset');
        this.state = 0;
        clearInterval(this.timerInterval);
        this.renderClock();
    }

    finished() {
        this.state = 0;
        clearInterval(this.timerInterval);
        this.switch();
    }

    switchButtons(sessionIsActive) {
        let buttonHidden = 'button-hidden';
        if (sessionIsActive) {
            this.startSession.classList.add(buttonHidden);
            this.startBreak.classList.remove(buttonHidden);
        } else {
            this.startSession.classList.remove(buttonHidden);
            this.startBreak.classList.add(buttonHidden);
        }
    }

    switch(initial = false) {
        let className;
        if (!initial) {
            this.sessionIsActive = !this.sessionIsActive;
        }

        if (this.initialSessionTime === 0) {
            this.value = this.sessionValue;
            className = this._session;

            this.stop();
            this.alert('Cannot start a timer for 0 minutes.');
            console.log('ERROR: Cannot start a timer for 0 minutes.');
        }
        else if (this.initialBreakTime === 0) {
            this.value = this.sessionValue;
            className = this._session;

            this.stop();
            this.alert('Is there a point in using this timer with 0 break time? :)');
        } else {
            if (this.sessionIsActive) {
                if (typeof this.value !== 'undefined') {
                    this.breakValue = this.value;
                }
                this.value = this.sessionValue;
                className = this._session;

                this.switchButtons(true);
                [...document.getElementsByClassName(this._break)]
                    .map(button => button.classList.remove(this._break));
            } else {
                if (typeof this.value !== 'undefined') {
                    this.sessionValue = this.value;
                }
                this.value = this.breakValue;
                className = this._break;

                this.switchButtons(false);
                [...document.getElementsByClassName(this._session)]
                    .map(button => button.classList.remove(this._session));
            }

            if (!initial) {
                this.pause();
                this.start();
            }
        }

        this.updateTimes(className, true);

        this.wrapper.classList.add(className);
        [...document.getElementsByClassName('button')]
            .map(button => button.classList.add(className));
    }

    renderClock() {
        this.minutes = Math.floor(this.trueTime / 60);
        this.seconds = this.trueTime % 60;

        if (this.seconds < 10) {
            this.seconds = '0' + this.seconds;
        }

        this.displayedTime.innerText = this.minutes + ':' + this.seconds;
        this.renderCircle();
    }

    renderCircle() {
        let progress = this.initialTime === 0 ? 0 : (this.initialTime - this.trueTime) / this.initialTime * 360;

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

            this.buttonPause.innerText = 'Pause';
            this.buttonPause.classList.remove('active');
        } else if (button === 'pause') {
            this.buttonPause.classList.add('disabled');

            this.buttonStart.classList.remove('disabled');
            this.buttonReset.classList.remove('disabled');

            this.buttonStart.innerText = 'Start';
            this.buttonStart.classList.remove('active');
        } else if (button === 'reset') {
            this.buttonReset.classList.add('disabled');
            setTimeout(() => {
                this.buttonReset.classList.remove('disabled');
            },200);

            this.buttonStart.classList.remove('disabled');
            this.buttonPause.classList.remove('disabled');

            this.buttonStart.innerText = 'Start';
            this.buttonStart.classList.remove('active');
            this.buttonPause.innerText = 'Pause';
            this.buttonPause.classList.remove('active');
        } else {
            console.log('ERROR: Unknown button.');
        }
    }
    updateValue(valueType, changeValue) {
        changeValue *= 60;

        if ((valueType === this._session && this.sessionIsActive) || (valueType === this._break && !this.sessionIsActive)) {
            if (this.trueTime < -changeValue) {
                this.trueTime = 0;
                this.initialTime = 0;

            } else if (this.trueTime + changeValue > 3600) {
                this.trueTime = 3600;
                this.initialTime = 3600;

            } else {
                this.trueTime += changeValue;
                this.initialTime += changeValue;
            }

            this.value = Math.floor(this.initialTime / 60);
            if (this.sessionIsActive) {
                this.sessionValue = this.value;
            } else {
                this.breakValue = this.value;
            }
        } else {
            if (valueType === this._session) {
                if (this.trueSessionTime < -changeValue) {
                    this.trueSessionTime = 0;
                    this.initialSessionTime = 0;

                } else if (this.trueSessionTime + changeValue > 3600) {
                    this.trueSessionTime = 3600;
                    this.initialSessionTime = 3600;

                } else {
                    this.trueSessionTime += changeValue;
                    this.initialSessionTime += changeValue;
                }
                this.sessionValue = Math.floor(this.initialSessionTime / 60);
            } else if (valueType === this._break) {
                if (this.trueBreakTime < -changeValue) {
                    this.trueBreakTime = 0;
                    this.initialBreakTime = 0;

                } else if (this.trueBreakTime + changeValue > 3600) {
                    this.trueBreakTime = 3600;
                    this.initialBreakTime = 3600;

                } else {
                    this.trueBreakTime += changeValue;
                    this.initialBreakTime += changeValue;
                }
                this.breakValue = Math.floor(this.initialBreakTime / 60);
            }
        }

        if ((valueType === this._session && this.sessionIsActive) || (valueType === this._break && !this.sessionIsActive)) {
            this.renderClock();
        }
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
