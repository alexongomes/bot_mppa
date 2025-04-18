const textAreas = [
  document.getElementById("pergunta"),
  document.getElementById("resposta"),
];
//Como o mppa atua para garantir os direitos do cidadão?
textAreas.forEach((textArea) => {
  console.log(document.getElementById("pergunta").value);
  textArea.addEventListener("input", function () {
    if (textArea.id === "pergunta") {
      console.log(document.getElementById("pergunta").value);
      resposta();
    } else if (textArea.id === "resposta") {
      textToSpeech();
    }
  });
});

async function iniciaGravacao() {
  const status = document.getElementById("status");
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Seu navegador não suporta gravação de áudio.");
    return;
  }

  try {
    // Solicita permissão do usuário para acessar o microfone
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.webm");

      status.innerText = "Enviando áudio...";
      //console.log("Enviando áudio...");

      try {
        const response = await fetch("speechtotext", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Erro ao enviar áudio: ${response.statusText}`);
        }

        const data = await response.json();
        const perguntaTextarea = document.getElementById("pergunta");

        // Altera o valor do textarea "pergunta"
        perguntaTextarea.value = data.text || "Erro na transcrição";
        document.getElementById("perguntaDigitada").value =
          data.text || "Erro na transcrição";

        // Dispara o evento "input" após a alteração
        perguntaTextarea.dispatchEvent(new Event("input"));
      } catch (error) {
        console.error("Erro na requisição: ", error);
        const perguntaTextarea = document.getElementById("pergunta");
        perguntaTextarea.value = "Erro ao processar áudio";
        perguntaTextarea.dispatchEvent(new Event("input"));
      }
    };

    mediaRecorder.start();
    status.innerText = "Gravando por 5 segundos...";

    setTimeout(() => {
      mediaRecorder.stop();
      stream.getTracks().forEach((track) => track.stop());
    }, 5000);
  } catch (error) {
    console.error("Erro ao acessar o microfone: ", error);
    alert("Erro ao acessar o microfone. Verifique as permissões do navegador.");
  }
}

async function resposta() {
  try {
    const message = document.getElementById("pergunta").value;
    console.log(message);
    const response2 = await fetch("/api/text/resposta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response2.ok) {
      const errorData = await response2.json();
      throw new Error(errorData.error || "Erro desconhecido na API");
    }

    const data2 = await response2.text();

    // Modifica o valor do textarea "resposta"
    const respostaTextarea = document.getElementById("resposta");
    respostaTextarea.value = data2 || "Erro na resposta";

    // Dispara o evento "input" após a alteração
    respostaTextarea.dispatchEvent(new Event("input"));
  } catch (error) {
    console.error("Erro:", error.message);
    alert("Erro: " + error.message);
  }
}

async function textToSpeech() {
  console.log("ok1");
  const text = document.getElementById("resposta").value;
  const response = await fetch("/speak", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  console.log("ok2");
  if (response.ok) {
    const audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.src = URL.createObjectURL(await response.blob());
    audioPlayer.play();
    status.innerText = "Respondendo...";
  } else {
    alert("Erro ao gerar áudio.");
  }
}

async function gerarImagem(params) {
  let descricao = document.getElementById("imagedescription").value;
  let resposta = await fetch("/generate", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "descricao=" + encodeURIComponent(descricao),
  });
  let dados = await resposta.json();
  document.getElementById("imagemGerada").src = dados.url;
}
