const textInput = document.getElementById('text-input');
const speakBtn = document.getElementById('speak-btn');
const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');
const stopBtn = document.getElementById('stop-btn');
const voiceSelect = document.getElementById('voice-select');
const rateInput = document.getElementById('rate');
const pitchInput = document.getElementById('pitch');
const rateValue = document.getElementById('rate-value');
const pitchValue = document.getElementById('pitch-value');
const status = document.getElementById('tts-status');

let utterance = null;
let voices = [];

function populateVoices() {
    voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = '';
    voices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

function speakText() {
    const text = textInput.value.trim();
    if (!text) return;
    if (speechSynthesis.speaking) speechSynthesis.cancel();

    utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices[voiceSelect.value];
    utterance.rate = rateInput.value;
    utterance.pitch = pitchInput.value;

    utterance.onstart = () => {status.textContent = "🔊 Speaking...";}
    utterance.onend = () => {status.textContent = "✅ Finished.";}
    utterance.onerror = () => {status.textContent = "⚠️ Error speaking text.";}
    utterance.onpause = () => {status.textContent = "⏸️ Paused.";}
    utterance.onresume = () => {status.textContent = "▶️ Resumed.";}

    speechSynthesis.speak(utterance);
}

function pauseSpeech() {
    if (speechSynthesis.speaking) {
        speechSynthesis.pause();
        status.textContent = "⏸️ Paused.";
    }
}

function resumeSpeech() {
    if (speechSynthesis.paused) {
        speechSynthesis.resume();
        status.textContent = "▶️ Resumed.";
    }
}

function stopSpeech() {
    speechSynthesis.cancel();
    status.textContent = "🛑 Stopped.";
}

// Update rate and pitch values
rateInput.addEventListener('input', () => {
    rateValue.textContent = rateInput.value;
});
pitchInput.addEventListener('input', () => {
    pitchValue.textContent = pitchInput.value;
});

// Populate voices on load
speechSynthesis.addEventListener('voiceschanged', populateVoices);
populateVoices();

// Button event listeners
speakBtn.addEventListener('click', speakText);
pauseBtn.addEventListener('click', pauseSpeech);
resumeBtn.addEventListener('click', resumeSpeech);
stopBtn.addEventListener('click', stopSpeech);
