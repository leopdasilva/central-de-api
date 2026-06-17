const btnConsultar = document.getElementById("btnConsultar");

btnConsultar.addEventListener("click", consultarIP);

async function consultarIP() {

    try {

        document.getElementById("cidade").textContent =
            "Consultando...";

        document.getElementById("estado").textContent = "-";
        document.getElementById("pais").textContent = "-";
        document.getElementById("ip").textContent = "-";

        const resposta = await fetch(
            "https://ipapi.co/json/"
        );

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();

        document.getElementById("cidade").textContent =
            dados.city || "Não disponível";

        document.getElementById("estado").textContent =
            dados.region || "Não disponível";

        document.getElementById("pais").textContent =
            dados.country_name || "Não disponível";

        document.getElementById("ip").textContent =
            dados.ip || "Não disponível";

    }
    catch (erro) {

        console.error("Erro:", erro);

        document.getElementById("cidade").textContent =
            "Erro ao consultar";

        document.getElementById("estado").textContent = "-";
        document.getElementById("pais").textContent = "-";
        document.getElementById("ip").textContent = "-";

        alert("Não foi possível consultar as informações do IP.");
    }
}