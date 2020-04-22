window.onload = function() {
    limparModalAdd();
    mostrarContatos();
};

const listaContatos = document.getElementById("listaContatos");
const nomeContato = document.getElementById("nomeContato");
const telefoneContato = document.getElementById("telefoneContato");
const emailContato = document.getElementById("emailContato");
const categoriaContato = document.getElementById("categoriaContato");
const conteudoModalAdd = [
    nomeContato,
    telefoneContato,
    categoriaContato
]


const contatos = [
    { "nome": "Gabriel Trindade", "telefone": "3212-3123", "email": "", "categoria": "Servidor" },
    { "nome": "Matheus Guedes", "telefone": "3654-3123", "email": "", "categoria": "Servidor" },
    { "nome": "Edionay Aguiar", "telefone": "3212-8765", "email": "", "categoria": "Servidor" },
];

// debugger

//Limpar modal de adicionar
function limparModalAdd() {

    nomeContato.value = "";
    telefoneContato.value = "";
    emailContato.value = "";
    categoriaContato.value = "";

};

//Mostrar contatos
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


        listaContatos.appendChild(contato);
        contato.appendChild(nome);
        contato.appendChild(telefone);


        if (i !== contatos.length - 1) {
            listaContatos.appendChild(hr);
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