const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Allow ".cjs" files for Firebase compatibility with Expo SDK 53
config.resolver.sourceExts = config.resolver.sourceExts || [];
if (!config.resolver.sourceExts.includes("cjs")) {
  config.resolver.sourceExts.push("cjs");
}

// Disable the new "package.json exports" resolution for better compatibility
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
