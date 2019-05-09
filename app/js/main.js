function begin() {
    let controls = new Controls;
    let settings = new Settings;
    let timer = new Timer;

    window.addEventListener('DOMContentLoaded', () => {
        controls.init();
        settings.init();
        timer.init();

        timer.sessionValue = settings.sessionValue;
        timer.breakValue = settings.breakValue;

        controls.buttonStart.addEventListener('click', () => {
            if (controls.state !== 1) {
                timer.start();
                controls.disableButton('start');
            }
        });

        controls.buttonPause.addEventListener('click', () => {
            if (controls.state === 2) {
                timer.pause();
                controls.state = 2;

            } else if (controls.state === 1) {
                timer.start();

            } else if (controls.state === 0) {
                console.log('ERROR: Cannot pause a timer that is not started.')
            }

            if (controls.state === 2) {
                controls.disableButton('pause');
            }
        });
    });



}

begin();
