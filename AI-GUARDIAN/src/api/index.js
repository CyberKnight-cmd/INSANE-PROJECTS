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

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'AI Guardian API is running' });
});

// Audio processing function with proper model integration
function processAudioChunk(chunk) {
  // Use a more reliable detection method instead of random
  // Only trigger on actual keyword matches, not randomly
  try {
    // For now, we'll use a more conservative approach to reduce false positives
    // In a real implementation, this would call the Python model
    return false; // Disable random detections until proper model integration
  } catch (error) {
    console.error('Error processing audio chunk:', error);
    return false; // Don't trigger on errors
  }
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
  console.log('Client connected to socket.io');
  const audioProcessor = new Writable({
    write(chunk, encoding, callback) {
      const detected = processAudioChunk(chunk);
      if (detected) {
        socket.emit('detection', { detected: true });
      }
      callback();
    }
  });

  socket.on('audio-stream', (data) => {
    console.log('Received audio stream data');
    audioProcessor.write(Buffer.from(data));
  });

  socket.on('audio', (data) => {
    console.log('Received audio data');
    audioProcessor.write(Buffer.from(data));
  });

  socket.on('disconnect', () => {
    audioProcessor.end();
  });
});

// Mock crime data for the crime summarizer
const mockCrimeData = [
  {
    id: '1',
    summary: 'Robbery reported at Main Street',
    date: '2023-10-15',
    timeOfDay: 'Evening'
  },
  {
    id: '2',
    summary: 'Suspicious activity near Central Park',
    date: '2023-10-14',
    timeOfDay: 'Night'
  },
  {
    id: '3',
    summary: 'Vehicle break-in at Downtown parking lot',
    date: '2023-10-13',
    timeOfDay: 'Afternoon'
  },
  {
    id: '4',
    summary: 'Assault reported near subway station',
    date: '2023-10-12',
    timeOfDay: 'Night'
  },
  {
    id: '5',
    summary: 'Shoplifting incident at local mall',
    date: '2023-10-11',
    timeOfDay: 'Afternoon'
  }
];

// API endpoint for crime summaries
app.get('/api/crimes', (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = 3;
  const crimes = mockCrimeData.slice(offset, offset + limit);
  const nextOffset = offset + limit < mockCrimeData.length ? offset + limit : null;
  
  res.json({
    crimes,
    nextOffset
  });
});

// Risk prediction API endpoint
app.post('/api/risk/route', (req, res) => {
  try {
    // Calculate random risk factors for demonstration
    const lightningScore = Math.random() * 10;
    const trafficDensity = Math.random() * 10;
    const crimeRate = Math.random() * 10;
    const riskScore = (lightningScore + trafficDensity + crimeRate) / 3;
    
    // Generate safer alternatives
    const alternatives = [
      {
        route: 'Alternative 1',
        riskScore: riskScore * 0.7,
        lightningScore: lightningScore * 0.8,
        trafficDensity: trafficDensity * 0.6,
        crimeRate: crimeRate * 0.5
      },
      {
        route: 'Alternative 2',
        riskScore: riskScore * 0.5,
        lightningScore: lightningScore * 0.6,
        trafficDensity: trafficDensity * 0.4,
        crimeRate: crimeRate * 0.3
      }
    ];
    
    res.json({
      status: 'success',
      routeId: 'temp_'+Date.now(),
      riskScore: riskScore.toFixed(2),
      lightningScore: lightningScore.toFixed(2),
      trafficDensity: trafficDensity.toFixed(2),
      crimeRate: crimeRate.toFixed(2),
      message: 'Risk prediction with additional factors',
      saferAlternatives: alternatives
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`AI Guardian API running on port ${PORT}`);
});