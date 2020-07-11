const log = require('../utils/log');
const { getVsixName, buildHTTPOpts } = require('../utils/circleci');

describe('Circleci util', () => {
  beforeEach(() => {
    log.info = jest.fn();
    jest.spyOn(console, 'log').mockImplementation(() => {
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should return a valid vsix name', () => {
    const data = {
      path: 'home/circleci/project/extensions/some-vscode-extension-1.2.14.vsix',
      pretty_path: 'home/circleci/project/extensions/some-vscode-extension-1.2.14.vsix',
      node_index: 0,
      url: 'https://fake-gh.circle-artifacts.com/0/home/circleci/project/extensions/some-vscode-extension-1.2.14.vsix'
    };

    expect(getVsixName(data)).toEqual('some-vscode-extension-1.2.14');
  });

  test('Should return a valid http options for circleci', () => {
    const config = {
      CIRCLE_TOKEN: '5uP3r53cr3T',
      vcs_type: 'github',
      username: 'testerMccoy',
      project: 'mine'
    };

    const outputData = {
      host: 'circleci.com',
      path: '/api/v1.1/project/github/testerMccoy/mine/666/artifacts?circle-token=5uP3r53cr3T',
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    };

    expect(buildHTTPOpts('666', config)).toEqual(outputData);
  });
});
