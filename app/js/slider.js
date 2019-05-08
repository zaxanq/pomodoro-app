
class Slider {
    init() {
        this.taskSlider = document.getElementById('task-slider');
        this.breakSlider = document.getElementById('break-slider');

        this.taskSliderValueContainer = document.getElementsByClassName('task-slider-value')[0];
        this.breakSliderValueContainer = document.getElementsByClassName('break-slider-value')[0];

        this.renderValues('both');

        this.taskSlider.addEventListener('change', () => {
            this.renderValues('task');
        });

        this.breakSlider.addEventListener('change', () => {
            this.renderValues('break');
        });
    }

    renderValues(type) {
        if (type === 'both') {
            this.taskSliderValueContainer.innerText = this.taskSlider.value;
            this.breakSliderValueContainer.innerText = this.breakSlider.value;
        } else  if (type === 'task') {
            this.taskSliderValueContainer.innerText = this.taskSlider.value;
        } else if (type === 'break') {
            this.breakSliderValueContainer.innerText = this.breakSlider.value;
        } else {
            console.log('ERROR: Undefined value to render.');
        }
    }

    toInput() {
        //TODO: add method changing value into input on click
    }
}

function begin() {
    let slider = new Slider;

    window.addEventListener('DOMContentLoaded', () => {
        slider.init();
    });
}

begin();