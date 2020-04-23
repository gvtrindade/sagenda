//Inserir dados da base em um array
const editJsonFile = require("edit-json-file");
let arquivo = editJsonFile("./data.json");
let objContatos = arquivo.data;
let arrayDados = Object.entries(objContatos);
let contatos = [];

for (k = 0; k < arrayDados.length; k++) {
    contatos.push(arrayDados[k][1]);
};


window.onload = function() {
    limparModalAdd();
    mostrarContatos();
};

function selecionarPesquisa() {

    if (modais[0].style.display === "" && modais[1].style.display === "") {
        caixaPesquisa.select();
    } else {
        return;
    };

};


//Variaveis utilizadas
const listaContatos = document.getElementById("listaContatos");
const modais = document.getElementsByClassName("modal");
const caixaPesquisa = document.getElementById("caixaPesquisa");
const nomeContato = document.getElementById("nomeContato");
const telefoneContato = document.getElementById("telefoneContato");
const emailContato = document.getElementById("emailContato");
const categoriaContato = document.getElementById("categoriaContato");


//Limpar modal de adicionar
function limparModalAdd() {
    caixaPesquisa.value = "";
    nomeContato.value = "";
    telefoneContato.value = "";
    emailContato.value = "";
    categoriaContato.value = "";
};

//Mostrar lista de contatos
function mostrarContatos() {

    listaContatos.innerHTML = "";

    for (let i = 0; i < contatos.length; i++) {

        let contato = document.createElement("li");

        contato.className = "contato";
        contato.id = contatos[i].nome;
        contato.onclick = mostrarModal;
        listaContatos.appendChild(contato);

        for (let l = 0; l < 2; l++) {
            let info = document.createElement("li");
            let data = ["nome", "telefone"]
            info.innerText = contatos[i][data[l]];
            info.className = "Data";
            contato.appendChild(info);
        };

    };

};

//Modal com informações
const modalInformacoes = document.getElementById("modalInformacoes")

function mostrarModal(event) {
    let id;
    const listaModal = document.getElementById("listaModal");

    if (event.target.className === "Data") {
        id = event.target.parentNode.id;
    } else {
        id = event.target.id;
    }

    let contato = contatos.find(element => element.nome === id);

    for (let [key, value] of Object.entries(contato)) {

        let info
        if (`${key}` === "nome") {
            info = document.createElement("h1");
            info.innerText = `${ value }`;
            info.style = "text-align: center"
        } else {
            info = document.createElement("li");
            let data = `${ key }`.charAt(0).toUpperCase() + `${ key }`.slice(1);
            info.innerText = data + `: ${ value }`;
        }
        info.className = "data";
        listaModal.appendChild(info);

    };

    modalInformacoes.style.display = "block";
};

//Modal para adicionar contato
const modalAdicionar = document.getElementById("modalAdicionar")
const listaModal = document.getElementById("listaModal")

function mostrarModalAdd() {
    modalAdicionar.style.display = "block";
};

function fecharModal(event) {
    let conteudoModal = event.target.parentNode;
    let modal = conteudoModal.parentNode.id;
    document.getElementById(modal).style.display = "none";
    if (modal === "modalInformacoes") {
        listaModal.innerHTML = "";
    };
};

window.onclick = function(event) {
    if (event.target == modalAdicionar) {
        modalAdicionar.style.display = "none";
    } else if (event.target == modalInformacoes) {
        modalInformacoes.style.display = "none";
        listaModal.innerHTML = "";
    };
};

//Adicionar contato
function Contato(nome, telefone, email, categoria) {
    this.nome = nome;
    this.telefone = telefone;
    this.email = email;
    this.categoria = categoria;
};

function salvarContato() {

    if (msgErroCadastrar() === true) {
        alert("Existem campos vazios!")
        return
    }

    let contato = new Contato(
        nomeContato.value,
        telefoneContato.value,
        emailContato.value,
        categoriaContato.value
    );

    let nomeObjContato = nomeContato.value;

    contatos.push(contato);
    arquivo.set(nomeObjContato, contato);
    arquivo.save();

    limparModalAdd();
    mostrarContatos();
    modalAdicionar.style.display = "none";

};

//Mensagem de erro no cadatro de contato
const conteudoModalAdd = [
    nomeContato,
    telefoneContato,
    categoriaContato
];

function msgErroCadastrar() {
    let resposta = new Boolean(false);
    conteudoModalAdd.forEach(element => {
        if (element.value === "") {
            resposta = true;
        }
    });
    if (resposta === true) { return true; };
};

//Função de pesquisa
function pesquisar() {

    let input, filter, content, Info, Class, txtValue;
    input = document.getElementById("caixaPesquisa");
    filter = input.value.toUpperCase();
    content = document.getElementById("listaContatos");
    Info = content.getElementsByClassName("contato");

    for (let j = 0; j < Info.length; j++) {

        for (let k = 0; k < Info[j].children.length - 1; k++) {

            Class = Info[j].getElementsByClassName("Data")[k];
            txtValue = Class.textContent || Class.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                Info[j].style.display = "";
                break;
            } else {
                Info[j].style.display = "none";
            };

        };

    };

};