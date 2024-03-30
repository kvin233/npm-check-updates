import { expect } from 'chai'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import spawn from 'spawn-please'
import chaiSetup from './helpers/chaiSetup.js'
import stubVersions from './helpers/stubVersions.js'

chaiSetup()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const bin = path.join(__dirname, '../build/src/cli.js')

describe('format', () => {
  it('--format time', async () => {
    const timestamp = '2020-04-27T21:48:11.660Z'
    const stub = stubVersions({
      version: '99.9.9',
      time: {
        '99.9.9': timestamp,
      },
    })
    const packageData = {
      dependencies: {
        'ncu-test-v2': '^1.0.0',
      },
    }
    try {
      const { stdout } = await spawn('node', [bin, '--format', 'time', '--stdin'], {
        stdin: JSON.stringify(packageData),
      })
      expect(stdout).contains(timestamp)
    } finally {
      stub.restore()
    }
  })

  it('--format repo', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'npm-check-updates-'))
    const pkgFile = path.join(tempDir, 'package.json')
    await fs.writeFile(
      pkgFile,
      JSON.stringify({
        dependencies: {
          'modern-diacritics': '^1.0.0',
        },
      }),
      'utf-8',
    )
    try {
      await spawn('npm', ['install'], {}, { cwd: tempDir })
      const { stdout } = await spawn('node', [bin, '--format', 'repo'], {}, { cwd: tempDir })
      stdout.should.include('https://github.com/Mitsunee/modern-diacritics')
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true })
    }
  })

  it('--format lines', async () => {
    const stub = stubVersions({
      'ncu-test-v2': '2.0.0',
      'ncu-test-tag': '1.1.0',
    })
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'npm-check-updates-'))
    const pkgFile = path.join(tempDir, 'package.json')
    await fs.writeFile(
      pkgFile,
      JSON.stringify({
        dependencies: {
          'ncu-test-v2': '^1.0.0',
          'ncu-test-tag': '^1.0.0',
        },
      }),
      'utf-8',
    )
    try {
      const { stdout } = await spawn('node', [bin, '--format', 'lines'], {}, { cwd: tempDir })
      stdout.should.equals('ncu-test-v2@^2.0.0\nncu-test-tag@^1.1.0\n')
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true })
      stub.restore()
    }
  })

  it('disallow --format lines with --jsonUpgraded', async () => {
    const stub = stubVersions({
      'ncu-test-v2': '2.0.0',
      'ncu-test-tag': '1.1.0',
    })
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'npm-check-updates-'))
    const pkgFile = path.join(tempDir, 'package.json')
    await fs.writeFile(
      pkgFile,
      JSON.stringify({
        dependencies: {
          'ncu-test-v2': '^1.0.0',
          'ncu-test-tag': '^1.0.0',
        },
      }),
      'utf-8',
    )
    try {
      await spawn(
        'node',
        [bin, '--format', 'lines', '--jsonUpgraded'],
        {},
        {
          cwd: tempDir,
        },
      ).should.eventually.be.rejectedWith('Cannot specify both --format lines and --jsonUpgraded.')
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true })
      stub.restore()
    }
  })

  it('disallow --format lines with --jsonAll', async () => {
    const stub = stubVersions({
      'ncu-test-v2': '2.0.0',
      'ncu-test-tag': '1.1.0',
    })
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'npm-check-updates-'))
    const pkgFile = path.join(tempDir, 'package.json')
    await fs.writeFile(
      pkgFile,
      JSON.stringify({
        dependencies: {
          'ncu-test-v2': '^1.0.0',
          'ncu-test-tag': '^1.0.0',
        },
      }),
      'utf-8',
    )
    try {
      await spawn(
        'node',
        [bin, '--format', 'lines', '--jsonAll'],
        {},
        {
          cwd: tempDir,
        },
      ).should.eventually.be.rejectedWith('Cannot specify both --format lines and --jsonAll.')
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true })
      stub.restore()
    }
  })

  it('disallow --format lines with other format options', async () => {
    const stub = stubVersions({
      'ncu-test-v2': '2.0.0',
      'ncu-test-tag': '1.1.0',
    })
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'npm-check-updates-'))
    const pkgFile = path.join(tempDir, 'package.json')
    await fs.writeFile(
      pkgFile,
      JSON.stringify({
        dependencies: {
          'ncu-test-v2': '^1.0.0',
          'ncu-test-tag': '^1.0.0',
        },
      }),
      'utf-8',
    )
    try {
      await spawn(
        'node',
        [bin, '--format', 'lines,group'],
        {},
        {
          cwd: tempDir,
        },
      ).should.eventually.be.rejectedWith('Cannot use --format lines with other formatting options.')
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true })
      stub.restore()
    }
  })
})
