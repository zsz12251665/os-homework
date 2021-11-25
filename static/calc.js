class Display {
	static MAX_DISPLAY_LENGTH = 14;
	static normalize(v) {
		if (typeof v === 'string')
			v = `0${v}`.replace(/^0*(\d+)/, '$1');
		if (!Number.isFinite(Number(v)))
			return 'Invalid Input';
		v = String(v);
		if (!v.includes('e') && (v[0] !== '-') + v.length + (!v.includes('.')) <= Display.MAX_DISPLAY_LENGTH)
			return v + (v.includes('.') ? '' : '.');
		if (Math.abs(v) < 10 ** (Display.MAX_DISPLAY_LENGTH - 2)) {
			v = Number(v).toPrecision(Display.MAX_DISPLAY_LENGTH - 2);
			return v + (v.includes('.') ? '' : '.');
		} else
			return 'Limit Exceeded';
	}
	constructor(displayElement) {
		this.displayElement = displayElement;
	}
	get text() { return this.displayElement.innerText; }
	set text(v) { this.displayElement.innerText = Display.normalize(v); }
	extendable() { return !this.text.includes(' ') && (this.text[0] !== '-') + this.text.length < Display.MAX_DISPLAY_LENGTH; }
}

class Calculator {
	static unaryOperators = {
		abs: (entry) => Math.abs(entry),
		sign: (entry) => -entry,
		log: (entry) => Math.log10(entry),
		square: (entry) => entry * entry,
		frac: (entry) => 1.0 / entry
	};
	static binaryOperators = {
		plus: (memory, entry) => memory + entry,
		minus: (memory, entry) => memory - entry,
		times: (memory, entry) => memory * entry,
		divide: (memory, entry) => memory / entry,
		power: (memory, entry) => memory ** entry,
		equal: (memory, entry) => entry
	};
	static numeric = {
		zero: '0',
		one: '1',
		two: '2',
		three: '3',
		four: '4',
		five: '5',
		six: '6',
		seven: '7',
		eight: '8',
		nine: '9',
		dot: '.'
	};
	static keyToButtonMap = {
		'0': 'zero',
		'1': 'one',
		'2': 'two',
		'3': 'three',
		'4': 'four',
		'5': 'five',
		'6': 'six',
		'7': 'seven',
		'8': 'eight',
		'9': 'nine',
		'.': 'dot',
		'+': 'plus',
		'-': 'minus',
		'*': 'times',
		'/': 'divide',
		'^': 'power',
		'=': 'equal',
		'Enter': 'equal',
		'|': 'abs',
		'a': 'abs',
		'A': 'abs',
		'n': 'sign',
		'N': 'sign',
		'l': 'log',
		'L': 'log',
		'Escape': 'clear',
		'Delete': 'backspace',
		'Backspace': 'backspace'
	};
	memory = 0;
	input = '';
	op = 'equal';
	constructor(displayElement) {
		this.display = new Display(displayElement);
	}
	get entry() { return Number(this.display.text); }
	set entry(v) { this.display.text = v; }
	sequelize() {
		const opToKeyMap = {
			plus: '+',
			minus: '-',
			times: '*',
			divide: '/',
			power: '^',
			equal: '='
		};
		if (this.input === '' && this.memory !== this.entry)
			return `${this.memory}${opToKeyMap[this.op]}${Math.abs(this.entry)}${this.entry < 0 ? 'n' : 'a'}`;
		else
			return `${this.memory}${opToKeyMap[this.op]}${this.input}`;
	}
	click(id) {
		if (id === 'clear') {
			if (this.input === '') {
				this.memory = 0;
				this.op = 'equal';
			}
			this.input = '';
			this.entry = Number(this.input);
		}
		if (Number.isNaN(this.entry))
			return;
		if (Object.keys(Calculator.unaryOperators).includes(id)) {
			this.entry = Calculator.unaryOperators[id](this.entry);
			this.input = '';
		}
		if (Object.keys(Calculator.binaryOperators).includes(id)) {
			this.entry = Calculator.binaryOperators[this.op](this.memory, this.entry);
			this.memory = this.entry;
			this.input = '';
			this.op = id;
		}
		if (Object.keys(Calculator.numeric).includes(id)) {
			if (this.input === '' || this.display.extendable())
				this.input += Calculator.numeric[id];
			this.display.text = this.input;
		}
		if (id === 'backspace') {
			this.input = this.input.slice(0, -1);
			this.entry = Number(this.input);
		}
		if (id === 'import') {
			if (window.$openFile)
				window.$openFile()
					.then((text) => {
						if (text !== null) {
							this.click('clear');
							text.split('').forEach((ch) => this.press(ch));
						}
					})
					.catch((err) => { alert(err.message); });
		}
		if (id === 'export') {
			if (window.$saveFile)
				window.$saveFile(this.sequelize())
					.catch((err) => { alert(err.message); });
		}
	}
	press(key) {
		if (Object.keys(Calculator.keyToButtonMap).includes(key))
		this.click(Calculator.keyToButtonMap[key]);
	}
}

var calc = new Calculator(document.querySelector('div#display'));
for (const button of document.querySelectorAll('button'))
	button.addEventListener('click', (e) => { calc.click(e.currentTarget.id); e.currentTarget.blur(); });
document.addEventListener('keyup', (e) => { e.preventDefault(); calc.press(e.key); });
