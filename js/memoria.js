//Imagens das cartas
let imagens = [
	{img: './img/feijao.png', nome:'Feijão', detalhes: 'O feijão proporciona nutrientes essenciais como proteínas, ferro, cálcio, vitaminas, carboidratos e fibras. Unidade de medida apropriada: kg'},
	{img: './img/abobora.png', nome: 'Abóbora', detalhes: 'Abóbora é rica em vitaminas A e C, antioxidantes e fibras. Unidade de medida usada: kg.'},
	{img: './img/batata.png', nome: 'Batata doce', detalhes: 'A batata doce é rica em fibras, vitaminas do complexo B, vitamina A, vitamina C e minerais. Unidade de medida usada: kg.'},
	{img: './img/cenoura.png', nome: 'Cenoura', detalhes: 'A cenoura é um vegetal de raiz rico em vitaminas e minerais, todos com inúmeros benefícios para a saúde. Unidade de medida usada: kg.'},
	{img: './img/mandioca.png', nome: 'Mandioca', detalhes: 'A mandioca também conhecida como aipim ou macaxeira, cozida contém cálcio, magnésio, fósforo, potássio e vitamina C.'},
	{img: './img/arroz.png', nome: 'Arroz', detalhes: 'O arroz é rica fonte de minerais como ferro e potássio. 	Contém proteínas, vitamina E e vitaminas do complexo B.	Unidade de medida usada: kg.'},
	{img: './img/tapioca.png', nome: 'Tapioca', detalhes: 'A tapioca ou goma é a fécula extraída da mandioca, ela é rica em vitaminas e sais minerais. Unidade de medida usada: kg.'},
	{img: './img/inhame.png', nome: 'Inhame', detalhes: 'O inhame apresenta diversos benefícios para a saúde por ser rico em fibras, proteínas, vitamina C e vitaminas do complexo B.'}
];

/*for(let i=1; i<=8; i++){
	imagens.push(`https://picsum.photos/id/${i}/80`);
}*/
//let fundo = 'https://picsum.photos/80/80?grayscale';
let fundo = './img/lina_logo_novo.png';

// Estado do jogo
let cartas = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8];
let cliquesTravados = false;
let temCartaVirada = false;
let posicaoCartaVirada = -1;
let valorCartaVirada = 0;
let pontos = 0;
let ultimosTempos = [];
const timerDoJogo = new Timer('#timer');
let temSom = true;

onload = () => {
	//Carrega as imagens de fundo
	let elemImagens = document.querySelectorAll('#memoria img');
	elemImagens.forEach(
		(img, i) => {
			img.src = fundo; 
			img.setAttribute('data-valor', i);
			img.style.opacity = 0.4;
		}
	);

	//Carrega o evento do nbotão de início
	document.querySelector('#btInicio').onclick = iniciaJogo;
	// Atribui o valor do áudio
	document.querySelector('#customSwitch1').checked = temSom;
}

//-----------------------------------------
// Inicia o jogo
//-----------------------------------------

const iniciaJogo = () => {

	//Embaralhar as cartas
	for(let i=0; i<cartas.length; i++){
		let p = Math.trunc(Math.random() * cartas.length);
		let aux = cartas[p];
		cartas[p] = cartas[i];
		cartas[i] = aux;
	}
	// associaor evento às imagens
	let elemImagens = document.querySelectorAll('#memoria img');
	elemImagens.forEach((img, i) => {
		img.onclick = trataCliqueImagem;
		img.style.opacity = 1;
		img.src = fundo;
	});
	// Reinicia o estado do jogo
	cliquesTravados = false;
	temCartaVirada = false;
	posicaoCartaVirada = -1;
	valorCartaVirada = 0;
	pontos = 0;

	// ajusta a interface
	document.querySelector('#btInicio').disabled = true;
	document.querySelector('#timer').style.backgroundColor = 'orange';
	timerDoJogo.start();
}
//----------------------------------------
// Novo objeto SpeechSynthesisUtterance
//----------------------------------------
let utter = new SpeechSynthesisUtterance();
utter.lang = 'pt-BR';

//-----------------------------------------
// Processa o click na imagem
//-----------------------------------------
const trataCliqueImagem = (e) => {
	if(cliquesTravados) return;
	const p = e.target.getAttribute('data-valor');
	const valor = cartas[p];
	e.target.src = imagens[valor - 1].img;
	
	
	e.target.onclick = null;

	if(!temCartaVirada){
		temCartaVirada = true;
		posicaoCartaVirada = p;
		valorCartaVirada = valor;
		//Fala nome da imagem
		if (temSom){
			utter.text = imagens[valor-1].nome;
			window.speechSynthesis.speak(utter);
		}
	} else {
		if(valor == valorCartaVirada){
			pontos++;
			//Fala detalhes da imagem
			/*utter.text = imagens[valor-1].detalhes;
			window.speechSynthesis.speak(utter);*/
		} else {
			const p0 = posicaoCartaVirada;
			cliquesTravados = true;
			if (temSom){
				utter.text = imagens[valor-1].nome;
				window.speechSynthesis.speak(utter);
			}
			setTimeout(() => {
				e.target.src = fundo;
				e.target.onclick = trataCliqueImagem;
				let img = document.querySelector('#memoria #i'+p0);
				img.src = fundo;
				img.onclick = trataCliqueImagem;
				cliquesTravados = false;
			}, 1500);
		}
		temCartaVirada = false;
		posicaoCartaVirada = -1;
		valorCartaVirada = 0;
	}
	
	if(pontos == 8){
		document.querySelector('#btInicio').disabled = false;
		document.querySelector('#timer').style.backgroundColor = 'lightgreen';
		timerDoJogo.stop();
	}
}

//-----------------------------------------
// Timer
//-----------------------------------------
function Timer(e){
	this.element = e;
	this.time = 0;
	this.control = null
	this.start = () => {
		this.time = 0;
		this.control = setInterval(() => {
			this.time++;
			//const minutes = Math.trunc(this.time/60);
			//const seconds = this.time % 60;
			document.querySelector(this.element).innerHTML = formatTime(this.time);
		}, 1000);
	};
	this.stop = () =>{

		//Exibe os detalhes das imagens

		detalhe = '';
		imagens.forEach(i => {
			detalhe += `<li class="media">
			<img class="mr-3" src=${i.img} alt=${i.nome}>
			<div class="media-body">
			  <h5 class="mt-0 mb-1">${i.nome}</h5>
			  ${i.detalhes}
			</div>
		  </li>`;
	   	});
		document.querySelector('#detalhes').innerHTML = detalhe;

		ultimosTempos.push(formatTime(this.time));
		let tagComTempo = '';
		ultimosTempos.reverse().forEach(t => {
			 tagComTempo +=`<li class="list-group-item">${t}</li>`;
		});
		document.querySelector('#escores').innerHTML = tagComTempo;
		clearInterval(this.control);
		this.control = null
	};
}
function formatTime(tempo){
	const minutes = Math.trunc(tempo/60);
	const seconds = tempo % 60;
	
	return (minutes < 10 ? '0' :'') + 
	minutes + ':'
	+ (seconds < 10 ? '0' : '') +
	seconds;
}

//-------------------------------------------
// controla ádio do nome das imagens
//-------------------------------------------
function controlaSom(){
	let checkbox = document.querySelector('#customSwitch1');
	if(checkbox.checked){
		temSom = true;
	}else{
		temSom = false;
	}
}