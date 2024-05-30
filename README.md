# jupytercad_gather

[![Github Actions Status](https://github.com/jupytercad/jupytercad-gather/workflows/Build/badge.svg)](https://github.com/jupytercad/jupytercad-gather/actions/workflows/build.yml)

A JupyterCAD plugin for the JupyterLab-Gather extenstion

## Requirements

- JupyterLab >= 4.0.0
- JupyterCAD >= 2.0.0a6
- JupyterLab-Gather >= 0.1.0

## Install

To install the extension, execute:

```bash
pip install jupytercad_gather
```

## Usage

1. In the JupyterCAD UI, you'll see a new icon on the toolbar. Go ahead and give that a click.

   ![cad model](./docs/images/1_cadmodel.png 'CAD Model')

2. That'll open a new dialog where you can register the model with JupyterLab-Gather, enter the name of the object you want to register and click submit.

   ![dialog](./docs/images/2_dialog.png 'Dialog')

3. In the left hand sidebar of JupyterLab-Gather, you'll see a list of available models, including the one you just registered, select the model you just added and click the button to set the model.

   ![sidebar](./docs/images/3_sidebar.png 'Sidebar')

4. This loads the model from JupyterCAD in JupyterLab-Gather. You can manipulate the model using the JupyterCAD interface and the changes will be rendered on the AR model.

   ![update](./docs/images/4_update.png 'Update')

5. If you'd like to load the entire JupyterCAD scene into JupyterLab-Gather, simply enter `Scene` (or `scene`) as the name of the object when registering.

   ![register scene](./docs/images/5_scene.png 'Register Scene')

6. Load the scene just like you did for the object.

   ![loaded scene](./docs/images/6_loaded_scene.png 'Loaded Scene')

## Uninstall

To remove the extension, execute:

```bash
pip uninstall jupytercad_gather
```

## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the jupytercad_gather directory
# Install package in development mode
pip install -e "."
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Rebuild extension Typescript source after making changes
jlpm build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

### Development uninstall

```bash
pip uninstall jupytercad_gather
```

In development mode, you will also need to remove the symlink created by `jupyter labextension develop`
command. To find its location, you can run `jupyter labextension list` to figure out where the `labextensions`
folder is located. Then you can remove the symlink named `jupytercad_gather` within that folder.

### Testing the extension

#### Frontend tests

This extension is using [Jest](https://jestjs.io/) for JavaScript code testing.

To execute them, execute:

```sh
jlpm
jlpm test
```

#### Integration tests

This extension uses [Playwright](https://playwright.dev/docs/intro) for the integration tests (aka user level tests).
More precisely, the JupyterLab helper [Galata](https://github.com/jupyterlab/jupyterlab/tree/master/galata) is used to handle testing the extension in JupyterLab.

More information are provided within the [ui-tests](./ui-tests/README.md) README.

### Packaging the extension

See [RELEASE](RELEASE.md)
