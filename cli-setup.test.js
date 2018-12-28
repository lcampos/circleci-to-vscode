const log = require('./utils/log');
const { setup } = require('./cli-setup');
const fs = require('fs');

describe('Setup command', () => {
  beforeEach(() => {
    log.error = jest.fn();
    log.info = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {
      return null;
    });
    jest.spyOn(console, 'log').mockImplementation(() => {
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should throw error on setup with empty options', () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
      return null;
    });
    try {
      setup({});
    } catch (e) {
      expect(log.error).toHaveBeenCalledWith(
        'Error while creating the cli configuration : --token is required'
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    }
  });

  test('Should be a successful setup when providing all options needed', () => {
    const mockExit = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
      return;
    });

    const opts = {
      token: 'waaaa',
      vcs_type: 'github',
      username: 'testerMccoy',
      project: 'mine',
      publisher: 'lcampos'
    };

    setup(opts);

    const output = {
      CIRCLE_TOKEN: 'waaaa',
      vcs_type: 'github',
      username: 'testerMccoy',
      project: 'mine',
      vscode_publisher: 'lcampos'
    };
    expect(mockExit).toHaveBeenCalledWith(
      './config.json',
      JSON.stringify(output, null, 2)
    );
  });
});
