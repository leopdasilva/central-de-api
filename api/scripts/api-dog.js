const btnBuscar = document.getElementById("btnBuscar");

btnBuscar.addEventListener("click", buscarCachorro);

async function buscarCachorro() {

    try {

        const resposta = await fetch(
            "https://dog.ceo/api/breeds/image/random"
        );

        if (!resposta.ok) {
            throw new Error(
                `Erro HTTP: ${resposta.status}`
            );
        }

        const dados = await resposta.json();

        const imagem = document.getElementById(
            "imagemDog"
        );

        imagem.src = dados.message;

        imagem.style.display = "block";

    }
    catch (erro) {

        console.error(erro);

        alert(
            "Não foi possível carregar a imagem."
        );

    }
}