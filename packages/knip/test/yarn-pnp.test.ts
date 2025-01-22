import { describe, test } from 'bun:test';
import assert from 'node:assert/strict';
import { main } from '../src/index.js';
import { resolve } from '../src/util/path.js';
import baseArguments from './helpers/baseArguments.js';
import baseCounters from './helpers/baseCounters.js';

const cwd = resolve('fixtures/yarn-pnp');

describe('Yarn PnP Tests', () => {
  test('Find unused dependencies in yarn pnp', async () => {
    const { counters } = await main({
      ...baseArguments,
      cwd,
      isStrict: true,
    });

    assert.deepEqual(counters, {
      ...baseCounters,
      processed: 1,
      total: 4,
    });
  });
});
