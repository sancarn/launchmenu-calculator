# LM-applet-quickstart

This repository contains an example setup for a [LM](https://github.com/LaunchMenu/LaunchMenu) applet. Clone this repository and get started on your applet!

Take these 5 easy steps to make your applet:

1. Copy the contents of this repository to your own repository
2. Install and run the hello-world content
3. Create your own amazing applet
4. Replace the information in the package by your own info
5. Publish the applet to npm (unfortunately there is no automatic way to install applets as of yet in LM though)

This quickstart will probably be improved in the future, with some additional tooling modules that will be released in the LaunchMenu namespace. But for now this quickstart should be sufficient to create some custom applet already.

## Developing the application

First install all dependencies by executing one of the following commands in the root:

```
yarn
```

```
npm install
```

Then start the development process by calling one of the following commands in the root:

```
yarn dev
```

```
npm run dev
```

Check the tray to open the program

## Locally installing the application

A couple of scripts have been included that allow you to install this applet to your local LaunchMenu instance. These scripts will likely be moved to their own `LM-dev-tools` module in the future.

This applet can locally be installed by running either of the following commands in this directory (it may require an elevated terminal):

```
yarn install-local
```

```
npm run install-local
```

The first time you run this command, it will ask you to locate the LaunchMenu instance. Simply select the top level directory (the one that contains LaunchMenu.exe) and the script will take care of the rest.

After installation, LaunchMenu will have to be restarted to see the change. This can be done by opening the context menu and searching for `restart` and executing it.

If at any point you want to uninstall the applet again, you can simply use one of the following commands:

```
yarn uninstall-local
```

```
npm run uninstall-local
```
