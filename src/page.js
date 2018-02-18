import Caculator from './calculator';	// import example calculator

function show() {
	const c = new Caculator();

	const newDiv = document.createElement('h1');
	const br = document.createElement('br');

	const add = document.createTextNode(`4 + 2 = ${c.add(4, 2)}`);
	const sub = document.createTextNode(`4 - 2 = ${c.sub(4, 2)}`);

	newDiv.appendChild(add);
	newDiv.appendChild(br);
	newDiv.appendChild(sub);

	document.body.appendChild(newDiv);
}

show();

export default show;
