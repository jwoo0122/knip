import { timerify } from '../../util/Performance.js';
import { hasDependency, load } from '../../util/plugin.js';
import type { CSpellConfig } from './types.js';
import type { IsPluginEnabledCallback, GenericPluginCallback } from '../../types/plugins.js';

// https://github.com/streetsidesoftware/cspell/tree/main/packages/cspell#customization

const NAME = 'cspell';

const ENABLERS = ['cspell'];

const isEnabled: IsPluginEnabledCallback = ({ dependencies }) => hasDependency(dependencies, ENABLERS);

const CONFIG_FILE_PATTERNS = [
  'cspell.config.{js,cjs,json,yaml,yml}',
  'cspell.{json,yaml,yml}',
  '.c{s,S}pell.json',
  'cSpell.json',
];

const findCspellDependencies: GenericPluginCallback = async (configFilePath, { isProduction }) => {
  if (isProduction) return [];

  const localConfig: CSpellConfig | undefined = await load(configFilePath);

  if (!localConfig) return [];

  const imports = localConfig.import ?? [];
  return imports;
};

const findDependencies = timerify(findCspellDependencies);

export default {
  NAME,
  ENABLERS,
  isEnabled,
  CONFIG_FILE_PATTERNS,
  findDependencies,
};
