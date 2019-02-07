## Goal

Build a `Table` component in React to load in and display data from a Star Wars API. Use a live API endpoint for grabbing Star Wars characters for which the documentation is: https://swapi.co/documentation#people, An example API response is here: https://swapi.co/api/people

## Specs

- Generic table component to take in any array of data, and display it
  - Uses `rows` and `columns` props
- Can custom render a column of data
- Can sort a column of data when a column is clicked
  - If another column is clicked, it should change the active sort
  - If the same column is clicked, it should toggle the sort order by ascending / descending
  - Custom sorts per column are supported
- Calls out to the Star Wars API endpoint at https://swapi.co/api/people, and loads in the data to the Table component
  - Using axios
  - Loading state for Table, while waiting for the HTTP response to come back
- handleCellHeightResize() fixes cell height issues caused by absolutely positioning the first column of data

## Available NPM Scripts

This demo project was bootstrapped with `create-react-app`, and as such comes with some convenient `npm` scripts. In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Future Goals

- Refactor nested Promise.all from hell
  - break up into smaller, meaningful functions
  - use async/await to eliminate nesting
- Refactor sorting logic
  - none of the new characters have birth years in this api (yet), so only BBY birth years exist. current date sorting function would not handle this correctly
  - the sort functionality could be improved by calculating a sort value and sort function during the data processing, like `{'sortval': 0, 'content': 'foo'}` and `{'sortType': 'numerical', 'colHeader': 'bar'}` (an example of this has been implemented for films column sort)
- Wire up the film names and such so that they link back to the API page like the Url does
- Figure out pagination and how that would affect sorting
- Table has a fixed first column and scrolls to the right. this UI works OK until you get down to mobile sizes, would need to work out a different UI at that point. If there were more rows of data, it might be nice to have the column headers row be fixed, but would probably have to choose between column headers row and first column to prevent table navigation issues
