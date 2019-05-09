class Controls {
    init() {
        this.state = 0;
        this.buttonStart = document.getElementsByClassName('controls-start')[0];
        this.buttonPause = document.getElementsByClassName('controls-pause')[0];
        this.buttonReset = document.getElementsByClassName('controls-reset')[0];

        this.addOnClick(this.buttonStart);
        this.addOnClick(this.buttonPause);
        this.addOnClick(this.buttonReset);
    }

    alert(message) {
        let alert = document.getElementsByClassName('alert')[0];

        alert.innerText = message;
        alert.classList.remove('hidden');

        setTimeout(() => {
            alert.classList.add('hidden');
        }, 2000);
    }

    addOnClick(element) {
        let elementClass = element.classList[2];
        element.addEventListener('click', () => {
            if (elementClass === 'controls-start') {
                this.buttonStart.classList.add('active');
                this.buttonPause.classList.remove('active');

                if (this.state !== 1) {
                    setTimeout(() => {
                        this.state = 1;
                    }, 0);
                    this.buttonStart.innerText = 'Started';
                }
            } else if (elementClass === 'controls-pause') {
                this.buttonStart.classList.remove('active');
                this.buttonPause.classList.add('active');

                if (this.state === 1) {
                    this.state = 2;
                    this.buttonPause.classList.add('active');
                    this.buttonPause.innerText = 'Paused';
                } else if (this.state === 0) {
                    this.alert('You cannot pause a timer that is not started.');
                } else {
                    this.buttonPause.classList.remove('paused');
                    this.buttonPause.innerText = 'Pause';
                }

            } else if (elementClass === 'controls-reset') {
                this.buttonStart.classList.remove('active');
                this.buttonPause.classList.remove('active');

                this.buttonPause.classList.remove('paused');
                this.buttonPause.innerText = 'Pause';
            }
        });
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
}
