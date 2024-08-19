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


## Application Functions
Outlined below are some of the functions that the extension uses.

### Identify Chatbot

The "Identify Chatbot" function helps users select and identify the chatbot element on a webpage.

- **Purpose:** This function allows users to interactively select the chatbot interface on a webpage, making it easier for the extension to interact with the chatbot in future operations.

- **How to Use:**
1. Click the "Identify Chatbot" button in the extension.
2. Click on different parts of the chatbot interface. User must click 3 times on different parts of the chatbot to fully identify the entire chatbot element.
3. The extension will search for the parent element that connects the 3 clicked elements to determine the chatbot container.

- **Key Features:**
  - **Confirmation:** Once identified, the chatbot element will briefly flash green to confirm the selection.
  - The HTML of the identified chatbot element is stored for future use by the extension.

### Send Message and Fetch Response

The extension has a button to input a message and fetch the response.

- To input the message, the extension searches for an input field within the chatbot element and places text in this field. The text is retrieved from the [messagesToSend](./src/utils/messagesToSend.ts) file.

- Retrieving the response is more difficult. The method used depends on the root url of the current website.
  - If it is one of ChatGPT, Claude or Gemini, the extension uses a specific selector for each of the sites that they use for their responses.
  - If it is something else, it attempts to capture the response by looking for new elements that appear after sending the message.
      - The response is considered complete when no new text has been added for 5 seconds or the maximum wait time (20 seconds by default) is reached.
      - To attempt to filter out non-response text, the code checks for common chatbot phrases and typical response patterns (e.g., starting with a capital letter, ending with punctuation).
  - If a valid response is found, it's stored in the 'responses' object for future reference.


## To Do

### Filter results by Chatbot Element
The way the extensions currently filters the evaluation results is incorrect. Here is how it should be filtered:

- Run the extension with any of the guidelines (ACT/WCAG), and a list of the evaluated rules will be outputted.

- You can click on any rule for more detailed information. In this description is some of the tests that were performed.
- Each test contains the element that was retrieved to perform the test. This is shown in the screenshot below.

<img width="458" alt="Screenshot 2024-08-10 at 17 54 55" src="https://github.com/user-attachments/assets/51a2bfee-eba8-438d-a657-c30e30b38e68">

- Check these tested elements to see if they are contained within the chatbot element defined by the user.

#### Possible Implementation
- This detailed description can be found in the [RuleResult.vue](./src/popup/components/RuleResult.vue) module.

```html
<highlight-code lang="html">{{element.htmlCode}}</highlight-code>
```

- `element.htmlCode` is the relevant code here. It contains the element that was evaluated.

- Currently the results are filtered in [`content.ts`](./src//content/content.ts).
  - To filter the results the correct way, they must be filtered after the detailed descriptions are generated in [Loading.vue](./src/popup/router/pages/Loading.vue).

### Implement Voice Input and Output Detection
#### Request User to Input Voice
I tried to implement code that could:
1. Click the voice input button to start the microphone.
2. Play the audio clip from the audio folder while the mic is on.
3. Capture the clip playing from the loud speakers into the microphone so the chatbot could capture the input.

However, I was unable to find anyway to implement this that worked. Leticia suggested to request the user to speak a certain phrase out loud.

#### Possible Implentation
- Create a new page in the `src/popup/routes/` directory. (I have already created the empty file `VoiceInput.vue`).
- On this page, there should be a `<p>` and a `<button>`. The p tag contains the request to the user and the button should be clicked when the user is finished speaking.
- The script contains the code to transition to the `/loading` route when the button is clicked.

### Retrieving Output of Chatbot
The extension should be able to retrieve the audio output of the chatbot and use a speech to text service to store the output and compare it to the expected output. The expected output is usually displayed in a text format on the screen.

This can be broken into simpler tasks, including:

- Detecting if the chatbot is outputting audio.
  - If yes, can be stated to have voice output capabilities.
- Find a way to capture the voice output of the chatbot, but this is more complex.

### Replace Best Practices Package with Chatbot Package
Currently, the extension is importing the `best-practices` package from the qualweb repo. I forked the repo and implemented additional rules in the package that the extension is using.

However, Carlos has added a new package, called `cui-checks`, which should be the one used. The code implemented in rule [`QW_BP30`](https://github.com/patbarry29/qualweb/blob/main/packages/best-practices/src/best-practices/QW-BP30.ts) should be imported to `cui-checks`. Then the dependencies in this project can be updated to use the rule coming from the correct package.

### Check Readability of Chatbot Responses
Use ChatGPT API to check the readability of the response. The response given by the chatbot must above a certain readability level.

We decided to attain the level of a response by feeding it to the ChatGPT API after fetching it from the webpage.

If the level is over the recommended level we can try asking the chatbot to respond with a more readable response.
