const video = document.getElementById("webcam");
const matrixContainer = document.getElementById("matrix");

async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (error) {
        console.error("Errore nell'accesso alla webcam:", error);
    }
}

function generateMatrix() {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const asciiMatrix = convertImageDataToAscii(imageData, canvas.width, canvas.height);

    matrixContainer.textContent = asciiMatrix;
}

function convertImageDataToAscii(imageData, width, height) {
    const characters = "@B%8WM#*oahkbdpwmZO0QCJYXzcvnxrjft/\|()1{}[]-_+~<>i!lI;:,";

    let asciiMatrix = "";

    for (let y = 0; y < height; y += 6) {
        for (let x = 0; x < width; x += 3) {
            const pixelIndex = (y * width + x) * 4;
            const r = imageData.data[pixelIndex];
            const g = imageData.data[pixelIndex + 1];
            const b = imageData.data[pixelIndex + 2];
            const grayscale = (r + g + b) / 3;
            const charIndex = Math.floor((grayscale / 255) * (characters.length - 1));
            asciiMatrix += characters.charAt(charIndex);
        }
        asciiMatrix += "\n";
    }

    return asciiMatrix;
}

setupCamera().then(() => {
    video.play();
    setInterval(generateMatrix, 100); 
});
