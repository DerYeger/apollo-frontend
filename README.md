# gramoFO-Frontend

> A web application for first-order model checking in graph structures

Documentation is available [here](https://gramofo-frontend.yeger.eu/).

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

Run `yarn test` to execute the unit tests via [Karma](https://karma-runner.github.io) and `yarn e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Deployment

### Documentation

Run `yarn compodoc` to generate the documentation. It will be stored in the `documentation/` directory.

### Docker

Run `docker-compose up -d --build` to build and start a container. Alternatively, build the image via the Dockerfile.
>Note: Default port is 80.

>Note: Change the argument `BACKEND_URL` as required.
