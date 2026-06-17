const btnConsultar = document.getElementById("btnConsultar");

btnConsultar.addEventListener("click", consultarNacionalidade);

async function consultarNacionalidade() {

    const nome = document
        .getElementById("nome")
        .value
        .trim();

    if (nome === "") {
        alert("Digite um nome.");
        return;
    }

    try {

        const resposta = await fetch(
            `https://api.nationalize.io/?name=${encodeURIComponent(nome)}`
        );

        if (!resposta.ok) {

            if (resposta.status === 429) {

                document.getElementById("resultadoNome").textContent = nome;

                document.getElementById("pais").textContent =
                    "Limite da API atingido";

                document.getElementById("probabilidade").textContent =
                    "Tente novamente mais tarde";

                alert("A API Nationalize atingiu o limite de consultas.");

                return;
            }

            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();

        document.getElementById("resultadoNome").textContent =
            dados.name;

        if (!dados.country || dados.country.length === 0) {

            document.getElementById("pais").textContent =
                "Não encontrado";

            document.getElementById("probabilidade").textContent =
                "-";

            return;
        }

        const paisMaisProvavel = dados.country[0];

        document.getElementById("pais").textContent =
            paisMaisProvavel.country_id;

        document.getElementById("probabilidade").textContent =
            (paisMaisProvavel.probability * 100).toFixed(1) + "%";

    }
    catch (erro) {

        console.error(erro);

        document.getElementById("resultadoNome").textContent =
            nome;

        document.getElementById("pais").textContent =
            "Erro ao consultar";

        document.getElementById("probabilidade").textContent =
            "-";

        alert("Não foi possível consultar a API.");
    }
}