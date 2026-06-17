const btnBuscar = document.getElementById("btnBuscar");

btnBuscar.addEventListener("click", buscarPersonagem);

async function buscarPersonagem() {

    const idPersonagem = document.getElementById("idPersonagem").value;

    if (!idPersonagem) {
        alert("Digite um ID de personagem.");
        return;
    }

    try {

        document.getElementById("nome").textContent = "Carregando...";
        document.getElementById("status").textContent = "-";
        document.getElementById("especie").textContent = "-";
        document.getElementById("genero").textContent = "-";

        const resposta = await fetch(
            `https://rickandmortyapi.com/api/character/${idPersonagem}`
        );

        if (!resposta.ok) {
            throw new Error("Personagem não encontrado");
        }

        const dados = await resposta.json();

        document.getElementById("nome").textContent = dados.name;
        document.getElementById("status").textContent = traduzirStatus(dados.status);
        document.getElementById("especie").textContent = dados.species;
        document.getElementById("genero").textContent = traduzirGenero(dados.gender);

        const imagem = document.getElementById("imagem");
        imagem.src = dados.image;
        imagem.style.display = "block";

    }
    catch (erro) {

        console.error(erro);

        document.getElementById("nome").textContent =
            "Erro ao buscar personagem";

        document.getElementById("status").textContent = "-";
        document.getElementById("especie").textContent = "-";
        document.getElementById("genero").textContent = "-";

        document.getElementById("imagem").style.display = "none";

        alert("Não foi possível buscar o personagem.");
    }
}

// Traduções para português
function traduzirStatus(status) {
    switch (status) {
        case "Alive":
            return "Vivo";
        case "Dead":
            return "Morto";
        default:
            return "Desconhecido";
    }
}

function traduzirGenero(genero) {
    switch (genero) {
        case "Male":
            return "Masculino";
        case "Female":
            return "Feminino";
        default:
            return "Desconhecido";
    }
}