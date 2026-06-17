const btnBuscar = document.getElementById('btnBuscar');

if (btnBuscar) {
    btnBuscar.addEventListener('click', buscarAtividadeReal);
}

function buscarAtividadeReal() {
    const atividadeEl = document.getElementById('atividade');
    atividadeEl.innerText = "Buscando uma atividade na API...";

    // Lista reserva local caso a API falhe ou mude de URL
    const atividadesReserva = [
        { id: "L01", atividade: "Aprender os conceitos básicos de Git e GitHub" },
        { id: "L02", atividade: "Praticar manipulação do DOM com JavaScript puro" },
        { id: "L03", atividade: "Consumir uma API REST utilizando Async/Await" },
        { id: "L04", atividade: "Estilizar componentes utilizando CSS Grid e Flexbox" },
        { id: "L05", atividade: "Criar uma aplicação simples de lista de tarefas (To-Do List)" }
    ];

    // Se quiser testar uma nova API estável, pode substituir esta URL depois
    fetch("https://65fa3a4739dd90a371ca6c93.mockapi.io/api/v1/atividades")
        .then(res => {
            if (!res.ok) throw new Error("API indisponível ou deletada (Status: " + res.status + ")");
            return res.json();
        })
        .then(listaDeAtividades => {
            // Se a API funcionar, sorteia dela
            renderizarAtividade(listaDeAtividades, atividadeEl);
        })
        .catch(erro => {
            console.warn("A API falhou, usando lista local de segurança:", erro.message);
            
            // Ativa o plano B: sorteia da lista local para o site continuar funcionando
            renderizarAtividade(atividadesReserva, atividadeEl);
        });
}

// Função auxiliar para evitar repetição de código de renderização
function renderizarAtividade(lista, elemento) {
    const indiceAleatorio = Math.floor(Math.random() * lista.length);
    const dados = lista[indiceAleatorio];

    elemento.innerHTML = `
        <span style="display: block; font-weight: 600; font-size: 18px; margin-bottom: 15px; color: #fff;">
            ${dados.atividade}
        </span>
        
        <span style="display: block; font-size: 13px; margin-top: 15px; color: #666;">
            Código da atividade: <strong>#${dados.id}</strong>
        </span>
    `;
}