document.addEventListener("DOMContentLoaded", () => {

    const btnConsultar = document.getElementById("btnConsultar");

    if (!btnConsultar) {
        console.error("Botão btnConsultar não encontrado");
        return;
    }

    btnConsultar.addEventListener("click", consultarNome);

    async function consultarNome() {

        const nome = document.getElementById("nome").value.trim();

        if (!nome) {
            alert("Digite um nome.");
            return;
        }

        try {

            document.getElementById("resultadoNome").textContent = "Carregando...";
            document.getElementById("idade").textContent = "-";
            document.getElementById("quantidade").textContent = "-";

            const resposta = await fetch(
                `https://api.agify.io/?name=${encodeURIComponent(nome)}`
            );

            if (!resposta.ok) {

                if (resposta.status === 429) {

                    document.getElementById("resultadoNome").textContent = nome;
                    document.getElementById("idade").textContent = "Limite da API atingido";
                    document.getElementById("quantidade").textContent = "Tente novamente depois";

                    return;
                }

                throw new Error("Erro HTTP: " + resposta.status);
            }

            const dados = await resposta.json();

            document.getElementById("resultadoNome").textContent = dados.name;
            document.getElementById("idade").textContent = dados.age ?? "Não disponível";
            document.getElementById("quantidade").textContent = dados.count ?? "Não disponível";

        }
        catch (erro) {

            console.error(erro);

            document.getElementById("resultadoNome").textContent = nome;
            document.getElementById("idade").textContent = "Erro ao consultar";
            document.getElementById("quantidade").textContent = "-";

        }
    }

});