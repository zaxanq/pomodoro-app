class Settings {
    init() {
        this.initialSessionValue = 25;
        this.initialBreakValue = 5;
        this.sessionValue = this.initialSessionValue;
        this.breakValue = this.initialBreakValue;

        this.sessionClass = 'settings__session';
        this.session = document.getElementsByClassName(this.sessionClass)[0];
        this.breakClass = 'settings__break';
        this.break = document.getElementsByClassName(this.breakClass)[0];

        this.sessionValueContainer = document.getElementsByClassName('session-value')[0];
        this.breakValueContainer = document.getElementsByClassName('break-value')[0];

        this.displayedTime = document.getElementsByClassName('current-time')[0];

        this.renderValues('initial');

        this.addOnClick(this.session);
        this.addOnClick(this.break);
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
        this.displayedTime.innerText = displayedValue + ':00';

        return value;
    }

    addOnClick(element) {
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

    toInput() {
        //TODO: add method changing value into input on click
    }
}
