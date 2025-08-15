// in controllers/crimeController.js

const crimes = require('../storage/crimes.json');

// --- NEW: Import our new utility functions ---
const { formatCrimeDate } = require('../utils/dateFormatter');
const { summarizeDescription } = require('../utils/summarizer');

exports.getCrimes = (req, res) => {
  try {
    // Step 1: Sort the crimes (unchanged)
    const sortedCrimes = crimes.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Step 2: Handle pagination (unchanged)
    const offset = parseInt(req.query.offset) || 0;
    const limit = 3;
    const paginatedCrimes = sortedCrimes.slice(offset, offset + limit);
    const nextOffset = (offset + limit < sortedCrimes.length) ? (offset + limit) : null;

    // --- NEW: Transform the data before sending it ---
    // Step 3: Use the .map() method to create a new array of formatted crime objects.
    // For each raw crime object, we create a new, cleaner object.
    const formattedCrimes = paginatedCrimes.map(crime => {
      // Use our date formatter utility
      const { date, timeOfDay } = formatCrimeDate(crime.date);
      
      // Use our summarizer utility
      const summary = summarizeDescription(crime.description);

      // Return the new, clean object that the frontend needs
      return {
        id: crime.id,
        type: crime.type,
        summary: summary,
      date: date,
        timeOfDay: timeOfDay,
      };
    });
    
    // Step 4: Send the newly formatted data back.
    res.status(200).json({
      message: "Crimes fetched and formatted successfully",
      crimes: formattedCrimes, // Send the clean, formatted crimes
      nextOffset: nextOffset
    });

  } catch (error) {
    console.error("Error fetching and formatting crimes:", error);
    res.status(500).json({
      message: "Error processing crimes",
      error: error.message
    });
  }
};