
  const input = document.querySelector("input");
  const para = document.getElementById("definition");
  const playBtn = document.getElementById("play-audio");
  let audio = null;

  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      const word = input.value.trim();
      if (!word) return;

      para.textContent = "Searching...";
      playBtn.style.display = "none";

      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Word not found");
          }
          return response.json();
        })
        .then(data => {
          const definition = data[0].meanings[0].definitions[0].definition;
          para.textContent = `"${word}": ${definition}`;

          const audioData = data[0].phonetics.find(p => p.audio);
          if (audioData && audioData.audio) {
            audio = new Audio(audioData.audio);
            playBtn.style.display = "inline-block";
          } else {
            playBtn.style.display = "none";
          }
        })
        .catch(err => {
          para.textContent = "No definition found.";
        });
    }
  });

  playBtn.addEventListener("click", function () {
    if (audio) {
      audio.play().catch(e => console.warn("Couldn't play audio:", e));
    }
  });

