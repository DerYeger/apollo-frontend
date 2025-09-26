<h1 align="center">Apollo-Frontend</h1>

<p align="center">
  <img src="https://raw.githubusercontent.com/DerYeger/apollo-frontend/master/src/assets/icons/android-chrome-512x512.png" alt="Logo" width="128" height="128">
</p>

<p align="center">
  <a href="https://github.com/DerYeger/apollo-frontend/actions/workflows/ci.yml">
    <img alt="CI" src="https://github.com/DerYeger/apollo-frontend/actions/workflows/ci.yml/badge.svg?event=push">
  </a>
  <a href="https://github.com/DerYeger/apollo-frontend/actions/workflows/cd.yml">
    <img alt="CD" src="https://github.com/DerYeger/apollo-frontend/actions/workflows/cd.yml/badge.svg">
  </a>
  <a href="https://github.com/DerYeger/apollo-frontend/actions/workflows/maintenance.yml">
    <img alt="Maintenance" src="https://github.com/DerYeger/apollo-frontend/actions/workflows/maintenance.yml/badge.svg">
  </a>
</p>

<p align="center">
  <a href="https://lgtm.com/projects/g/DerYeger/apollo-frontend">
    <img alt="LGTM Grade" src="https://img.shields.io/lgtm/grade/javascript/github/DerYeger/apollo-frontend?logo=lgtm">
  </a>
</p>

<p align="center">
   <a href="https://apollo.janmueller.dev/">
    apollo.janmueller.dev
  </a>
</p>

> A web application for first-order model checking in graph structures.

This project and the accompanying bachelor's thesis were inspired by the research group *Theoretical Computer Science / Formal Methods* by the University of Kassel.
The parsing and validation logic of the backend is built upon a Java desktop application by Arno Ehle and Benedikt Hruschka.

> Note: This project is also known as **gramoFO**.

## Features

- 🛠 **Graph Editor**: Interactive graph editor with support for touch controls
- ✨ **Model Checking**: First-order-logic model checking in graph structures
- 💹 **Feedback**: Three different feedback levels provide insight on model-checking results
- ☑️ **Assignments**: Various assignments, which build an understanding for first-order logic and model checking
- 🔒 **Import/Export**: Graphs can be saved locally as wells as exported and imported as JSON and YAML
- 📱/💻 **Responsive**: Optimized for screens of all sizes
- 📶 **PWA**: Apollo is installable and supports offline editing of graphs
- 🌐 **Localization**: Fully localized in English and German
- 🌗 **Themes**: Dark and light designs

## Links

- [Apollo](https://github.com/DerYeger/apollo)
- [Apollo-Backend](https://github.com/DerYeger/apollo-backend)
- [Apollo-Admin](https://github.com/DerYeger/apollo-admin)
- [Documentation](https://apollo-frontend.yeger.eu/)
- [Bachelor's thesis (German)](https://jan-mueller.at/documents/bachelor-thesis)

## Development

### Installation

Run `yarn install` to install the required dependencies.

### Development server

Run `yarn start` to run a development server. The app will open and automatically reload if any source files are changed.
>Note: Default port is 4200.

### Code scaffolding

Run `ng g c components/{{component-name}} --module=app` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`. To create components with special names such as `Page` add `--type={{type}}`.

### Linting & formatting

Run `yarn lint` to lint and `yarn pretty` to format all source files.

### Build

Run `yarn build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running tests

Run `yarn test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Deployment

### Documentation

Run `yarn compodoc` to generate the documentation. It will be stored in the `documentation/` directory.

### Docker

Run `docker-compose up -d --build` to build and start a container. Alternatively, build the image via the Dockerfile.
>Note: Default port is 80.

>Note: Change the argument `BACKEND_URL` as required.

## License

[BSD 3-Clause License](./LICENSE) - Copyright &copy; Jan Müller

