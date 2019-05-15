class App {
    init() {
        this.wrapper = document.getElementsByClassName('wrapper')[0];
        this.timeDebugging = 1000;
        this.initSettings();
        this.initControls();
        this.initTimer();

        this.switch(true);
    }

    initControls() {
        this.buttonStart = document.getElementsByClassName('controls-start')[0];
        this.buttonPause = document.getElementsByClassName('controls-pause')[0];
        this.buttonReset = document.getElementsByClassName('controls-reset')[0];

        this.startSession = document.getElementsByClassName('controls-session')[0];
        this.startBreak = document.getElementsByClassName('controls-break')[0];

        this.addOnClick(this.buttonStart);
        this.addOnClick(this.buttonPause);
        this.addOnClick(this.buttonReset);

        this.addOnClick(this.startSession);
        this.addOnClick(this.startBreak);

        this.loadAlerts();
    }

    initSettings() {
        this.state = 0;
        this.sessionIsActive = true;

        if (localStorage.length !== 0) {
            this.sessionValue = localStorage.getItem('sessionTime') / 60;
            this.breakValue = localStorage.getItem('breakTime') / 60;
        } else {
            this.sessionValue = 25;
            this.breakValue = 5;
        }

        this.updateTimes(this._break, true);
        this.updateTimes(this._session, true);

        this.maximumTime = 240;
        this.maximumTime *= 60;

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

        this.addLabel(this._session);
        this.addLabel(this._break);

        this.addButtonFunctions(this.session);
        this.addButtonFunctions(this.break);

        this.addContainersClick();
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

        this.setToggleAnimations();
    }

    loadAlerts() {
        this.message_maxTime = 'Cannot add more time to the timer.';
        this.message_noZero = 'You cannot start a timer for 0 minutes.';
        this.message_moreThanZero = 'Time value cannot be less than 0.';
        this.message_notStarted = 'You cannot pause a timer that is not started.';
        this.message_alreadyStopped = 'The timer is already in initial state.';
        this.message_noBreakTime = 'Is there a point in using this timer with 0 break time? :)';
    }

    addLabel(type) {
        document.querySelector(`.settings__${type} .label`).innerText = `${type.charAt(0).toUpperCase() + type.slice(1)} time`;
    }

    addButtonFunctions(element) {
        this.addButtonClick(element, 'increase', 1);
        this.addButtonClick(element, 'increase', 10);
        this.addButtonClick(element, 'decrease', -1);
        this.addButtonClick(element, 'decrease', -10);
    }

    addButtonClick(element, type, changeValue) {
        let elementClass = element.classList[0];
        document.querySelector(`.${elementClass} .${type}-${Math.abs(changeValue)}`)
            .addEventListener('click', () => {
            if (((this.trueSessionTime === this.maximumTime && elementClass === this.sessionClass) ||
                (this.trueBreakTime === this.maximumTime && elementClass === this.breakClass)) && type === 'increase') {
                this.alert(this.message_maxTime);

            } else if (((this.trueSessionTime === 0 && elementClass === this.sessionClass) ||
                (this.trueBreakTime === 0 && elementClass === this.breakClass)) && type === 'decrease') {
                this.alert(this.message_moreThanZero);
            }

            if (elementClass === this.sessionClass) {
                this.updateValue(this._session, changeValue, true);
                this.renderValues(this._session);
                this.getInputValue(this._session);
            } else if (elementClass === this.breakClass) {
                this.updateValue(this._break, changeValue, true);
                this.renderValues(this._break);
                this.getInputValue(this._break);
            } else {
                this.error('No buttons found to add EventListener.')
            }
        });
    }

    addOnClick(element) {
        let elementClass = element.classList[2];

        element.addEventListener('click', () => {
            if (elementClass === 'controls-start') {
                if (this.state === 0) {
                    this.updateTimes(this._session, true);
                }
                if (this.state !== 1) {
                    if (this.trueTime === 0) {
                        this.alert(this.message_noZero);
                        this.error('Cannot start a timer for 0 minutes.');
                    } else {
                        this.showActionIcon('start');
                        this.prestart();
                        this.start();
                    }
                }

            } else if (elementClass === 'controls-pause') {
                if (this.state === 1) {
                    this.showActionIcon('pause');
                    this.pause();
                } else if (this.state === 0) {
                    this.alert(this.message_notStarted);
                    this.error('Cannot pause a timer that is not started.');
                }

            } else if (elementClass === 'controls-reset') {
                if (this.state === 0) {
                    this.alert(this.message_alreadyStopped);
                    this.error('Cannot reset a timer that is not started.');
                } else {
                    this.showActionIcon('reset');
                    this.stop(true);
                }
            } else if ((elementClass === `controls-${this._session}`) || (elementClass === `controls-${this._break}`)) {
                this.finished(true);
            } else {
                this.error('Unknown controls.');
            }
        });
    }

    setContainer(type, value) {
        if (value % 1 !== 0) {
            value = value.toFixed(2);
        }
        if (type === this._session) {
            this.sessionValueContainer.innerText = value;
        } else if (type === this._break) {
            this.breakValueContainer.innerText = value;
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

            if (this.initialSessionTime !== 0) {
                localStorage.setItem('sessionTime', this.initialSessionTime);
            }
        } else if (type === this._break) {
            this.trueBreakTime = this.breakValue * 60;
            this.initialBreakTime = this.trueBreakTime;

            if (trueTimes) {
                this.trueTime = this.trueBreakTime;
                this.initialTime = this.initialBreakTime;
            }

            if (this.initialBreakTime !== 0) {
                localStorage.setItem('breakTime', this.initialBreakTime);
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
            this.error('Undefined value container.');
        }
    }

    start() {
        this.buttonStart.classList.add('active');
        this.buttonStart.innerText = 'Started';
        this.disableButton('start');
        this.state = 1;

        this.hideActionPauseIcon();

        this.timerInterval = setInterval(() => {
            this.trueTime--;
            if (this.trueTime <= 0) {
                this.finished(true);
            } else {
                this.renderClock();
            }
        }, this.timeDebugging);
    }

    prestart() {
        this.trueTime--;
        this.renderClock();
    }

    pause() {
        this.buttonPause.classList.add('active');
        this.buttonPause.innerText = 'Paused';
        this.disableButton('pause');
        this.state = 2;
        clearInterval(this.timerInterval);
    }

    stop(manual = false) {
        this.trueTime = this.value * 60;
        this.disableButton('reset');
        this.state = 0;

        this.hideActionPauseIcon();

        clearInterval(this.timerInterval);
        this.renderClock(manual);
    }

    finished(manual = false) {
        this.state = 0;

        this.hideActionPauseIcon();

        clearInterval(this.timerInterval);
        this.switch(false, manual);
        this.renderClock(manual);
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

    changeColors(type) {
        let toRemove;
        if (type === this._session) {
            toRemove = this._break;
        } else {
            toRemove = this._session;
        }

        this.switchButtons( type === this._session);
        [...document.getElementsByClassName(toRemove)]
            .map(button => button.classList.remove(toRemove));
    }

    switch(initial = false, manual = false) {
        let className;
        if (!initial &&
            ((this.initialSessionTime !== 0 && this.initialBreakTime !== 0) ||
                (this.initialSessionTime === 0 && !this.sessionIsActive) ||
                (this.initialBreakTime === 0 && !this.sessionIsActive)
            )) {
            this.sessionIsActive = !this.sessionIsActive;
        }

        if (this.initialSessionTime === 0) {
            this.value = this.sessionValue;
            className = this._session;

            this.changeColors(this._session);

            this.stop(manual);
            this.alert(this.message_noZero);
            this.error('Cannot start a timer for 0 minutes.');
        }
        else if (this.initialBreakTime === 0) {
            this.value = this.sessionValue;
            className = this._session;

            this.changeColors(this._session);

            this.stop(manual);
            this.alert(this.message_noBreakTime);
        } else {
            if (this.sessionIsActive) {
                if (typeof this.value !== 'undefined') {
                    this.breakValue = this.value;
                }
                this.value = this.sessionValue;
                className = this._session;

                this.changeColors(this._session);
            } else {
                if (typeof this.value !== 'undefined') {
                    this.sessionValue = this.value;
                }
                this.value = this.breakValue;
                className = this._break;

                this.changeColors(this._break);
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

    renderClock(manual = false) {
        this.minutes = this.trueTime < 0 ? 0 : Math.floor(this.trueTime / 60);
        this.seconds = this.trueTime < 0 ? 0 : this.trueTime % 60;


        if (this.seconds < 10) {
            this.seconds = '0' + this.seconds;
        }

        this.displayedTime.innerText = this.minutes + ':' + this.seconds;
        this.renderCircle(manual);
    }

    renderCircle(manual = false) {
        let progress, step;

        if (manual) {
            this.toggleAnimations('manual off');
        }

        if (this.initialTime !== 0) {
            step = this.initialTime - this.trueTime;
            progress = step / (this.initialTime - 1) * 360;
        } else {
            progress = 0;
        }

        if (this.animatedClock) {
            if (step === (this.initialTime / 2)) {
                this.circleLeft.classList.add('animate-middle-left');
                this.circleRight.classList.add('animate-middle-right');
            } else if (step === (this.initialTime / 2) + 1) {
                this.circleLeft.classList.remove('animate-middle-left');
                this.circleRight.classList.remove('animate-middle-right');
            }
        }

        if (progress === 360) {
            this.circleLeft.setAttribute('style', `transform: rotate(-180deg)`);
            this.circleRight.setAttribute('style', `transform: rotate(-180deg)`);
        } else if (progress < 180) {
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

    error(message) {
        console.log('ERROR:', message);
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
            this.error('Unknown button.');
        }
    }
    updateValue(valueType, changeValue, manual = false) {
        changeValue *= 60;

        if ((valueType === this._session && this.sessionIsActive) || (valueType === this._break && !this.sessionIsActive)) {
            if (this.initialTime < -changeValue) {
                this.trueTime = 0;
                this.initialTime = 0;

            } else if (this.initialTime + changeValue > this.maximumTime) {
                this.trueTime += this.maximumTime - this.initialTime;
                this.initialTime = this.maximumTime;

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

                } else if (this.trueSessionTime + changeValue > this.maximumTime) {
                    this.trueSessionTime = this.maximumTime;
                    this.initialSessionTime = this.maximumTime;

                } else {
                    this.trueSessionTime += changeValue;
                    this.initialSessionTime += changeValue;
                }
                this.sessionValue = Math.floor(this.initialSessionTime / 60);
            } else if (valueType === this._break) {
                if (this.trueBreakTime < -changeValue) {
                    this.trueBreakTime = 0;
                    this.initialBreakTime = 0;

                } else if (this.trueBreakTime + changeValue > this.maximumTime) {
                    this.trueBreakTime = this.maximumTime;
                    this.initialBreakTime = this.maximumTime;

                } else {
                    this.trueBreakTime += changeValue;
                    this.initialBreakTime += changeValue;
                }
                this.breakValue = Math.floor(this.initialBreakTime / 60);
            }
        }

        if ((valueType === this._session && this.sessionIsActive) || (valueType === this._break && !this.sessionIsActive)) {
            this.renderClock(manual);
        }
    }

    showActionIcon(type) {
        let actionContainer = document.getElementsByClassName(`action-${type}`)[0];
        if (type !== 'pause') {
            actionContainer.classList.remove('hidden');

            setTimeout(() => {
                actionContainer.classList.add('hidden');
            }, 400);
        } else {
            actionContainer.classList.remove('hidden');
            actionContainer.classList.add('paused');
        }
    }

    hideActionPauseIcon() {
        let actionContainer = document.getElementsByClassName(`action-pause`)[0];
        actionContainer.classList.add('hidden');
        actionContainer.classList.remove('paused');
    }

    addContainersClick() {
        this.sessionContainerAsInput = false;
        this.breakContainerAsInput = false;

        this.sessionValueContainer.addEventListener('click', event => {
            this.toInput(event.target);
        });
        this.breakValueContainer.addEventListener('click', event => {
            this.toInput(event.target);
        });

        document.getElementsByClassName(`${this._session}-value-submit`)[0].addEventListener('click', event => {
            this.toInput(event.target);
        });
        document.getElementsByClassName(`${this._break}-value-submit`)[0].addEventListener('click', event => {
            this.toInput(event.target);
        });

        document.getElementsByClassName(`${this._session}-value-input`)[0].onkeypress = event => {
            if (event.key === 'Enter') {
                this.toInput(event.target);
            }
        };
        document.getElementsByClassName(`${this._break}-value-input`)[0].onkeypress = event => {
            if (event.key === 'Enter') {
                this.toInput(event.target);
            }
        };
    }

    toggleInput(type, container, containerAsInput) {
        let inputContainer = document.querySelector(`.settings__${type} .input-container`);

        let input = document.querySelector(`.${type}-value-input`);
        input.focus();
        input.select();

        if (containerAsInput) {
            inputContainer.classList.remove('hidden');
            container.classList.add('hidden');
        } else {
            inputContainer.classList.add('hidden');
            container.classList.remove('hidden');
        }
    }

    getInputValue(type) {
        let input = document.querySelector(`.${type}-value-input`);

        if (type === this._session) {
            input.value = this.sessionValueContainer.innerText;
        } else {
            input.value = this.breakValueContainer.innerText;
        }
    }

    setInputValue(type) {
        let input = document.querySelector(`.${type}-value-input`);
        let changeValue;

        if (type === this._session) {
            changeValue = parseInt(input.value) - this.sessionValueContainer.innerText;
        } else {
            changeValue = parseInt(input.value) - this.breakValueContainer.innerText;
        }

        if (changeValue > this.maximumTime) {
            changeValue = this.maximumTime;
        }
        this.updateValue(type, changeValue, true);
        this.renderValues(type);
    }

    toInput(container) {
        let type = container.classList[0].split('-')[0];

        if (type === this._session) {
            this.sessionContainerAsInput = !this.sessionContainerAsInput;

            if (this.sessionContainerAsInput) {
                this.getInputValue(type);
                this.toggleInput(type, this.sessionValueContainer, this.sessionContainerAsInput);
            } else {
                this.setInputValue(type);
                this.toggleInput(type, this.sessionValueContainer, this.sessionContainerAsInput);
                this.alert(`${type.charAt(0).toUpperCase() + type.slice(1)} time set.`);
            }

        } else if (type === this._break) {
            this.breakContainerAsInput = !this.breakContainerAsInput;

            if (this.breakContainerAsInput) {
                this.getInputValue(type);
                this.toggleInput(type, this.breakValueContainer, this.breakContainerAsInput);

            } else {
                this.setInputValue(type);
                this.toggleInput(type, this.breakValueContainer, this.breakContainerAsInput);
                this.alert(`${type.charAt(0).toUpperCase() + type.slice(1)} time set.`);
            }
        }
    }

    setToggleAnimations() {
        this.toggleAnimationsButton = document.getElementsByClassName('animations-toggle')[0];

        this.toggleAnimationsButton.addEventListener('click', () => {
            this.toggleAnimations();
        });

        this.toggleAnimations('initial');
    }

    toggleAnimations(mode = 'normal') {
        if (mode === 'initial') {
            this.circleLeft.classList.add('animate');
            this.circleRight.classList.add('animate');
            this.toggleAnimationsButton.innerText = 'Hide animations';

            this.animatedClock = true;
        } else if (mode === 'manual off') {
            this.circleLeft.classList.add('reset');
            this.circleRight.classList.add('reset');
            setTimeout(() => {
                this.circleLeft.classList.remove('reset');
                this.circleRight.classList.remove('reset');
            }, 10);
        } else {
            if (this.animatedClock) {
                this.circleLeft.classList.remove('animate');
                this.circleRight.classList.remove('animate');
                this.toggleAnimationsButton.innerText = 'Show animations';
            } else {
                this.circleLeft.classList.add('animate');
                this.circleRight.classList.add('animate');
                this.toggleAnimationsButton.innerText = 'Hide animations';
            }

            this.animatedClock  = !this.animatedClock;
        }
    }
}

(function () {
    let app = new App;
    app.init();
})();
