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

        // console.log(settings.sessionValue);
    });

}

begin();
