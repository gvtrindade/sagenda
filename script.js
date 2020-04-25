//Inserir dados da base em um array
const editJsonFile = require("edit-json-file");
let arquivo = editJsonFile("./data.json");
let objContatos = arquivo.data;
let arrayDados = Object.entries(objContatos);
let contatosNaoFiltrados = [];

for (k = 0; k < arrayDados.length; k++) {
    contatosNaoFiltrados.push(arrayDados[k][1]);
}

function ordemAlfabetica(a, b) {

    const removerCaracteresEspeciais = (palavra) => {
        return palavra.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/([^\w]+|\s+)/g, '-') // Substitui espaço e outros caracteres por hífen
            .replace(/\-\-+/g, '-') // Substitui multiplos hífens por um único hífen
            .replace(/(^-+|-+$)/, '');
    }

    const nomeA = removerCaracteresEspeciais(a.nome.toUpperCase());
    const nomeB = removerCaracteresEspeciais(b.nome.toUpperCase());

    let comparativo = 0;
    if (nomeA > nomeB) {
        comparativo = 1;
    } else if (nomeA < nomeB) {
        comparativo = -1;
    };

    return comparativo;
}

let contatos = contatosNaoFiltrados.sort(ordemAlfabetica);

window.onload = function() {
    limparModalAdd();
    mostrarContatos();
    window.addEventListener("focus", selecionarPesquisa);
};

function selecionarPesquisa() {
    if (mostrandoModal === false) {
        caixaPesquisa.select();
    }
}

//Variaveis utilizadas
const listaContatos = document.getElementById("listaContatos");
const modais = document.getElementsByClassName("modal");
const caixaPesquisa = document.getElementById("caixaPesquisa");
const nomeContato = document.getElementById("nomeContato");
const telefoneContato = document.getElementById("telefoneContato");
const emailContato = document.getElementById("emailContato");
const categoriaContato = document.getElementById("categoriaContato");
let mostrandoModal = false;

//Limpar modal de adicionar
function limparModalAdd() {
    caixaPesquisa.value = "";
    nomeContato.value = "";
    telefoneContato.value = "";
    emailContato.value = "";
    categoriaContato.value = "";
}

//Mostrar lista de contatos
function mostrarContatos() {
    listaContatos.innerHTML = "";

    for (let i = 0; i < contatos.length; i++) {
        let contato = document.createElement("li");

        contato.className = "contato";
        contato.id = contatos[i].nome;
        contato.onclick = mostrarModal;
        listaContatos.appendChild(contato);

        let data = ["nome", "telefone", "email"];
        for (let l = 0; l < data.length; l++) {
            let info = document.createElement("li");
            info.innerText = contatos[i][data[l]];
            info.className = "data";
            contato.appendChild(info);
        }
    }
}

//Modal com informações
const modalInformacoes = document.getElementById("modalInformacoes");

function mostrarModal(event) {
    mostrandoModal = true;
    let id;
    const listaModal = document.getElementById("listaModal");
    const infoContato = document.createElement("div");
    infoContato.id = "infoContato";
    listaModal.appendChild(infoContato);

    if (event.target.className === "data") {
        id = event.target.parentNode.id;
    } else {
        id = event.target.id;
    }

    let contato = contatos.find((element) => element.nome === id);

    for (let [key, value] of Object.entries(contato)) {
        let info;
        let hr = document.createElement("hr");

        if (`${key}` !== "nome") {
            info = document.createElement("p");
            let data = `${key}`.charAt(0).toUpperCase() + `${key}`.slice(1);
            info.innerText = data + `: ${value}`;
            infoContato.appendChild(info);
        } else {
            info = document.createElement("h1");
            info.innerText = `${value}`;
            listaModal.insertBefore(hr, listaModal.childNodes[0]);
            listaModal.insertBefore(info, listaModal.childNodes[0]);
        }

        info.className = "data";
    }

    modalInformacoes.style.display = "block";
}

//Modal para adicionar contato
const modalAdicionar = document.getElementById("modalAdicionar");
const infoContato = document.getElementById("infoContato");

function mostrarModalAdd() {
    mostrandoModal = true;
    modalAdicionar.style.display = "block";
}

function fecharModal(event) {
    if (event.target.parentNode.parentNode.id == "conteudoModalAdd") {
        mostrandoModal = false;
        modalAdicionar.style.display = "none";
    } else if (event.target.parentNode.parentNode.id == "conteudoModalInfo") {
        mostrandoModal = false;
        modalInformacoes.style.display = "none";
        listaModal.innerHTML = "";
    }
}

//Adicionar contato
function Contato(nome, telefone, email, categoria) {
    this.nome = nome;
    this.telefone = telefone;
    this.email = email;
    this.categoria = categoria;
}

function salvarContato() {
    if (msgErroCadastrar() === true) {
        alert("Existem campos vazios!");
        return;
    }

    let contato = new Contato(
        nomeContato.value,
        telefoneContato.value,
        emailContato.value,
        categoriaContato.value
    );

    let nomeObjContato = nomeContato.value;

    contatos.push(contato);
    contatos.sort(ordemAlfabetica);
    arquivo.set(nomeObjContato, contato);
    arquivo.save();

    limparModalAdd();
    mostrarContatos();
    modalAdicionar.style.display = "none";
}

//Deletar contato
const botaoDeletarModal = document.getElementById("botaoDeletarModal");
let contadorCliques = false;

function deletarContato(event) {
    const conteudoModalInfo = event.target.parentNode.parentNode;
    const indexNome = conteudoModalInfo.children.length - 1;
    const listaModal = conteudoModalInfo.children[indexNome];
    let nomeContatoDeletado = listaModal.firstChild.innerText;
    let indexContatoDeletado;

    if (contadorCliques === false) {
        botaoDeletarModal.style.backgroundColor = "red";
        contadorCliques = true;
    } else if (contadorCliques === true) {
        contatos.forEach((contato, index) => {
            if (contato.nome === nomeContatoDeletado) {
                indexContatoDeletado = index;
            }
        });

        contatos.splice(indexContatoDeletado, 1);

        arquivo.unset(nomeContatoDeletado);
        arquivo.save();

        mostrarContatos();
        fecharModal(event);

        botaoDeletarModal.style.backgroundColor = "transparent";
        contadorCliques = false;
    }
}

function resetarEstado() {
    botaoDeletarModal.style.backgroundColor = "transparent";
    contadorCliques = false;
}

//Mensagem de erro no cadatro de contato
const conteudoModalAdd = [nomeContato, telefoneContato, categoriaContato];

function msgErroCadastrar() {
    let resposta = new Boolean(false);
    conteudoModalAdd.forEach((element) => {
        if (element.value === "") {
            resposta = true;
        }
    });
    if (resposta === true) {
        return true;
    }
}

//Função de pesquisa
function pesquisar() {
    let input, filter, content, Class;
    input = document.getElementById("caixaPesquisa");
    filter = input.value.toUpperCase();

    content = document.getElementById("listaContatos");
    const contatosHTML = content.getElementsByClassName("contato");

    Array.from(contatosHTML).forEach(
        (contatoHTML) => (contatoHTML.style.display = "none")
    );

    contatos.forEach((contato, index) => {
        let chavesEValores = Object.entries(contato);
        chavesEValores.forEach((chaveEValor) => {
            if (chaveEValor[0] === "categoria") {
                return;
            }
            let valor = chaveEValor[1];
            if (valor.toUpperCase().indexOf(filter) > -1) {
                contatosHTML[index].style.display = "";
            }
        });
    });
}

window.onclick = function(event) {
    if (event.target == modalAdicionar) {
        mostrandoModal = false;
        modalAdicionar.style.display = "none";
    } else if (event.target == modalInformacoes) {
        mostrandoModal = false;
        modalInformacoes.style.display = "none";
        listaModal.innerHTML = "";
    }
};