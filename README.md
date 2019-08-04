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
$ ctv install <build_number>
```

You'll start seeing output on the terminal indicating the progress of the operation

```
$ ctv install 1111
VSIXs to be downloaded : 1
Processing vsix : <artifact name>
Successfully installed extension <extension name>

```

## Commands
```
$ ctv install <build_number>
```
Command to install vsix files to Visual Studio Code. Use `-i` or `--insiders` flag to get the vsix installed in Visual Studio Code Insiders.

```
$ ctv setup -t <circleci_token> -v <github_or_bitbucket> -u <circleci_username> -p <circleci_project> -m <vscode_publisher_name>
```
Command to create the configuration needed to run this cli. Output is the `config.json` file described in [Configuration](#configuration) section.

```
$ ctv <command> -h
```
Help flag will give you a description of the commands functionality and available flags.

## Development

Create a symlink to your locally cloned repo:
```
$ npm link
```

## Debugging

The project ships with a VS Code debug configuration for Node.js. Open the project in VS Code and go to project file you want to debug. Set some breakpoints by clicking on the left side of the line where you’d like the code execution to stop, and in the terminal type:

```
$ node --inspect-brk <FILE NAME>
Debugger listening on ws:127.0.0.1:9229/<UUID>
```

After this, go to the Debug section in VS Code and run the `Attach to Remote` configuration.

## Maintainers

- [Luis Campos Guajardo](https://github.com/lcampos)


## License

MIT

## Resources

https://developer.atlassian.com/blog/2015/11/scripting-with-node/

https://circleci.com/docs/2.0/artifacts/#downloading-all-artifacts-for-a-build-on-circleci

https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e
