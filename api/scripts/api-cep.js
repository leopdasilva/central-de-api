const btnConsultar = document.getElementById("btnConsultar");

btnConsultar.addEventListener("click", consultarCEP);

async function consultarCEP() {

    let cep = document.getElementById("cep").value;

    cep = cep.replace(/\D/g, "");

    if (cep.length !== 8) {
        alert("Digite um CEP válido.");
        return;
    }

    try {

        const resposta = await fetch(
            `https://viacep.com.br/ws/${cep}/json/`
        );

        const dados = await resposta.json();

        if (dados.erro) {
            alert("CEP não encontrado.");
            return;
        }

        document.getElementById("logradouro").textContent =
            dados.logradouro || "-";

        document.getElementById("bairro").textContent =
            dados.bairro || "-";

        document.getElementById("cidade").textContent =
            dados.localidade || "-";

        document.getElementById("estado").textContent =
            dados.uf || "-";

        // Monta o endereço para o mapa
        const endereco =
            `${dados.logradouro}, ${dados.bairro}, ${dados.localidade}, ${dados.uf}`;

        // Exibe o mapa
        const mapa = document.getElementById("mapa");

        mapa.src =
            `https://maps.google.com/maps?q=${encodeURIComponent(endereco)}&z=15&output=embed`;

        mapa.style.display = "block";

    }
    catch (erro) {

        console.error("Erro:", erro);

        alert("Erro ao consultar a API.");

    }
}