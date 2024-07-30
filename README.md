# chatbot-accessibility-evaluator
Chrome Extension used to evaluate the accesibility of any given chatbot ui (LLMs/customer service, etc.)

# Catch-up Guide
This guide will describe how to install this extension and detail the structure of this application, which uses the Vue and Vuex frameworks.

## Initialisation
1. **Fork Repo**

    Go to the [GitHub page](https://github.com/patbarry29/chatbot-accessibility-evaluator.git) of the repository.

   Click the "Fork" button at the top right of the page. This will create a copy of the repository under your own GitHub account.

2. **Clone Forked Repo**

    Once you have forked the repository, clone it to your local machine using the following command:

   ```sh
   git clone https://github.com/YOUR_USERNAME/chatbot-accessibility-evaluator.git
   ```

3. **Install NPM**

    If npm is not already installed, follow this [guide for Mac and Windows](https://radixweb.com/blog/installing-npm-and-nodejs-on-windows-and-mac).

4. **Install project dependencies**

    Navigate to the project directory and install the required dependencies:

    ```sh
    npm install
    ```

5. **Build the Application**

    Run the following command to build the application:

    ```sh
    npm run build
    ```

6. **Load the Extension in Chrome**

  - Open the Chrome browser and navigate to `chrome://extensions`.
  - In the top right, enable "Developer mode" if not already.
  - Click "Load unpacked" and navigate to root directory of project: `chatbot-accessibility-evaluator/`. Select this folder, and the extension will be loaded into the browser.


## Vue and Vuex
Next, here are some of the basics of how Vue and Vuex work to better understand the project structure.

### Vue Basics
  - **Pages:** The application is composed of multiple "pages" that represent different sections of the application.
  - **Routes:** Each page is associated with a unique "route," which is a URL path used to navigate between pages. For example, the default page [(`Index.vue`)](src/popup/router/pages/Index.vue) has the route `/`, while the evaluation page, which displays the results, has the route `/evaluation`.
    - These routes are all defined in [`router/routes.js`](src/popup/router/routes.js).
  - **Navigation:** The current route (or page) can be changed by user interaction or by a specified action, e.g. the evaluation has finished running and results are ready to be displayed.

### Vuex Basics
  - **Purpose:** Vuex is used to store the state (value) of different variables so that they can be accessed across the application.
  - **Project Implementation:**
    - Default states are defined in [`store/index.js`](src/popup/store/index.js).
    - Getters are used to fetch the current state across the application. All getters are defined in the [`store/getters.js`](src/popup/store/getters.js) file.
    - Actions are defined in the [`store/actions.js`](src/popup/store/actions.js) file. These are used to perform asynchronous operations and commit mutations to change the state.
    - Mutations are defined in the [`store/mutations.js`](src/popup/store/mutations.js) file. They are responsible for directly modifying the state in a synchronous manner. Mutation types, typically defined in a separate file, are constants used to maintain consistency when committing mutations throughout the application.

