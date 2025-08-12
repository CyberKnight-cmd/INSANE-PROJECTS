const express = require('express');
const multer = require('multer');
const { Writable } = require('stream');
const { spawn } = require('child_process');

const app = express();
const upload = multer();

// Audio processing function (replace with actual model integration)
function processAudioChunk(chunk) {
  // This would interface with your ML model
  return Math.random() > 0.8; // Simulating detection
}

app.post('/detect-distress', upload.single('audio'), (req, res) => {
  const audioStream = new Writable({
    write(chunk, encoding, callback) {
      // Process each chunk in real-time
      const detected = processAudioChunk(chunk);
      
      if (detected) {
        res.json({ detected: true });
        // End the request if code word is detected
        req.destroy();
      }
      callback();
    }
  });

  // If no detection after full stream
  req.file.stream.on('end', () => {
    if (!res.headersSent) {
      res.json({ detected: false });
    }
  });

  // Pipe audio to processor
  req.file.stream.pipe(audioStream);
});

// WebSocket endpoint for continuous streaming
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  const audioProcessor = new Writable({
    write(chunk, encoding, callback) {
      const detected = processAudioChunk(chunk);
      if (detected) {
        socket.emit('detection', { detected: true });
      }
      callback();
    }
  });

  socket.on('audio', (data) => {
    audioProcessor.write(Buffer.from(data));
  });

  socket.on('disconnect', () => {
    audioProcessor.end();
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Distress SOS API running on port ${PORT}`);
});