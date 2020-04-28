//Inserir dados da base em um array
const editJsonFile = require("edit-json-file");
let arquivoOriginal;
let arquivo = editJsonFile("./Assets/data.json");
let objContatos = arquivo.data;
let arrayDados = Object.entries(objContatos);
let contatosNaoFiltrados = [];

for (k = 0; k < arrayDados.length; k++) {
    contatosNaoFiltrados.push(arrayDados[k][1]);
}

// setInterval(
//     function() {
//         arquivoOriginal = editJsonFile("./Assets/data.json");
//         if (JSON.stringify(arquivo) == JSON.stringify(arquivoOriginal)) {
//             console.log("Diferença encontrada!")
//         } else {
//             console.log("Nenhuma diferença encontrada")
//         }
//     },
//     1000
// );

function teste() {
    arquivoOriginal = editJsonFile("./Assets/data.json");
    if (JSON.stringify(arquivo) == JSON.stringify(arquivoOriginal)) {
        console.log("Diferença encontrada!")
    } else {
        console.log("Nenhuma diferença encontrada")
    }
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
const campoSetor = document.getElementById("campoSetor");
let mostrandoModal = false;

//Limpar modal de adicionar
function limparModalAdd() {
    caixaPesquisa.value = "";
    nomeContato.value = "";
    telefoneContato.value = "";
    emailContato.value = "";
    categoriaContato.value = "";
    campoSetor.children[2].value = "";
}

//Mostrar lista de contatos
function mostrarContatos() {
    listaContatos.innerHTML = "";

    for (let i = 0; i < contatos.length; i++) {
        let contato = document.createElement("li");

        contato.className = "contato";
        contato.id = contatos[i].nome;
        contato.onclick = mostrarModalInfo;
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

function mostrarModalInfo(event) {
    mostrandoModal = true;
    let id;
    const listaModal = document.getElementById("listaModal");
    const infoContato = document.createElement("div");

    listaModal.innerHTML = "";

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
            if (info.innerText === "Setor: ") {
                infoContato.removeChild(info);
            };
        } else {
            info = document.createElement("h1");
            info.innerText = `${value}`;
            listaModal.insertBefore(hr, listaModal.childNodes[0]);
            listaModal.insertBefore(info, listaModal.childNodes[0]);
        };

        info.className = "data";
    }

    modalInformacoes.style.display = "block";
    modalInformacoes.classList.add("fadeIn");
}

//Modal para adicionar contato
const modalAdicionar = document.getElementById("modalAdicionar");
const conteudoModalAdd = modalAdicionar.children[0];


function mostrarModalAdd() {
    mostrandoModal = true;
    modalAdicionar.classList.add("fadeIn");
    modalAdicionar.style.display = "block";
    nomeContato.disabled = false;
}

function fecharModal(event) {
    if (event.target.parentNode.parentNode.id == "conteudoModalAdd") {
        mostrandoModal = false;
        modalAdicionar.style.display = "none";
        limparModalAdd();
    } else if (event.target.parentNode.parentNode.parentNode.id == "conteudoModalInfo") {
        mostrandoModal = false;
        modalInformacoes.style.display = "none";
        listaModal.innerHTML = "";
    }
};

//Fechar modais ao clicar fora deles
window.onclick = function(event) {
    if (event.target == modalAdicionar) {
        mostrandoModal = false;
        modalAdicionar.style.display = "none";
        limparModalAdd();
    } else if (event.target == modalInformacoes) {
        mostrandoModal = false;
        modalInformacoes.style.display = "none";
        listaModal.innerHTML = "";
    }

    if (categoriaContato.value === "Senado") {
        campoSetor.style.display = "block";
    } else {
        campoSetor.style.display = "none";
    }

    if (modalInformacoes.style.display === "block" && modalAdicionar.style.display === "block") {
        modoEditar = true;
        conteudoModalAdd.children[1].innerText = "Editar Contato";
    } else {
        modoEditar = false;
        conteudoModalAdd.children[1].innerText = "Adicionar Contato";
    }
};

window.onkeyup = function(event) {
    if (event.key == "Escape") {
        mostrandoModal = false;
        modalAdicionar.style.display = "none";
        limparModalAdd();
        mostrandoModal = false;
        modalInformacoes.style.display = "none";
        listaModal.innerHTML = "";
    };
};

//Adicionar contato
function Contato(nome, telefone, email, categoria, setor) {
    this.nome = nome;
    this.telefone = telefone;
    this.email = email;
    this.categoria = categoria;
    this.setor = setor;
}

function botaoSalvar() {

    if (modoEditar === true) {
        modalConfirmarAcao.style.display = "block";
        return;
    }

    if (msgErroCadastrar() === true) {
        alert("Existem campos vazios!");
        return;
    }

    let nomeDuplicado = false;

    contatos.forEach((contato) => {
        if (nomeContato.value === contato.nome) {
            nomeDuplicado = true;
        }
    });

    if (nomeDuplicado === true) {
        alert("Um contato com este nome já existe.");
        return;
    };

    salvarContato();

};

function salvarContato(indexContato) {

    let setor;
    if (categoriaContato.value === "Senado") {
        setor = campoSetor.children[2].value;
    } else { setor = ""; }

    let contato = new Contato(
        nomeContato.value,
        telefoneContato.value,
        emailContato.value,
        categoriaContato.value,
        setor
    );

    let nomeObjContato = nomeContato.value;


    if (modoEditar === true) {
        contatos[indexContato].telefone = contato.telefone
        contatos[indexContato].email = contato.email
        contatos[indexContato].categoria = contato.categoria
        contatos[indexContato].setor = contato.setor
    } else {
        contatos.push(contato);
    }
    contatos.sort(ordemAlfabetica);
    arquivo.set(nomeObjContato, contato);
    arquivo.save();

    limparModalAdd();
    mostrarContatos();
    modalAdicionar.style.display = "none";

};

//Deletar contato
const botaoDeletarModal = document.getElementById("botaoDeletarModal");
const iconeDeletarModal = document.getElementById("iconeDeletarModal");
let contadorCliques = false;

function deletarContato(event) {
    const botaoDeletarModal = event.target.parentNode
    const conteudoModalInfo = botaoDeletarModal.parentNode.parentNode;
    const indexNome = conteudoModalInfo.children.length - 1;
    const listaModal = conteudoModalInfo.children[indexNome];
    let nomeContatoDeletado = listaModal.firstChild.innerText;
    let indexContatoDeletado;

    if (contadorCliques === false) {
        botaoDeletarModal.style.backgroundColor = "red";
        iconeDeletarModal.style.filter = "invert(1)";
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
        iconeDeletarModal.style.filter = "invert(0)";
        contadorCliques = false;
    }

    botaoDeletarModal.classList.add("fadeIn");

};

function resetarEstado() {
    botaoDeletarModal.style.backgroundColor = "transparent";
    iconeDeletarModal.style.filter = "invert(0)";
    botaoDeletarModal.classList.remove("fadeIn");
    contadorCliques = false;
}

//Mensagem de erro no cadatro de contato
const listConteudoModalAdd = [nomeContato, telefoneContato, categoriaContato];

function msgErroCadastrar() {
    let resposta = new Boolean(false);
    listConteudoModalAdd.forEach((element) => {
        if (element.value === "") {
            resposta = true;
        }
    });
    if (resposta === true) {
        return true;
    }
}
//Função filtro

function filtrarCategoria(event) {

    let contatosMostrados = 0;
    let categoria = event.target;
    const listacontatos = document.getElementById("listaContatos");
    const contatosHTML = listacontatos.getElementsByClassName("contato");
    const resultadoPesquisa = document.getElementById("resultadoPesquisa");
    let input = document.getElementById("caixaPesquisa");

    input.value = ""

    Array.from(contatosHTML).forEach(
        (contatoHTML) => (contatoHTML.style.display = "none")
    );

    if (categoria.innerText === "Todos") {
        Array.from(contatosHTML).forEach(
            (contatoHTML) => (contatoHTML.style.display = "")
        );
        resultadoPesquisa.style.display = "none";
        return;
    }

    contatos.forEach((contato, index) => {
        if (contato.categoria === categoria.innerText) {
            contatosHTML[index].style.display = "";
            contatosMostrados += 1;
        };
    });

    if (contatosMostrados === 0) {
        resultadoPesquisa.style.display = "block";
        resultadoPesquisa.innerText = "Não existem contatos registrados nesta categoria";
    } else {
        resultadoPesquisa.style.display = "none";
    }

};

//Função de pesquisa
function pesquisar() {

    let contatosMostrados = 0;
    let input = document.getElementById("caixaPesquisa");
    let filter = input.value.toUpperCase();

    let content = document.getElementById("listaContatos");
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
                contatosMostrados += 1;
            }
        });
    });

    if (contatosMostrados === 0) {
        resultadoPesquisa.innerText = "Busca sem resultados";
        resultadoPesquisa.style.display = "block"
    } else {
        resultadoPesquisa.style.display = "none"
    }
};

//Função de edição de contato
const modalConfirmarAcao = document.getElementById("modalConfirmarAcao");
let modoEditar;
let indexContatoEditado;

function editarContato(event) {

    modalAdicionar.style.display = "block";
    let nomeDoContato = listaModal.children[0].innerText;

    contatos.forEach((contato, index) => {
        if (contato.nome === nomeDoContato) {
            indexContatoEditado = index;
        }
    });

    nomeContato.value = contatos[indexContatoEditado].nome;
    nomeContato.disabled = true;
    telefoneContato.value = contatos[indexContatoEditado].telefone;
    emailContato.value = contatos[indexContatoEditado].email;
    categoriaContato.value = contatos[indexContatoEditado].categoria;
    campoSetor.children[2].value = contatos[indexContatoEditado].setor;

};

function confirmarOuCancelar(event) {

    let resposta = event.target.value;

    if (resposta === "Sim") {
        salvarContato(indexContatoEditado);
        modalConfirmarAcao.style.display = "none";
        modalAdicionar.style.display = "none";
        modalInformacoes.style.display = "none";
        mostrarContatos();
        nomeContato.disabled = false;
    } else {
        modalConfirmarAcao.style.display = "none";
    }

};