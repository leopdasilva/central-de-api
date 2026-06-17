const btnBuscar = document.getElementById("btnBuscar");

btnBuscar.addEventListener("click", buscarCuriosidade);

async function buscarCuriosidade() {

    try {

        // Busca a curiosidade
        const resposta = await fetch(
            "https://catfact.ninja/fact"
        );

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();

        // Traduz para português
        const traducao = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(dados.fact)}`
        );

        const textoTraduzido = await traducao.json();

        document.getElementById("curiosidade").textContent =
            textoTraduzido[0].map(item => item[0]).join("");

    }
    catch (erro) {

        console.error(erro);

        document.getElementById("curiosidade").textContent =
            "Não foi possível carregar a curiosidade.";

        alert("Erro ao consultar a API.");
    }
}