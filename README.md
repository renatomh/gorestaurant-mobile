<h1 align="center"><img alt="Go Restaurant Mobile" title="Go Restaurant Mobile" src=".github/logo.png" width="250" /></h1>

# Go Restaurant Mobile

## 💡 Project's Idea

This project was developed as a challenge during the RocketSeat's Bootcammp GoStack. It aims to create a mobile application for viewing a restaurant's menu and ordering its dishes.

## 🔍 Features

* Available dishes listing;
* Ordering dishes;
* Setting favorite dishes;

<p align="center"><img src=".github/sample.gif" alt="sample" /></p>

## 💹 Extras

*

## 🛠 Technologies

During the development of this project, the following techologies were used:

- [React Native](https://reactnative.dev/)
- [Axios](https://axios-http.com/ptbr/docs/intro)
- [TypeScript](https://www.typescriptlang.org/)
- [json-server](https://github.com/typicode/json-server)

## 💻 Project Configuration

First, install the dependencies for the project

```bash
$ yarn
```

If not already installed, you must also [install the json-server](https://github.com/typicode/json-server#getting-started) globally on your machine. You can do this with the command below:

```bash
$ npm install -g json-server
```

## ⏯️ Running

To run the project in a development environment, first you must run the json-server with the fake API to be consumed by the front-end application.
You can do this with the following command on the root directory:

```bash
$ yarn start-server
```

After that, **in another terminal**, execute the following command on the root directory.

```bash
$ # For Android devices
$ yarn android
$ # For iOS devices
$ yarn ios
```

### Documentation:
* [Simulando uma API REST com JSON Server de maneira simples](https://www.fabricadecodigo.com/json-server/)

## 📄 License

This project is under the **MIT** license. For more information, access [LICENSE](./LICENSE).
