document.addEventListener("DOMContentLoaded", () => {
    const btnBuscar = document.getElementById("btnBuscar");

    if (btnBuscar) {
        btnBuscar.addEventListener("click", buscarPorNome);
    }

    // Dicionários de tradução para os dados que vêm da API
    const traduzirStatus = {
        "Alive": "Vivo",
        "Dead": "Morto",
        "unknown": "Desconhecido"
    };

    const traduzirGenero = {
        "Female": "Feminino",
        "Male": "Masculino",
        "Genderless": "Sem gênero",
        "unknown": "Desconhecido"
    };

    const traduzirEspecie = {
        "Human": "Humano",
        "Alien": "Alienígena",
        "Humanoid": "Humanoide",
        "Poopybutthole": "Poopybutthole",
        "Mythological Creature": "Criatura Mitológica",
        "Animal": "Animal",
        "Robot": "Robô",
        "Cronenberg": "Cronenberg",
        "Disease": "Doença",
        "unknown": "Desconhecido"
    };

    async function buscarPorNome(event) {
        if (event) event.preventDefault();

        const nomeInput = document.getElementById("nomePersonagem").value.trim();
        const imgElement = document.getElementById("imagem");

        if (!nomeInput) {
            alert("Por favor, digite um nome para buscar.");
            return;
        }

        try {
            document.getElementById("nome").textContent = "Buscando...";
            document.getElementById("status").textContent = "-";
            document.getElementById("especie").textContent = "-";
            document.getElementById("genero").textContent = "-";
            imgElement.style.display = "none";

            const resposta = await fetch(`https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(nomeInput)}`);

            if (!resposta.ok) {
                if (resposta.status === 404) {
                    throw new Error("Nenhum personagem encontrado com esse nome.");
                }
                throw new Error(`Erro HTTP: ${resposta.status}`);
            }

            const dados = await resposta.json();
            const personagem = dados.results[0];

            // Aplica as traduções usando os dicionários (com fallback caso venha algo novo)
            const statusPt = traduzirStatus[personagem.status] || personagem.status;
            const generoPt = traduzirGenero[personagem.gender] || personagem.gender;
            const especiePt = traduzirEspecie[personagem.species] || personagem.species;

            // Preenche os campos com os valores traduzidos
            document.getElementById("nome").textContent = personagem.name;
            document.getElementById("status").textContent = statusPt;
            document.getElementById("especie").textContent = especiePt;
            document.getElementById("genero").textContent = generoPt;

            const statusElement = document.getElementById("status");

            // Limpa as classes de cor anteriores para não acumular
            statusElement.className = ""; 

            // Aplica a classe certa baseada no status original da API
            if (personagem.status === "Alive") {
                statusElement.classList.add("status-vivo");
            } else if (personagem.status === "Dead") {
                statusElement.classList.add("status-morto");
            } else {
                statusElement.classList.add("status-desconhecido");
            }

            // Preenche os campos com os valores traduzidos
            document.getElementById("nome").textContent = personagem.name;
            statusElement.textContent = statusPt; // Atualiza o texto do status estilizado
            document.getElementById("especie").textContent = especiePt;
            document.getElementById("genero").textContent = generoPt;

            imgElement.src = personagem.image;
            imgElement.alt = personagem.name;
            imgElement.style.display = "block";
            

        } catch (erro) {
            console.error("Erro na consulta:", erro);
            
            document.getElementById("nome").textContent = "Não encontrado";
            document.getElementById("status").textContent = "-";
            document.getElementById("especie").textContent = "-";
            document.getElementById("genero").textContent = "-";
            imgElement.style.display = "none";

            alert(erro.message || "Erro ao consultar o personagem.");
        }
    }
});