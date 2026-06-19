// Metro config for use inside the Tasiki pnpm monorepo.
// Lets the app resolve workspace packages (e.g. @tasiki/shared) and the
// hoisted dependencies that live in the repo-root node_modules.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Watch the whole monorepo so changes to shared packages are picked up.
config.watchFolders = [workspaceRoot];

// Resolve modules from both the app and the workspace root.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
