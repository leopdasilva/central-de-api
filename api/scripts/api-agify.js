document.addEventListener("DOMContentLoaded", () => {

    const btnConsultar = document.getElementById("btnConsultar");

    if (!btnConsultar) {
        console.error("Botão btnConsultar não encontrado");
        return;
    }

    btnConsultar.addEventListener("click", consultarNome);

    async function consultarNome(event) {
        if (event) event.preventDefault(); 

        const nome = document.getElementById("nome").value.trim();

        if (!nome) {
            alert("Digite um nome.");
            return;
        }

        const apiKey = ""; 
        let url = `https://api.agify.io/?name=${encodeURIComponent(nome)}`;
        
        if (apiKey) {
            url += `&apikey=${apiKey}`;
        }

        try {
            document.getElementById("resultadoNome").textContent = "Carregando...";
            document.getElementById("idade").textContent = "-";
            document.getElementById("quantidade").textContent = "-";

            const resposta = await fetch(url);

            if (!resposta.ok) {
                if (resposta.status === 429) {
                    // Alerta adicionado para o limite de requisições
                    alert("Aviso: O limite de requisições gratuitas da API foi atingido para o seu IP. Tente novamente mais tarde ou insira uma API Key.");

                    document.getElementById("resultadoNome").textContent = nome;
                    document.getElementById("idade").textContent = "Limite da API atingido";
                    document.getElementById("quantidade").textContent = "Tente novamente depois";
                    return;
                }
                
                if (resposta.status === 401) {
                    alert("Erro: Acesso não autorizado. Verifique sua API Key.");
                    
                    document.getElementById("resultadoNome").textContent = nome;
                    document.getElementById("idade").textContent = "Não autorizado";
                    document.getElementById("quantidade").textContent = "Requer API Key válida";
                    return;
                }

                throw new Error("Erro HTTP: " + resposta.status);
            }

            const dados = await resposta.json();

            document.getElementById("resultadoNome").textContent = dados.name || nome; 
            document.getElementById("idade").textContent = dados.age ?? "Não disponível";
            document.getElementById("quantidade").textContent = dados.count ?? "Não disponível";

        } catch (erro) {
            console.error("Erro na requisição:", erro);
            
            // Alerta genérico para falhas de rede ou CORS
            alert("Ocorreu um erro ao tentar se comunicar com a API. Verifique o console.");

            document.getElementById("resultadoNome").textContent = nome;
            document.getElementById("idade").textContent = "Erro ao consultar";
            document.getElementById("quantidade").textContent = "-";
        }
    }
});