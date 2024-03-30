import { expect } from 'chai'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import spawn from 'spawn-please'
import chaiSetup from './helpers/chaiSetup.js'

chaiSetup()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const bin = path.join(__dirname, '../build/src/cli.js')

describe('global', () => {
  // TODO: Hangs on Windows
  const itSkipWindows = process.platform === 'win32' ? it.skip : it
  itSkipWindows('global should run', async () => {
    // to speed up the test, only check npm (which is always installed globally)
    const { stdout } = await spawn('node', [bin, '--jsonAll', '--global', 'npm'])
    const json = JSON.parse(stdout)
    expect(json).to.have.property('npm')
  })
})
