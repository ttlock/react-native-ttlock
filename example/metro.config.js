const path = require('path');
const {getDefaultConfig} = require('@react-native/metro-config');

const projectRoot = __dirname;
const appNodeModules = path.resolve(projectRoot, 'node_modules');

const config = getDefaultConfig(projectRoot);

// 仅覆写解析相关，保留默认的 transformer/serializer（包含资源管线）
config.watchFolders = [path.resolve(projectRoot, '..')];
config.resolver.nodeModulesPaths = [appNodeModules];
config.resolver.disableHierarchicalLookup = true;
config.resolver.extraNodeModules = {
  'react-native': path.resolve(appNodeModules, 'react-native'),
  react: path.resolve(appNodeModules, 'react'),
  'react-native-ttlock': path.resolve(projectRoot, '..'),
};

module.exports = config;
