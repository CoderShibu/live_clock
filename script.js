// Theme management
const root = document.documentElement;
const html = document.querySelector('html');
let isDark = false;

function toggleTheme() {
    isDark = !isDark;
    html.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.querySelector('.theme-toggle i').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    drawClock(); // Redraw clock with new theme colors
}

// Function to change theme color dynamically
function changeColor() {
    const colors = [
        { primary: '#4a90e2', secondary: '#f39c12' },
        { primary: '#2ecc71', secondary: '#e74c3c' },
        { primary: '#9b59b6', secondary: '#f1c40f' },
        { primary: '#e74c3c', secondary: '#3498db' }
    ];
    const newColors = colors[Math.floor(Math.random() * colors.length)];
    root.style.setProperty('--primary-color', newColors.primary);
    root.style.setProperty('--secondary-color', newColors.secondary);
}

// Function to update live digital clock with animation
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const clockElement = document.getElementById("clock");
    
    if (clockElement.innerText !== timeString) {
        clockElement.style.transform = "scale(1.1)";
        clockElement.innerText = timeString;
        setTimeout(() => {
            clockElement.style.transform = "scale(1)";
        }, 100);
    }
}

// Function to draw an enhanced analog clock
function drawClock() {
    const canvas = document.getElementById("analogClock");
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Get current time
    const now = new Date();
    const sec = now.getSeconds();
    const min = now.getMinutes();
    const hr = now.getHours();

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set colors based on theme
    const faceColor = getComputedStyle(root).getPropertyValue('--bg-color');
    const borderColor = getComputedStyle(root).getPropertyValue('--clock-border');
    const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color');
    const secondaryColor = getComputedStyle(root).getPropertyValue('--secondary-color');

    // Draw clock face
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = faceColor;
    ctx.fill();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 8;
    ctx.stroke();

    // Draw hour markers
    for (let i = 0; i < 12; i++) {
        const angle = (i * 30) * Math.PI / 180;
        const markerLength = i % 3 === 0 ? 20 : 10;
        
        ctx.beginPath();
        ctx.lineWidth = i % 3 === 0 ? 4 : 2;
        ctx.strokeStyle = primaryColor;
        ctx.moveTo(
            centerX + (radius - markerLength) * Math.cos(angle),
            centerY + (radius - markerLength) * Math.sin(angle)
        );
        ctx.lineTo(
            centerX + radius * 0.9 * Math.cos(angle),
            centerY + radius * 0.9 * Math.sin(angle)
        );
        ctx.stroke();
    }

    // Draw hands
    // Hour hand
    drawHand(ctx, centerX, centerY, radius * 0.5, (hr % 12) * 30 + min * 0.5, 8, primaryColor);
    
    // Minute hand
    drawHand(ctx, centerX, centerY, radius * 0.7, min * 6, 4, primaryColor);
    
    // Second hand
    drawHand(ctx, centerX, centerY, radius * 0.8, sec * 6, 2, secondaryColor);

    // Draw center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = secondaryColor;
    ctx.fill();
}

// Helper function to draw clock hands
function drawHand(ctx, centerX, centerY, length, angle, width, color) {
    const radian = (angle - 90) * Math.PI / 180;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
        centerX + length * Math.cos(radian),
        centerY + length * Math.sin(radian)
    );
    ctx.stroke();
}

// Update clocks every second
setInterval(updateClock, 1000);
setInterval(drawClock, 1000);
updateClock();
drawClock();