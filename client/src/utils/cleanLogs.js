// Simple script to clean remaining console.log statements
// Run this in browser console if needed

// Find all console.log statements in the codebase
const removeConsoleLog = (text) => {
  return text.replace(/console\.log\([^)]+\);?\n?/g, '');
};

// This is just for reference - the main fixes are already applied