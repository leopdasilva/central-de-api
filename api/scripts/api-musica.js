document.addEventListener("DOMContentLoaded", () => {
    const btnBuscar = document.getElementById("btnBuscar");

    if (btnBuscar) {
        btnBuscar.addEventListener("click", buscarMusica);
    }

    async function buscarMusica(event) {
        if (event) event.preventDefault();

        const musicaInput = document.getElementById("nomeMusica").value.trim();
        const capaImg = document.getElementById("capaAlbum");
        const videoContainer = document.getElementById("videoContainer");

        if (!musicaInput) {
            alert("Por favor, digite o nome de uma música.");
            return;
        }

        try {
            // Reset do estado da tela (Carregando)
            document.getElementById("musicaNome").textContent = "Buscando...";
            document.getElementById("bandaNome").textContent = "-";
            document.getElementById("albumInfo").textContent = "-";
            capaImg.style.display = "none";
            videoContainer.innerHTML = "<span style='color: #9ca3af; font-size: 0.9rem;'>Carregando player...</span>";

            // 1. Busca os metadados na API do iTunes
            const urliTunes = `https://itunes.apple.com/search?term=${encodeURIComponent(musicaInput)}&entity=musicTrack&limit=1`;
            const respostaiTunes = await fetch(urliTunes);
            if (!respostaiTunes.ok) throw new Error("Erro ao conectar no iTunes");

            const dadosiTunes = await respostaiTunes.json();

            if (!dadosiTunes.results || dadosiTunes.results.length === 0) {
                alert("Música não encontrada. Tente digitar o nome junto com o artista.");
                document.getElementById("musicaNome").textContent = "Não encontrada";
                videoContainer.innerHTML = "";
                return;
            }

            const faixa = dadosiTunes.results[0];

            // Alimenta os campos de texto do HTML
            document.getElementById("musicaNome").textContent = faixa.trackName;
            document.getElementById("bandaNome").textContent = faixa.artistName;
            
            const ano = faixa.releaseDate ? ` (${faixa.releaseDate.split("-")[0]})` : "";
            document.getElementById("albumInfo").textContent = (faixa.collectionName || "Single") + ano;

            // Alimenta a imagem da capa do álbum
            if (faixa.artworkUrl100) {
                const imagemAltaQualidade = faixa.artworkUrl100.replace("100x100bb.jpg", "400x400bb.jpg");
                capaImg.src = imagemAltaQualidade;
                capaImg.alt = faixa.collectionName;
                capaImg.style.display = "block";
            }

            // Como o YouTube bloqueia a reprodução de músicas comerciais em iframes locais,
            // vamos disparar direto o fallback do botão inteligente que vai direto para o vídeo.
            throw new Error("Forçando botão direto para evitar bloqueio do YouTube");

        } catch (erro) {
            // Captura os dados da música que foram tratados acima
            const nomeArtista = document.getElementById("bandaNome").textContent;
            const nomeMusica = document.getElementById("musicaNome").textContent;
            
            // Monta o termo perfeito: "Nome do Artista - Nome da Música (Official Music Video)"
            const termoPerfeito = (nomeArtista !== "-" && nomeArtista !== "Buscando...") 
                ? `${nomeArtista} ${nomeMusica} official music video` 
                : `${musicaInput} official music video`;

            // TRUQUE DO REDIRECIONAMENTO DIRETO:
            // Usamos a URL de "Estou com sorte" do Google filtrando apenas vídeos do YouTube.
            // Isso faz o navegador abrir direto o primeiro link encontrado (o clipe oficial).
            const urlBotaoDireto = `https://www.google.com/search?q=${encodeURIComponent(termoPerfeito)}&btnI=I`;

            // Altera o HTML interno criando o botão estiloso
            videoContainer.innerHTML = `
                <p style="color: #9ca3af; font-size: 0.85rem; margin-bottom: 12px;">Para evitar bloqueios de direitos autorais, assista direto na plataforma:</p>
                <a href="${urlBotaoDireto}" 
                   target="_blank" 
                   style="display: inline-block; padding: 12px 22px; background: #ef4444; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 0.9rem; transition: 0.2s; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);"
                   onmouseover="this.style.transform='translateY(-2px)'; this.style.background='#dc2626';"
                   onmouseout="this.style.transform='translateY(0)'; this.style.background='#ef4444';"
                >
                    📺 Abrir Clipe Direto no YouTube
                </a>
            `;
        }
    }
});