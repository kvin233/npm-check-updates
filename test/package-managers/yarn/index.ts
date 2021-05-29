import path from 'path'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import spawn from 'spawn-please'
import * as yarn from '../../../src/package-managers/yarn'

chai.should()
chai.use(chaiAsPromised)
process.env.NCU_TESTS = 'true'

describe('yarn', function () {

  it('list', async () => {
    const testDir = path.join(__dirname, 'default')
    const version = await yarn.latest('chalk', '', { cwd: testDir })
    parseInt(version!, 10).should.be.above(3)
  })

  it('latest', async () => {
    const testDir = path.join(__dirname, 'default')
    const version = await yarn.latest('chalk', '', { cwd: testDir })
    parseInt(version!, 10).should.be.above(3)
  })

  it('"No lockfile" error should be thrown on list command when there is no lockfile', async () => {
    const testDir = path.join(__dirname, 'nolockfile')
    const lockFileErrorMessage = 'No lockfile in this directory. Run `yarn install` to generate one.'
    await yarn.list({ cwd: testDir })
      .should.eventually.be.rejectedWith(lockFileErrorMessage)
  })

})