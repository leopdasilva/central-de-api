const btnConsultar = document.getElementById("btnConsultar");

btnConsultar.addEventListener("click", consultarGenero);

async function consultarGenero() {

    const nome = document.getElementById("nome").value.trim();

    if (nome === "") {
        alert("Digite um nome.");
        return;
    }

    try {

        const resposta = await fetch(
            `https://api.genderize.io/?name=${encodeURIComponent(nome)}`
        );

        if (!resposta.ok) {

            if (resposta.status === 429) {

                document.getElementById("resultadoNome").textContent = nome;
                document.getElementById("genero").textContent =
                    "Limite da API atingido";
                document.getElementById("probabilidade").textContent =
                    "Tente novamente mais tarde";

                alert("A API Genderize atingiu o limite de consultas (Erro 429).");

                return;
            }

            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();

        let genero = "Não identificado";

        if (dados.gender === "male") {
            genero = "Masculino";
        }
        else if (dados.gender === "female") {
            genero = "Feminino";
        }

        let probabilidade = "Não disponível";

        if (
            dados.probability !== null &&
            dados.probability !== undefined
        ) {
            probabilidade =
                (dados.probability * 100).toFixed(1) + "%";
        }

        document.getElementById("resultadoNome").textContent =
            dados.name || nome;

        document.getElementById("genero").textContent =
            genero;

        document.getElementById("probabilidade").textContent =
            probabilidade;

    }
    catch (erro) {

        console.error("Erro:", erro);

        document.getElementById("resultadoNome").textContent =
            nome;

        document.getElementById("genero").textContent =
            "Erro ao consultar";

        document.getElementById("probabilidade").textContent =
            "-";

        alert("Não foi possível consultar a API.");
    }
}