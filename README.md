# Admin Messenger

1. [Setup instructions](#setup-instructions)
2. [Assumptions made](#assumptions-made)
3. [Architecture](#architecture)
4. [Future Improvements](#future-improvements)
5. [Watch Demo](#watch-demo)

## Setup instructions

0. Setup your environment:
    - Node > 20
    - Yarn > 1.22
1. Clone the repository
2. Run `yarn install`
3. Running the project:
    - **Development**:
        1. Run `yarn dev`
        2. Use the `dist` directory for loading the extension unpacked
    - **Production**
        1. Run `yarn build`
        2. Pack the extension from the `dist` directory

## Assumptions made

1. The API used provides an `GET` endpoint, so using a websocket for getting new messages wasn't an option
2. The API endpoint would only return **new** messages

## Architecture

The project follows the architecture commonly used for Vue.js projects, plus the setup for [CRXJS](https://crxjs.dev/vite-plugin/getting-started/vue/create-project), that provides HMR, improving Developer Experience.

- **Src** directory: holds all the source code for the project, this is where our main focus will be

- **Components** directory: holds Vue.js components, used through the application pages or other components

- **Helpers** directory: used for storing files with helper functions. The function `getStorageMessages` for instance, was separated to its own file because it's logic was used on multiple other files

- **Types** directory: used for declaring [TypeScript](https://www.typescriptlang.org/) interfaces and types that can be re-used at multiple files

- **App.vue** file: the hearth of the program. As this is a fairly simple application, this file controls mostly of the logic, when it comes to the [Vue.js](https://vuejs.org/) side of the application

- **background.ts** file: this is the hearth of the logic that is closer to the browser. Setting up the extension badge, when new messages come, actually fetching those messages and saving them to chrome's storage and sending them to our Vue.js application

- **env.d.ts** file: file created by `CRXJS`, it's porpoise is to provide [Vite](https://vitejs.dev/)'s globals to `TypeScript`, ensuring that env variables, such as `import.meta.env` and `HMR`, are known by TypeScript

- **index.css** file: used for setting up [Tailwind](https://tailwindcss.com/)

- **main.ts** file: the JavaScript entry point for our Vue.js application. This will quick start Single Page Application strategy, allowing JavaScript to take over control from there forward. This file is imported using a `script` tag at the `index.html` file, that is the actual entry point for the whole application.

## Future improvements

There are a lot of improvements that could be made:

- Auto delete read messages after some set period of time

- Add sound notifications

- Improve the overall UI

- Add more filters
  - Search filter
  - Message author filter
  - Date/time filter

- Add option for deleting a specific message

- Add option for archiving messages, and being able to recover them later on

- Add integration with Google Calendar, so messages with meeting invites would create the calendar event as well

- Add login/authentication flow

- Configuration page
  - Set period of time for auto deleting read message
  - Set sound notification volume and sound
  - Change color theme
  - Set polling time
  - Login/logout
  - Change user information
  - Generate message report

## Watch Demo

[![Watch the video](https://img.youtube.com/vi/JdcENOuTM8E/maxresdefault.jpg)](https://www.youtube.com/watch?v=JdcENOuTM8E)
