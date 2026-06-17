const btnConsultar = document.getElementById("btnConsultar");

btnConsultar.addEventListener("click", consultarDolar);

async function consultarDolar() {

    try {

        document.getElementById("cotacao").textContent =
            "Consultando...";

        document.getElementById("maxima").textContent = "-";
        document.getElementById("minima").textContent = "-";

        const resposta = await fetch(
            "https://economia.awesomeapi.com.br/json/last/USD-BRL"
        );

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();

        const dolar = dados.USDBRL;

        document.getElementById("cotacao").textContent =
            `R$ ${Number(dolar.bid).toFixed(2)}`;

        document.getElementById("maxima").textContent =
            `R$ ${Number(dolar.high).toFixed(2)}`;

        document.getElementById("minima").textContent =
            `R$ ${Number(dolar.low).toFixed(2)}`;

    }
    catch (erro) {

        console.error("Erro:", erro);

        document.getElementById("cotacao").textContent =
            "Erro ao consultar";

        document.getElementById("maxima").textContent = "-";
        document.getElementById("minima").textContent = "-";

        alert("Não foi possível consultar a cotação do dólar.");
    }
}