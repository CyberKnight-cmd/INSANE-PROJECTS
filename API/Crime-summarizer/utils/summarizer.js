// in utils/summarizer.js

// The maximum length we want our summary to be.
const MAX_LENGTH = 100;

// This function takes a long description and returns a short, clean summary.
exports.summarizeDescription = (description) => {
  // First, check if the description is already short enough.
  if (description.length <= MAX_LENGTH) {
    return description;
  }

  // If it's too long, trim it to the max length.
  let trimmedString = description.substring(0, MAX_LENGTH);

  // Then, find the last space in the trimmed string.
  // This is to avoid cutting off a word in the middle.
  const lastSpaceIndex = trimmedString.lastIndexOf(' ');

  // If we found a space, cut the string at that point.
  if (lastSpaceIndex > 0) {
    trimmedString = trimmedString.substring(0, lastSpaceIndex);
  }

  // Finally, add "..." to the end to show that the text has been shortened.
  return trimmedString + '...';
};