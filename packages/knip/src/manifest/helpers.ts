import type { Scripts } from '../types/package-json.js';
import { _require } from '../util/require.js';
import { promises as fs, existsSync } from 'fs';

type LoadPackageManifestOptions = { dir: string; packageName: string; cwd: string };

export const loadPackageManifest = async ({ dir, packageName, cwd }: LoadPackageManifestOptions) => {
  try {
    // Get the main entry file of the package
    const packageEntryPath = _require.resolve(packageName, { paths: [dir, cwd] });
    
    // Replace the last occurrence of packageName with package.json
    const manifestPath = packageEntryPath.replace(new RegExp(`${packageName}[^${packageName}]*$`), `${packageName}/package.json`);

    if (existsSync(manifestPath)) {
      return JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    }

    throw new Error(`package.json not found for ${packageName}`);
  } catch {
    try {
      // Get the main entry file of the package
      const packageEntryPath = _require.resolve(packageName, { paths: [dir, cwd] });
      
      // Remove leading '@' from packageName if present
      const normalizedPackageName = packageName.replace(/^@/, '');
      
      // Replace the last occurrence of packageName with package.json
      const manifestPath = packageEntryPath.replace(new RegExp(`${normalizedPackageName}[^${normalizedPackageName}]*$`), `${normalizedPackageName}/package.json`);
  
      if (existsSync(manifestPath)) {
        return JSON.parse(await fs.readFile(manifestPath, 'utf8'));
      }
  
      throw new Error(`package.json not found for ${normalizedPackageName}`);
    } catch {
      // Explicitly suppressing errors here
    }
    // Explicitly suppressing errors here
  }
};

export const getFilteredScripts = (scripts: Scripts) => {
  if (!scripts) return [{}, {}];

  const scriptFilter = new Set(['start', 'postinstall']);
  const productionScripts: Scripts = {};
  const developmentScripts: Scripts = {};

  for (const scriptName in scripts) {
    if (scriptFilter.has(scriptName)) productionScripts[scriptName] = scripts[scriptName];
    else developmentScripts[scriptName] = scripts[scriptName];
  }

  return [productionScripts, developmentScripts];
};
