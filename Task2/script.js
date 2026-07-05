const display = document.getElementById("display");

const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const lapBtn = document.getElementById("lap");

const lapList = document.getElementById("lapList");

let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let running = false;
let lapCount = 0;

function formatTime(ms) {

    const hours = Math.floor(ms / 3600000);

    const minutes = Math.floor(
        (ms % 3600000) / 60000
    );

    const seconds = Math.floor(
        (ms % 60000) / 1000
    );

    const centiseconds = Math.floor(
        (ms % 1000) / 10
    );

    return (
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0") +
        "." +
        String(centiseconds).padStart(2, "0")
    );
}

function updateDisplay() {
    display.textContent = formatTime(elapsedTime);
}

function updateButtons() {

    if (!running && elapsedTime === 0) {
        startBtn.textContent = "Start";

        startBtn.disabled = false;
        pauseBtn.disabled = true;
        lapBtn.disabled = true;
        resetBtn.disabled = true;
    }

    else if (running) {
        startBtn.textContent = "Running";

        startBtn.disabled = true;
        pauseBtn.disabled = false;
        lapBtn.disabled = false;
        resetBtn.disabled = true;
    }

    else {
        startBtn.textContent = "Resume";

        startBtn.disabled = false;
        pauseBtn.disabled = true;
        lapBtn.disabled = true;
        resetBtn.disabled = false;
    }
}

function startStopwatch() {

    if (running) return;

    startTime = Date.now() - elapsedTime;

    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        updateDisplay();
    }, 10);

    running = true;

    updateButtons();
}

function pauseStopwatch() {

    clearInterval(timerInterval);

    running = false;

    updateButtons();
}

function resetStopwatch() {

    clearInterval(timerInterval);

    running = false;
    elapsedTime = 0;
    lapCount = 0;

    lapList.innerHTML = "";

    updateDisplay();

    updateButtons();
}

function addLap() {

    if (!running) return;

    lapCount++;

    const li = document.createElement("li");

    li.textContent =
        `Lap ${lapCount} — ${formatTime(elapsedTime)}`;

    lapList.prepend(li);
}

startBtn.addEventListener("click", startStopwatch);

pauseBtn.addEventListener("click", pauseStopwatch);

resetBtn.addEventListener("click", resetStopwatch);

lapBtn.addEventListener("click", addLap);

document.addEventListener("keydown", (event) => {

    if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
    ) {
        return;
    }

    if (event.code === "Space") {

        event.preventDefault();

        if (running) {
            pauseStopwatch();
        } else {
            startStopwatch();
        }
    }

    if (event.key.toLowerCase() === "l") {
        addLap();
    }

    if (event.key.toLowerCase() === "r") {
        resetStopwatch();
    }
});

updateDisplay();

updateButtons();