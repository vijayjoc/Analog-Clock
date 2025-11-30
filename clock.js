const canvas = document.getElementById('clock');
const ctx = canvas.getContext('2d');
const radius = canvas.width / 2;
ctx.translate(radius, radius); // Move origin to center
const clockRadius = radius * 0.90;

const digital = document.getElementById('digital');
let timezoneOffset = 0;

document.getElementById('timezone').addEventListener('change', e => {
    timezoneOffset = parseTimezoneOffset(e.target.value);
});

function parseTimezoneOffset(tz) {
    if (tz === "UTC") return 0;
    const match = tz.match(/GMT([+-]\d+)(?::(\d+))?/);
    if (!match) return 0;
    const hours = parseInt(match[1]);
    const minutes = match[2] ? parseInt(match[2]) : 0;
    return hours + minutes / 60;
}

function drawClock() {
    ctx.clearRect(-radius, -radius, canvas.width, canvas.height);
    drawFace();
    drawNumbers();
    drawTicks();
    drawHands();
    drawDigitalTime();
    requestAnimationFrame(drawClock);
}

// Clock Face with Day/Night Gradient
function drawFace() {
    const now = new Date();
    const h = (now.getUTCHours() + timezoneOffset + 24) % 24;

    const grad = ctx.createRadialGradient(0, 0, clockRadius*0.05, 0, 0, clockRadius);
    if (h >= 6 && h < 18) {
        grad.addColorStop(0, '#fff');  // Day
        grad.addColorStop(1, '#ddd');
    } else {
        grad.addColorStop(0, '#333');  // Night
        grad.addColorStop(1, '#000');
    }

    ctx.beginPath();
    ctx.arc(0, 0, clockRadius, 0, 2*Math.PI);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.lineWidth = clockRadius*0.05;
    ctx.strokeStyle = '#333';
    ctx.stroke();

    // Center
    ctx.beginPath();
    ctx.arc(0, 0, clockRadius*0.05, 0, 2*Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
}

// Draw Numbers 1–12
function drawNumbers() {
    ctx.font = clockRadius * 0.15 + "px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = '#222';
    for(let num = 1; num <= 12; num++){
        const angle = num * Math.PI / 6 - Math.PI/2;
        const x = Math.cos(angle) * clockRadius * 0.75;
        const y = Math.sin(angle) * clockRadius * 0.75;
        ctx.fillText(num.toString(), x, y);
    }
}

// Tick Marks
function drawTicks() {
    for(let i=0; i<60; i++){
        const angle = i * Math.PI/30 - Math.PI/2;
        const inner = (i%5===0) ? clockRadius*0.85 : clockRadius*0.9;
        const outer = clockRadius;

        ctx.beginPath();
        ctx.moveTo(inner * Math.cos(angle), inner * Math.sin(angle));
        ctx.lineTo(outer * Math.cos(angle), outer * Math.sin(angle));
        ctx.lineWidth = (i%5===0) ? 4 : 2;
        ctx.strokeStyle = (i%5===0) ? '#222' : '#555';
        ctx.stroke();
    }
}

// Hands with shadow
function drawHands() {
    const now = new Date();
    let h = (now.getUTCHours() + timezoneOffset + 24) % 24;
    const m = now.getUTCMinutes();
    const s = now.getUTCSeconds();
    const ms = now.getUTCMilliseconds();

    const hourAngle = ((h%12) + m/60 + s/3600) * Math.PI/6;
    const minuteAngle = (m + s/60 + ms/60000) * Math.PI/30;
    const secondAngle = (s + ms/1000) * Math.PI/30;

    drawHand(hourAngle, clockRadius*0.5, 8, '#333', 4);
    drawHand(minuteAngle, clockRadius*0.7, 5, '#333', 3);
    drawHand(secondAngle, clockRadius*0.85, 2, 'red', 2);
}

function drawHand(angle, length, width, color='#333', shadow=0){
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = shadow;
    ctx.moveTo(0,0);
    ctx.lineTo(length,0);
    ctx.stroke();
    ctx.restore();
}

// Digital Time HH:MM:SS
function drawDigitalTime(){
    const now = new Date();
    let h = (now.getUTCHours() + timezoneOffset + 24) % 24;
    const m = now.getUTCMinutes();
    const s = now.getUTCSeconds();
    digital.textContent = `${padZero(h)}:${padZero(m)}:${padZero(s)}`;
}

function padZero(num){ return num.toString().padStart(2,'0'); }

drawClock();
