const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('traineddata');

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    if (moduleName === 'react-native') {
      const res = context.resolveRequest(context, 'react-native-web', platform);
      return res;
    }
    if (moduleName === 'react-native/Libraries/StyleSheet/processColor') {
      return context.resolveRequest(context, 'react-native-web/dist/exports/processColor', platform);
    }
    if (moduleName === 'react-native/Libraries/Image/resolveAssetSource') {
      return {
        filePath: path.resolve(__dirname, 'src/lib/empty-mock.js'),
        type: 'sourceFile',
      };
    }
    if (moduleName === 'expo-sqlite') {
      return {
        filePath: path.resolve(__dirname, 'src/lib/sqlite-mock.web.ts'),
        type: 'sourceFile',
      };
    }
    if (moduleName === 'react-native-quick-crypto') {
      return {
        filePath: path.resolve(__dirname, 'src/lib/quick-crypto-mock.web.ts'),
        type: 'sourceFile',
      };
    }
    if (moduleName === 'react-native-tcp-socket') {
      return {
        filePath: path.resolve(__dirname, 'src/lib/tcp-socket-mock.web.ts'),
        type: 'sourceFile',
      };
    }
    if (moduleName === 'react-native-zeroconf') {
      return {
        filePath: path.resolve(__dirname, 'src/lib/zeroconf-mock.web.ts'),
        type: 'sourceFile',
      };
    }
    if (moduleName === 'react-native-nitro-modules') {
      return {
        filePath: path.resolve(__dirname, 'src/lib/empty-mock.js'),
        type: 'sourceFile',
      };
    }
    if (moduleName === '@notifee/react-native') {
      return {
        filePath: path.resolve(__dirname, 'src/lib/notifications/notifee/index.web.ts'),
        type: 'sourceFile',
      };
    }
    if (moduleName === 'react-native-fs') {
      return {
        filePath: path.resolve(__dirname, 'src/lib/empty-mock.js'),
        type: 'sourceFile',
      };
    }
    if (moduleName === 'react-native-view-shot') {
      return {
        filePath: path.resolve(__dirname, 'src/lib/empty-mock.js'),
        type: 'sourceFile',
      };
    }
    
    let resolved;
    try {
      if (originalResolveRequest) {
        resolved = originalResolveRequest(context, moduleName, platform);
      } else {
        resolved = context.resolveRequest(context, moduleName, platform);
      }
    } catch (err) {
      if (
        moduleName.includes('NativeComponent/BaseViewConfig') ||
        moduleName.endsWith('./BaseViewConfig') ||
        moduleName.includes('PlatformColorValueTypes') ||
        moduleName.endsWith('./PlatformColorValueTypes') ||
        moduleName.includes('Utilities/Platform') ||
        moduleName.endsWith('./Platform')
      ) {
        console.log(`[RESOLVER] Mocking failed import: ${moduleName}`);
        return {
          filePath: path.resolve(__dirname, 'src/lib/empty-mock.js'),
          type: 'sourceFile',
        };
      }
      throw err;
    }

    if (resolved && resolved.filePath && resolved.filePath.includes('node_modules\\react-native\\')) {
      console.log(`[RESOLVER] Native resolution: ${moduleName} -> ${resolved.filePath}`);
    }
    return resolved;
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
