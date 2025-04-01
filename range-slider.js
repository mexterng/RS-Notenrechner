/**
 * License: MIT
 * Credits: https://stackoverflow.com/a/44384948
 * Repo: https://github.com/swissup/range-slider
 */

class RangeSlider extends HTMLElement {
    connectedCallback() {
        setTimeout(() => this.addMarkup(), 0);
        this.addEventListener('touchstart', this.onMouseDown.bind(this), { passive: true });
        this.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.addEventListener('touchend', this.onMouseUp.bind(this));
        this.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.addEventListener('input', this.onInput.bind(this));
    }

    get value() {
        return [this.min.valueAsNumber, this.max.valueAsNumber].sort((a, b) => a - b);
    }

    set value(value) {
        this.min.value = Math.min(...value);
        this.max.value = Math.max(...value);
        this.minOutput.value = this.min.value;
        this.maxOutput.value = this.max.value;
    }

    addMarkup() {
        if (!this.querySelector(':nth-child(1)')) {
            this.insertAdjacentHTML('afterbegin', [
                '<input class="range" type="range"/>',
                '<input class="range" type="range"/>',
                '<input class="filler" disabled type="range"/>',
                '<div class="slider-numbers">',
                '<span>1</span>',
                '<span>2</span>',
                '<span>3</span>',
                '<span>4</span>',
                '<span>5</span>',
                '<span>6</span>',
                '</div>',
            ].join(''));
        }

        this.insertAdjacentHTML('beforeend', '<output></output><output></output>');

        this.initMinMaxElements();

        let mapping = {
            step: this.getAttribute('step') || 1,
            min: this.getAttribute('min') || 1,
            max: this.getAttribute('max') || 6
        };

        for (let [key, value] of Object.entries(mapping)) {
            this.min[key] = value;
            this.max[key] = value;
        };

        let params = new URLSearchParams(window.location.search);
        let name = this.getAttribute('name');
        if (params.has(name)) {
            let values = params.get(name).split('-').map(Number);
            this.value = values;
        } else {
            let value = (this.getAttribute('value') || '').split('-').filter((val) => val);
            if (value.length) {
                this.min.value = value[0];
                this.max.value = value[1] || this.max.max;
            } else {
                this.min.value = this.min.min;
                this.max.value = this.max.max;
            }
        }

        this.minOutput.value = this.min.value;
        this.maxOutput.value = this.max.value;
        let examenInput = document.getElementById("examen-1");
        if (params.has('examen-1')) {
            let examenValue = params.get('examen-1');
            examenInput.value = examenValue.replace(",", ".");
            formatDecimal(examenInput);
        } else {
            examenInput.value = "3.00";
        }
        document.dispatchEvent(new Event('update-averages'));
    }

    initMinMaxElements() {
        this.min = this.querySelector(':nth-child(1)');
        this.max = this.querySelector(':nth-child(2)');

        let name = this.getAttribute('name');

        if (name) {
            this.min.name = name + '[min]';
            this.max.name = name + '[max]';
        }

        [this.minOutput, this.maxOutput] = this.querySelectorAll('output');
    }

    /**
     * Allow to move min above max and vice versa
     */
    onMouseDown() {
        this.constraint = (this.max.valueAsNumber - this.min.valueAsNumber) > 0;
    }

    /**
     * If min thumb was moved above max (or vice versa) - swap them
     */
    onMouseUp() {
        if (this.constraint) {
            return;
        }

        this.constraint = true;

        if (this.min.valueAsNumber < this.max.valueAsNumber) {
            return;
        }

        this.insertBefore(this.max, this.min);
        this.insertBefore(this.maxOutput, this.minOutput);
        this.initMinMaxElements();
    }

    /**
     * Contstrain thumbs inside their min/max values
     */
    onInput(event) {
        if (this.constraint) {
            let el = event.target;

            if (el === this.min) {
                if (el.valueAsNumber > this.max.valueAsNumber) {
                    el.value = this.max.value;
                }
            } else if (el.valueAsNumber < this.min.valueAsNumber) {
                el.value = this.min.value;
            }
        }

        if (event.target === this.min) {
            this.minOutput.value = this.min.value;
        } else {
            this.maxOutput.value = this.max.value;
        }

        this.dispatchEvent(new Event('range:input', {
            bubbles: true
        }));

        let params = new URLSearchParams(window.location.search);
        let sliders = document.querySelectorAll('range-slider');
        sliders.forEach(slider => {
            let name = slider.getAttribute('name');
            params.set(name, `${slider.min.value}-${slider.max.value}`);
        });
        let input = document.getElementById("examen-1");
        let examen1 = input.value.replace(",", ".");
        params.delete('examen1')
        params.set('examen-1', examen1)
        window.history.replaceState({}, '', '?' + params.toString());

        document.dispatchEvent(new Event('update-averages'));
    }

    disconnectedCallback() {
        this.removeEventListener('touchstart', this.onMouseDown);
        this.removeEventListener('mousedown', this.onMouseDown);
        this.removeEventListener('touchend', this.onMouseUp);
        this.removeEventListener('mouseup', this.onMouseUp);
        this.removeEventListener('input', this.onInput);
    }
}

customElements.define('range-slider', RangeSlider);
