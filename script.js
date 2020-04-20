const listaContatos = document.getElementById("listaContatos");

const contatos = [
    { "nome": "Gabriel Trindade", "telefone": "3212-3123" },
    { "nome": "Matheus Guedes", "telefone": "3654-3123" },
    { "nome": "Edionay Aguiar", "telefone": "3212-8765" },
];

// debugger

//Mostrar contatos
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

function adicionarContato() {


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