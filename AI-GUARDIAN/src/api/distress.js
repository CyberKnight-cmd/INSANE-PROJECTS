const express = require('express');
const multer = require('multer');
const { Writable } = require('stream');
const { spawn } = require('child_process');
const cors = require('cors');

const app = express();
const upload = multer();

// Enable CORS
app.use(cors());
app.use(express.json());

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

// Load environment variables
require('dotenv').config();

// Initialize Twilio client
const twilio = require('twilio');
let twilioClient = null;

// Only initialize Twilio if credentials are properly set
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log('Twilio client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Twilio client:', error.message);
  }
} else {
  console.log('Twilio credentials not found in environment variables');
}

// SMS sending endpoint
app.post('/send-sos', async (req, res) => {
  try {
    const { contactNumber, contactName, location, message } = req.body;
    
    if (!contactNumber) {
      return res.status(400).json({ success: false, message: 'Contact number is required' });
    }
    
    const sosMessage = `SOS ALERT from AI Guardian: ${message || 'I need help! Please check on me.'} Location: ${location || 'Unknown'}`;
    
    console.log(`SOS ALERT: Sending message to ${contactName || 'Emergency Contact'} at ${contactNumber}`);
    console.log(`Message: ${sosMessage}`);
    
    // Send SMS using Twilio if credentials are available
    if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      try {
        await twilioClient.messages.create({
          body: sosMessage,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: contactNumber
        });
        console.log('SMS sent successfully via Twilio');
      } catch (twilioError) {
        console.error('Twilio SMS sending error:', twilioError);
        // Continue execution even if Twilio fails
      }
    } else {
      console.log('Twilio credentials not available, SMS simulation only');
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'SOS message sent successfully' 
    });
  } catch (error) {
    console.error('Error sending SOS message:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send SOS message' 
    });
  }
});

// WebSocket endpoint for continuous streaming
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

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

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Distress SOS API running on port ${PORT}`);
});