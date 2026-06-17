const btnConsultar = document.getElementById("btnConsultar");

if (btnConsultar) {
    btnConsultar.addEventListener("click", consultarIP);
}

async function consultarIP(event) {
    if (event) event.preventDefault(); 

    try {
        document.getElementById("cidade").textContent = "Consultando...";
        document.getElementById("estado").textContent = "-";
        document.getElementById("pais").textContent = "-";
        document.getElementById("ip").textContent = "-";

        // Usando a alternativa estável do ip-api.com
        const resposta = await fetch("http://ip-api.com/json/");

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();

        // O ip-api retorna um campo 'status'. Se for 'fail', algo deu errado
        if (dados.status === "fail") {
            alert(`Não foi possível localizar o IP. Motivo: ${dados.message}`);
            document.getElementById("cidade").textContent = "Não disponível";
            return;
        }

        // Mapeamento dos novos campos da API substituta
        document.getElementById("cidade").textContent = dados.city || "Não disponível";
        document.getElementById("estado").textContent = dados.regionName || "Não disponível"; // 'regionName' traz o estado completo (ex: Parana)
        document.getElementById("pais").textContent = dados.country || "Não disponível";
        document.getElementById("ip").textContent = dados.query || "Não disponível"; // No ip-api, o IP vem no campo 'query'

    } catch (erro) {
        console.error("Erro:", erro);

        document.getElementById("cidade").textContent = "Erro ao consultar";
        document.getElementById("estado").textContent = "-";
        document.getElementById("pais").textContent = "-";
        document.getElementById("ip").textContent = "-";

        alert("Falha na conexão com o serviço de IP alternativo.");
    }
}