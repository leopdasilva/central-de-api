const btnBuscar = document.getElementById('btnBuscar');

if (btnBuscar) {
    btnBuscar.addEventListener('click', buscarAtividadeReal);
}

function buscarAtividadeReal() {
    const atividadeEl = document.getElementById('atividade');
    atividadeEl.innerText = "Buscando uma atividade na API...";

    // API REAL hospedada na nuvem contendo uma lista de atividades reais em português
    fetch("https://65fa3a4739dd90a371ca6c93.mockapi.io/api/v1/atividades")
        .then(res => {
            if (!res.ok) throw new Error("Erro ao conectar na API");
            return res.json();
        })
        .then(listaDeAtividades => {
            // A API retorna um array de atividades. Vamos sortear uma aleatoriamente:
            const indiceAleatorio = Math.floor(Math.random() * listaDeAtividades.length);
            const dados = listaDeAtividades[indiceAleatorio];

            // Renderiza na tela seguindo os IDs do seu HTML e o seu estilo escuro
            atividadeEl.innerHTML = `
                <span style="display: block; font-weight: 600; font-size: 18px; margin-bottom: 15px; color: #fff;">
                    ${dados.atividade}
                </span>
                
                <span style="display: block; font-size: 13px; margin-top: 15px; color: #666;">
                    Código da atividade: <strong>#${dados.id}</strong>
                </span>
            `;
        })
        .catch(erro => {
            console.error("Erro na requisição da API:", erro);
            atividadeEl.innerHTML = `<span style="color: #f87171;">Ocorreu um erro ao conectar com o servidor da API. Tente novamente!</span>`;
        });
}