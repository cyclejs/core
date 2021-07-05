# Cycle.js Examples

Browse and learn from examples of small Cycle.js apps using Core, DOM Driver, HTML Driver, HTTP Driver, JSONP Driver, and others.

## Usage

1.  Open the directory of an example in your terminal.
2.  Type `npm start`
3.  Open the `index.html` of that example in your browser, with the full path, e.g. `file:///Users/myself/cycle-examples/jsx-seconds-elapsed/index.html`

## Study guide

Start with the examples under the basic folder in this order:

1. hello-world
2. checkbox
3. counter
4. http-random-user
5. bmi-naive

There're corresponding examples between difficulty levels such as bmi-naive with bmi-TypeScript or animation with animated-letters.


## Methods and libraries used by examples

#### Basic

**bmi-naive** Buggy input field as result of reuse as component that will sync with sister instances for lack of isolation, written in RxJS as opposed to xstream.

**checkbox** What would be considered a controlled input in react. Method of input handling that permits change from both the user and program.

**counter** Counts up or down on respective button press, state/model accumulation.

**hello-world** Uses input provided by user to change view, i.e. "Hello, textYouProvided".

**http-random-user** Example that uses TypeScript to make HTTP requests. Passes events generated from one driver to another after transformation. TypeScript provides hints in supporting IDEs and prevents some errors that xstream doesn't handle well.

**jsx-seconds-elapsed** Timer rendered from JSX file that uses HTML tags.

#### Intermediate

**animation** Moves a square between 3 points in archs.

**bmi-TypeScript** Correct version of BMI in xstream with TypeScript (reusable components through isolation).

**hello-lastname** Constructs and validates full name from two separate inputs, in TypeScript.

**http-search-github** Searches for GitHub repositories filtered by text from input. Debounces HTTP calls, and selects the correct call result out of multiple provided by driver.

**tsx-seconds-elapsed** TypeScript and JSX usage demonstration by way of timer.

#### Advanced

**animated-letters** Will toggle showing letters on keypress, with font size change animation. State handling without @cycle/state.

**autocomplete-search**  Autocomplete field for Wikipedia. 

**bmi-nested** Same as BMI-TypeScript in intermediate folder, but without the TypeScript.

**custom-driver** Chart driver that listens to sinks and produces source events passed through adapt library. 

**isomorphic** Example demonstrating usage of Cycle.js on the server to produce HTML document for server side rendering.

**many** Demonstrates state handling for list of items without @cycle/state.

**nested-folders** Demonstrates handling of list of folders potentially containing another list of folders- recursive-+ with @cycle/state.

**routing-view** ie Renders a different page as if you clicked on a link without the reload. @cycle/history
