document.addEventListener("DOMContentLoaded", () => {
    const btnBuscar = document.getElementById("btnBuscar");
    const btnAudio = document.getElementById("btnAudio");
    const statusAudio = document.getElementById("statusAudio");

    if (btnBuscar) btnBuscar.addEventListener("click", buscarMusica);
    if (btnAudio) btnAudio.addEventListener("click", iniciarIdentificacaoPorAudio);

    // --- FUNÇÃO 1: BUSCA TRADICIONAL (ITUNES + YT) ---
    async function buscarMusica(event) {
        if (event) event.preventDefault();

        const musicaInput = document.getElementById("nomeMusica").value.trim();
        const capaImg = document.getElementById("capaAlbum");
        const videoContainer = document.getElementById("videoContainer");

        if (!musicaInput) {
            alert("Por favor, digite o nome de uma música.");
            return;
        }

        const termoInicial = `${musicaInput} official music video`;
        const urlYoutubeInicial = `https://www.youtube.com/results?search_query=${encodeURIComponent(termoInicial)}&sp=EgIQAQ%253D%253D`;

        videoContainer.innerHTML = `
            <p style="color: #9ca3af; font-size: 0.85rem; margin-bottom: 12px;">Disponível no YouTube:</p>
            <a id="linkYtDinamico" 
               href="${urlYoutubeInicial}" 
               target="_blank" 
               style="display: inline-block; padding: 12px 22px; background: #ef4444; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 0.9rem; transition: 0.2s; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);"
               onmouseover="this.style.transform='translateY(-2px)'; this.style.background='#dc2626';"
               onmouseout="this.style.transform='translateY(0)'; this.style.background='#ef4444';"
            >
                📺 Assistir no YouTube
            </a>
        `;

        document.getElementById("musicaNome").textContent = "Buscando...";
        document.getElementById("bandaNome").textContent = "-";
        document.getElementById("albumInfo").textContent = "-";
        capaImg.style.display = "none";

        try {
            const urliTunes = `https://itunes.apple.com/search?term=${encodeURIComponent(musicaInput)}&entity=musicTrack&limit=1`;
            const respostaiTunes = await fetch(urliTunes);
            
            if (respostaiTunes.ok) {
                const dadosiTunes = await respostaiTunes.json();

                if (dadosiTunes.results && dadosiTunes.results.length > 0) {
                    const faixa = dadosiTunes.results[0];

                    document.getElementById("musicaNome").textContent = faixa.trackName;
                    document.getElementById("bandaNome").textContent = faixa.artistName;
                    
                    const ano = faixa.releaseDate ? ` (${faixa.releaseDate.split("-")[0]})` : "";
                    document.getElementById("albumInfo").textContent = (faixa.collectionName || "Single") + ano;

                    if (faixa.artworkUrl100) {
                        const imagemAltaQualidade = faixa.artworkUrl100.replace("100x100bb.jpg", "400x400bb.jpg");
                        capaImg.src = imagemAltaQualidade;
                        capaImg.alt = faixa.collectionName;
                        capaImg.style.display = "block";
                    }

                    const termoMelhorado = `${faixa.artistName} ${faixa.trackName} official music video`;
                    const linkYtDinamico = document.getElementById("linkYtDinamico");
                    if (linkYtDinamico) {
                        linkYtDinamico.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(termoMelhorado)}&sp=EgIQAQ%253D%253D`;
                    }
                } else {
                    document.getElementById("musicaNome").textContent = musicaInput;
                    document.getElementById("bandaNome").textContent = "Não encontrado no iTunes";
                }
            }
        } catch (erro) {
            console.warn("Erro ao buscar metadados:", erro);
            document.getElementById("musicaNome").textContent = musicaInput;
            document.getElementById("bandaNome").textContent = "Erro de conexão";
        }
    }

    // --- FUNÇÃO 2: DETECTAR POR ÁUDIO (10 SEGUNDOS CRONOMETRADOS) ---
    async function iniciarIdentificacaoPorAudio() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("Seu navegador não suporta captura de áudio pelo microfone.");
            return;
        }

        try {
            statusAudio.textContent = "Aguardando permissão...";
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            btnAudio.classList.add("gravando");
            
            let tempoRestante = 10;
            statusAudio.textContent = `Ouvindo ambiente... ${tempoRestante}s`;

            // Cronômetro progressivo na tela
            const cronometro = setInterval(() => {
                tempoRestante--;
                if (tempoRestante > 0) {
                    statusAudio.textContent = `Ouvindo ambiente... ${tempoRestante}s`;
                } else {
                    clearInterval(cronometro);
                }
            }, 1000);

            const mediaRecorder = new MediaRecorder(stream);
            let chunks = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                statusAudio.textContent = "Analisando frequências...";
                
                const audioBlob = new Blob(chunks, { type: 'audio/mp3' });
                const formData = new FormData();
                formData.append('file', audioBlob);
                formData.append('api_token', 'test'); 

                try {
                    const resposta = await fetch('https://api.audd.io/', {
                        method: 'POST',
                        body: formData
                    });

                    const resultado = await resposta.json();

                    if (resultado.status === 'success' && resultado.result) {
                        const musicaEncontrada = resultado.result;
                        statusAudio.style.color = "#10b981"; // Verde sucesso
                        statusAudio.textContent = "Música identificada!";
                        
                        const inputMusica = document.getElementById("nomeMusica");
                        if (inputMusica) {
                            inputMusica.value = `${musicaEncontrada.artist} - ${musicaEncontrada.title}`;
                            buscarMusica(); 
                        }
                    } else {
                        statusAudio.style.color = "#ef4444"; // Vermelho erro
                        statusAudio.textContent = "Não reconhecida.";
                        alert("Não consegui capturar a assinatura digital da música. Deixe o som mais perto do microfone.");
                    }
                } catch (erroApi) {
                    console.error("Erro na identificação:", erroApi);
                    statusAudio.textContent = "Erro no servidor.";
                } finally {
                    stream.getTracks().forEach(track => track.stop());
                    btnAudio.classList.remove("gravando");
                    setTimeout(() => { 
                        statusAudio.textContent = ""; 
                        statusAudio.style.color = "#9ca3af"; // Reseta cor padrão
                    }, 4000);
                }
            };

            mediaRecorder.start();
            
            // Para a gravação cravado em 10 segundos
            setTimeout(() => {
                if (mediaRecorder.state === "recording") {
                    mediaRecorder.stop();
                }
            }, 10000);

        } catch (erroMicrofone) {
            console.warn("Acesso negado:", erroMicrofone);
            statusAudio.textContent = "";
            btnAudio.classList.remove("gravando");
            alert("Permita o acesso ao microfone para usar o detector.");
        }
    }
});