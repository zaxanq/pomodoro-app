class Controls {
    init() {
        this.buttonStart = document.getElementsByClassName('controls-start')[0];
        this.buttonPause = document.getElementsByClassName('controls-pause')[0];
        this.buttonReset = document.getElementsByClassName('controls-reset')[0];

        this.addOnClick(this.buttonStart);
        this.addOnClick(this.buttonPause);
        this.addOnClick(this.buttonReset);
    }

    addOnClick(element) {
        let elementClass = element.classList[2];
        element.addEventListener('click', () => {
            if (elementClass === 'controls-start') {
                //TODO: Start timer

                this.buttonPause.classList.remove('paused');
                this.buttonPause.innerText = 'Pause';
            } else if (elementClass === 'controls-pause') {
                //TODO: Pause timer

                this.buttonPause.classList.add('paused');
                this.buttonPause.innerText = 'Paused';
            } else if (elementClass === 'controls-reset') {
                //TODO: Reset timer

                this.buttonPause.classList.remove('paused');
                this.buttonPause.innerText = 'Pause';
            } else {
                console.log('ERROR: Unknown controls.')
            }
        });
    }
}
