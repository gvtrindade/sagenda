let contatos


window.onload = function() {
    fetch("./data.json")
        .then(response => response.json())
        .then(data => {
            contatos = data.contatos
            limparModalAdd();
            mostrarContatos();
        })
};

const listaContatos = document.getElementById("listaContatos");
const caixaPesquisa = document.getElementById("caixaPesquisa");
const nomeContato = document.getElementById("nomeContato");
const telefoneContato = document.getElementById("telefoneContato");
const emailContato = document.getElementById("emailContato");
const categoriaContato = document.getElementById("categoriaContato");
const conteudoModalAdd = [
    nomeContato,
    telefoneContato,
    categoriaContato
]




// debugger

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
        let nome = document.createElement("li");
        let telefone = document.createElement("li");
        const hr = document.createElement("hr");

        contato.className = "contato";
        contato.id = contatos[i].nome;
        contato.onclick = mostrarModal;

        nome.innerText = contatos[i].nome;
        telefone.innerText = contatos[i].telefone;
        nome.className = "Data";
        telefone.className = "Data";

        listaContatos.appendChild(contato);
        contato.appendChild(nome);
        contato.appendChild(telefone);


        if (i !== contatos.length - 1) {
            contato.appendChild(hr);
        };

    };

};

//Modal com informações
const modalInformacoes = document.getElementById("modalInformacoes")

function mostrarModal(event) {
    const id = event.target.parentNode.id;
    const nomeModal = document.getElementById("nomeModal");
    const telefoneModal = document.getElementById("telefoneModal");

    let contato = contatos.find(element => element.nome === id);

    nomeModal.innerText = contato.nome;
    telefoneModal.innerText = contato.telefone;

    modalInformacoes.style.display = "block";

};

function fecharModalInfo() {
    modalInformacoes.style.display = "none";
};


//Adicionar contato
const modalAdicionar = document.getElementById("modalAdicionar")

function mostrarModalAdd() {
    modalAdicionar.style.display = "block";
};

function fecharModalAdd() {
    modalAdicionar.style.display = "none";
};

window.onclick = function(event) {
    if (event.target == modalAdicionar) {
        modalAdicionar.style.display = "none";
    } else if (event.target == modalInformacoes) {
        modalInformacoes.style.display = "none";
    };
};

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

    let infoContato = new Contato(
        nomeContato.value,
        telefoneContato.value,
        emailContato.value,
        categoriaContato.value
    );

    contatos.push(infoContato);
    limparModalAdd();
    mostrarContatos();
    modalAdicionar.style.display = "none";

};

//Mensagem de erro no cadatro de contato
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