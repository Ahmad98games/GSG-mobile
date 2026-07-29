const { getDefaultConfig } = require('./node_modules/expo/metro-config');
const config = getDefaultConfig(__dirname);

console.log('extraNodeModulesKeys:', Object.keys(config.resolver.extraNodeModules || {}));
console.log('platforms:', config.resolver.platforms);
console.log('has resolveRequest:', typeof config.resolver.resolveRequest);
