import Keyiu from '../lib/Application'

describe('AppController (e2e)', () => {
  beforeEach(async() => {
    await new Keyiu(__dirname).run(3000, '');
  })
  it('should return "Hello World!"', async () => {
  });
});