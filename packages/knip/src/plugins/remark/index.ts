import { basename } from '../../util/path.js';
import { timerify } from '../../util/Performance.js';
import { hasDependency, load } from '../../util/plugin.js';
import type { RemarkConfig } from './types.js';
import type { IsPluginEnabledCallback, GenericPluginCallback } from '../../types/plugins.js';

// https://github.com/remarkjs/remark/blob/main/packages/remark-cli/readme.md

const NAME = 'Remark';

const ENABLERS = ['remark-cli'];

const isEnabled: IsPluginEnabledCallback = ({ dependencies }) => hasDependency(dependencies, ENABLERS);

const PACKAGE_JSON_PATH = 'remarkConfig';

const CONFIG_FILE_PATTERNS = [
  'package.json',
  '.remarkrc',
  '.remarkrc.json',
  '.remarkrc.{js,cjs,mjs}',
  '.remarkrc.{yml,yaml}',
];

const findRemarkDependencies: GenericPluginCallback = async (configFilePath, options) => {
  const { manifest, isProduction } = options;

  if (isProduction) return [];

  const localConfig: RemarkConfig | undefined =
    basename(configFilePath) === 'package.json' ? manifest[PACKAGE_JSON_PATH] : await load(configFilePath);

  if (!localConfig) return [];

  const plugins =
    localConfig.plugins
      ?.flatMap(plugin => {
        if (typeof plugin === 'string') return plugin;
        if (Array.isArray(plugin) && typeof plugin[0] === 'string') return plugin[0];
        return [];
      })
      .map(plugin => (plugin.startsWith('remark-') ? plugin : `remark-${plugin}`)) ?? [];
  return plugins;
};

const findDependencies = timerify(findRemarkDependencies);

export default {
  NAME,
  ENABLERS,
  isEnabled,
  PACKAGE_JSON_PATH,
  CONFIG_FILE_PATTERNS,
  findDependencies,
};
