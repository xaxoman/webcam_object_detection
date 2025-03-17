// DOM elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const detectionList = document.getElementById('detection-list');

// Canvas context
const ctx = canvas.getContext('2d');

// Check if device is mobile
const isMobile = window.matchMedia("(max-width: 768px)").matches;
console.log("Is mobile device:", isMobile);

// Variables
let stream = null;
let isRunning = false;
let model = null;
let detectionInterval = null;

// Initialize
async function init() {
    startButton.disabled = false;
    stopButton.disabled = true;
    
    try {
        console.log('Loading COCO-SSD model...');
        // Load COCO-SSD model with a more accurate base model
        model = await cocoSsd.load({
            base: 'mobilenet_v2'  // Options: 'mobilenet_v1', 'mobilenet_v2', 'lite_mobilenet_v2'
        });
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Failed to load model:', error);
        alert('Failed to load detection model. Please check console for errors.');
    }
}

// Start camera stream
async function startCamera() {
    try {
        console.log('Accessing camera...');
        stream = await navigator.mediaDevices.getUserMedia({
            video: { 
                facingMode: 'environment',
                width: { ideal: 640 },
                height: { ideal: 480 }
            },
            audio: false
        });
        
        video.srcObject = stream;
        
        // Wait for video to be loaded
        video.onloadedmetadata = () => {
            // Set canvas dimensions to match video
            resizeCanvas();
            startButton.disabled = true;
            stopButton.disabled = false;
            isRunning = true;
            
            console.log('Camera started, beginning detection');
            // Start detection loop instead of interval for better performance
            requestAnimationFrame(detectLoop);
        };
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Could not access the camera. Please ensure you have given permission.');
    }
}

// Resize canvas to match current video dimensions
function resizeCanvas() {
    if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    } else {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
}

// Handle window resize and orientation changes
function handleResize() {
    // Update mobile detection on resize
    const wasMobile = isMobile;
    const newIsMobile = window.matchMedia("(max-width: 768px)").matches;
    
    // If mobile status changed, reload the page to apply new settings
    if (wasMobile !== newIsMobile && isRunning) {
        // Stop camera before reload
        stopCamera();
        // Wait a moment then reload
        setTimeout(() => window.location.reload(), 500);
    }
    
    if (isRunning) {
        resizeCanvas();
    }
}

// Detection loop using requestAnimationFrame for better performance
function detectLoop() {
    if (isRunning) {
        detectEntities();
        // Only request next frame if still running
        if (isRunning) {
            setTimeout(() => requestAnimationFrame(detectLoop), 100); // Adjust timing for performance
        }
    }
}

// Stop camera
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        isRunning = false;
        startButton.disabled = false;
        stopButton.disabled = true;
        
        // Clear detection interval
        if (detectionInterval) {
            clearInterval(detectionInterval);
        }
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Clear detection list
        if (detectionList) {
            detectionList.innerHTML = '<h3>Detected Entities:</h3><p>No entities detected</p>';
        }
        
        console.log('Camera stopped');
    }
}

// Detect entities in the video stream
async function detectEntities() {
    if (!isRunning || !model) return;
    
    try {
        // Check if video is ready
        if (video.readyState !== 4) return;
        
        console.log('Running detection...');
        // Get predictions
        const predictions = await model.detect(video, undefined, 0.5); // Set threshold to 0.5 (50% confidence)
        
        console.log('Predictions:', predictions);
        
        // Clear previous drawings
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Save the current transformation matrix
        ctx.save();
        
        // Apply mirror transformation only on desktop/laptop
        if (!isMobile) {
            // Apply mirror transformation for drawing (to match the CSS transform)
            ctx.scale(-1, 1);
            ctx.translate(-canvas.width, 0);
        }
        
        // Draw bounding boxes and labels
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 3;
        ctx.font = '18px Arial';
        
        // Update detection list
        if (detectionList) {
            detectionList.innerHTML = '<h3>Detected Entities:</h3>';
            
            if (predictions.length === 0) {
                detectionList.innerHTML += '<p>No entities detected</p>';
            }
        }
        
        // Process each prediction
        predictions.forEach(prediction => {
            // Draw bounding box
            const [x, y, width, height] = prediction.bbox;
            
            let drawX = x;
            // Calculate mirrored x position for desktop only
            if (!isMobile) {
                drawX = canvas.width - x - width; // Mirrored X position
            }
            
            ctx.strokeRect(drawX, y, width, height);
            
            // Draw label background
            const label = `${prediction.class} (${Math.round(prediction.score * 100)}%)`;
            const textWidth = ctx.measureText(label).width;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(drawX, y - 25, textWidth + 10, 25);
            
            // Draw label text
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(label, drawX + 5, y - 7);
            
            // Add to detection list
            if (detectionList) {
                const timestamp = new Date().toLocaleTimeString();
                detectionList.innerHTML += `<p><strong>${timestamp}</strong>: ${prediction.class} (${Math.round(prediction.score * 100)}% confidence)</p>`;
            }
        });
        
        // Restore the transformation matrix
        ctx.restore();
        
    } catch (error) {
        console.error('Error during detection:', error);
    }
}

// Event listeners
startButton.addEventListener('click', startCamera);
stopButton.addEventListener('click', stopCamera);
window.addEventListener('resize', handleResize);

// Listen for orientation changes
window.addEventListener('orientationchange', () => {
    // Wait for orientation change to complete
    setTimeout(handleResize, 200);
});

// Initialize when page loads
window.addEventListener('load', init);

// Debug message to verify script is loading correctly
console.log('Client.js loaded successfully');
