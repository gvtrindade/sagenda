//Inserir dados da base em um array
const editJsonFile = require("edit-json-file");
let arquivoOriginal;
let arquivo;
let objContatos;
let arrayDados;
let contatosNaoFiltrados;
let contatos;

function montarArrayContatos() {
    contatos = [];
    arquivo = editJsonFile("./Assets/data.json");
    objContatos = arquivo.data
    arrayDados = Object.entries(objContatos)
    contatosNaoFiltrados = [];

    for (k = 0; k < arrayDados.length; k++) {
        contatosNaoFiltrados.push(arrayDados[k][1]);
    };

    contatos = contatosNaoFiltrados.sort(ordemAlfabetica);
};

let modalAtivado;

setInterval(
    function() {
        arquivoOriginal = editJsonFile("./Assets/data.json");

        if (JSON.stringify(arquivo) !== JSON.stringify(arquivoOriginal)) {
            modalAtivado = 0;

            Array.from(modais).forEach(modal => {
                if (modal.style.display === "block") {
                    modalAtivado += 1;
                }
            })

            if (modalAtivado == 0) {
                confirmarOuCancelar("Sim", "Atualizar");
            };
        };
    },
    1 * 1000
);


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
};

window.onload = function() {
    limparModalAdd();
    montarArrayContatos();
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
    camposAdicionais.innerHTML = "";
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
let camposAdicionais = document.getElementById("camposAdicionais");

function montarObjContatoEditado() {

    let objContatoEditado = {};

    Array.from(campos).forEach(campo => {

        let chaveCampo;

        if (campo.children[0].id === "campoSetor") {
            chaveCampo = campoSetor.children[0].innerText.slice(0, -1).toLowerCase();
            objContatoEditado[chaveCampo] = campoSetor.children[2].value;
        } else {
            if (campo.children[0].type === "text") {
                chaveCampo = campo.children[0].value.toLowerCase();
                Object.keys(objContatoEditado).forEach(chave => {
                    if (chaveCampo === chave) { chaveCampo = `${chaveCampo}2` }
                });
                objContatoEditado[chaveCampo] = campo.children[1].value;
            } else {
                chaveCampo = campo.children[0].innerText.slice(0, -1).toLowerCase();
                objContatoEditado[chaveCampo] = campo.children[1].value;
            }
        }

    });

    return objContatoEditado;

};

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

    let contatoAdicionado = {};

    console.log("Função ativada")

    let setor;
    if (categoriaContato.value === "Senado") {
        setor = campoSetor.children[2].value;
    } else { setor = ""; }

    let contato = montarObjContatoEditado();

    let nomeObjContato = nomeContato.value;


    if (modoEditar === true) {

        Object.keys(contatos[indexContato]).forEach(key => {
            contatos[indexContato][key] = contato[key];
        })

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


const botaoRemoverCampo = document.getElementById("botaoRemoverCampo");

function adicionarCampo(chaveContato, valorContato) {

    botaoRemoverCampo.style.display = "block";

    const div = document.createElement("div");
    let campo;
    const valor = document.createElement("input");

    if (modoEditar === true) {
        campo = document.createElement("label");
        let titulo = chaveContato.charAt(0).toUpperCase() + chaveContato.slice(1);
        campo.innerText = `${titulo}:`;
        valor.value = valorContato
    } else {
        campo = document.createElement("input");
        campo.type = "text";
        campo.placeholder = "Campo";
        valor.placeholder = "Valor";
    }

    div.className = "campo";
    valor.type = "text";

    camposAdicionais.appendChild(div);
    div.appendChild(campo);
    div.appendChild(valor);


}

function removerCampo() {

    let ultimoAdicionado = camposAdicionais.lastChild

    camposAdicionais.removeChild(ultimoAdicionado);

    if (camposAdicionais.childElementCount === 0) {
        botaoRemoverCampo.style.display = "none";
    };

}

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
const campos = document.getElementsByClassName("campo");
let modoEditar;
let indexContatoEditado;

function editarContato(event) {

    modoEditar = true;

    modalAdicionar.style.display = "block";
    let nomeDoContato = listaModal.children[0].innerText;

    let chavesContato = []

    contatos.forEach((contato, index) => {
        if (contato.nome === nomeDoContato) {
            indexContatoEditado = index;
            chavesContato = Object.keys(contato);
            if (chavesContato.length > 5) {
                chavesContato = chavesContato.slice(5)
                chavesContato.forEach(chave => {
                    adicionarCampo(chave, contato[chave]);
                })
            };
        }
    });

    nomeContato.disabled = true;

    Array.from(campos).forEach(campo => {

        let chaveCampo;

        if (campo.children[0].id === "campoSetor") {
            chaveCampo = campoSetor.children[0].innerText.slice(0, -1).toLowerCase();
            campoSetor.children[2].value = contatos[indexContatoEditado][chaveCampo];
        } else {
            chaveCampo = campo.children[0].innerText.slice(0, -1).toLowerCase();
            campo.children[1].value = contatos[indexContatoEditado][chaveCampo];
        }
    });

};

function confirmarOuCancelar(resposta, acao) {

    if (resposta === "Sim" && acao == "Editar") {
        salvarContato(indexContatoEditado);
        modalConfirmarAcao.style.display = "none";
        modalAdicionar.style.display = "none";
        modalInformacoes.style.display = "none";
        mostrarContatos();
        nomeContato.disabled = false;
    } else if (resposta === "Não" && acao == "Editar") {
        modalConfirmarAcao.style.display = "none";
    };


    if (resposta === "Sim" && acao == "Atualizar") {
        console.log("Contato editado");
        montarArrayContatos();
        mostrarContatos();
    };
};