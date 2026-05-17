const { getDefaultConfig } = require('expo/metro-config');

// Temporarily disable nativewind's metro plugin to avoid a file-watcher crash
// that causes Metro to throw `Cannot read properties of undefined (reading 'addedFiles')`.
// Re-enable when nativewind watcher is fixed or upgraded.
const config = getDefaultConfig(__dirname);

module.exports = config;
