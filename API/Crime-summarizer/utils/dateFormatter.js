// in utils/dateFormatter.js

// This function takes a date string and returns a formatted date and time of day.
exports.formatCrimeDate = (dateString) => {
  // Create a Date object from the string.
  const date = new Date(dateString);

  // Format the date part into a readable string like "Jul 22, 2025".
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Get the hour of the day (0-23).
  const hour = date.getHours();

  let timeOfDay;

  // Categorize the hour into a time of day.
  if (hour >= 5 && hour < 12) {
    timeOfDay = 'Morning';
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'Afternoon';
  } else if (hour >= 17 && hour < 21) {
    timeOfDay = 'Evening';
  } else {
    timeOfDay = 'Night'; // Covers hours from 9 PM to 5 AM
  }

  // Return an object containing both pieces of formatted information.
  return {
    date: formattedDate,
    timeOfDay: timeOfDay,
  };
};