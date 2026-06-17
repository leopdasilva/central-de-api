const btnBuscar = document.getElementById("btnBuscar");

btnBuscar.addEventListener("click", consultarBitcoin);

async function consultarBitcoin() {

    try {

        document.getElementById("valorBitcoin").textContent =
            "Consultando...";

        const resposta = await fetch(
            "https://economia.awesomeapi.com.br/json/last/BTC-BRL"
        );

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();

        document.getElementById("valorBitcoin").textContent =
            "R$ " + Number(dados.BTCBRL.bid).toLocaleString(
                "pt-BR",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

    }
    catch (erro) {

        console.error(erro);

        document.getElementById("valorBitcoin").textContent =
            "Não foi possível consultar o valor do Bitcoin.";

        alert(
            "Erro ao acessar a API da AwesomeAPI."
        );

    }
}