# circleci-to-vscode

## Prerequisites
- This project is built with nodejs so you'll have to install nodejs in your local, version 8.9 is what this has been tested on.
- You'll need to create a circleci token to be able to configure this tool. More info on circleci's doc [Create a Personal API token](https://circleci.com/docs/2.0/managing-api-tokens/#creating-a-personal-api-token).
- You should have `vscode` already installed in your machine. Go [here](https://code.visualstudio.com/download) if you need to download it.

## Configuration
After cloning this repo locally, create a `config.json` file based on the provided `sample-config.json` file and enter the info needed. This configuration is used to download the artifacts stored in circleci, more info about this in [Downloading All Artifacts for a Build on CircleCI](https://circleci.com/docs/2.0/artifacts/#downloading-all-artifacts-for-a-build-on-circleci).

Once this is set, install the cli tool globally by running:
```
$ npm install -g
```

Now, let's test running the tool by running:
```
$ which ctv
```
You should get something like `/usr/local/bin/ctv` which means `npm install -g` successfully linked the project to a location on our path and we can use it like any other cli.

## Usage
Once done with the configuration section we can start running the tool to download vsix artifacts from circleci and install them on our local vscode as any other extension.

Run the cli by providing a circleci build number that contains artifacts.
```
$ ctv <build_number>
```

You'll start seeing output on the terminal indicating the progress of the operation

```
$ ctv 1111
VSIXs to be downloaded : 1
Processing vsix : <artifact name>
Successfully installed extension <extension name>

```

## Development

Create a symlink to your locally cloned repo:
```
$ npm link
```


## Maintainers

- [Luis Campos Guajardo](https://github.com/lcampos)


## License

MIT

## Resources

https://developer.atlassian.com/blog/2015/11/scripting-with-node/

https://circleci.com/docs/2.0/artifacts/#downloading-all-artifacts-for-a-build-on-circleci

https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e
