## Points to note
- Wrote the mock component at my codesandbox. Could be referred from https://codesandbox.io/s/dazzling-shockley-9n6m1
- There are 2 components
  - DataTable 
  - SearchBar
- The main file is `index.js`
- Infinite scroll is implemented for `direction=down` and `direction=up`
- Number of data points in the browser remain `=~ constant`. Thus helps slowing / crashing of the browser

## Important
- Method of `infinite-scroll` has been implemented as a callback (see `index.js`), that continuously 
supplies data to the `DataTable` component based on the `scroll-direction=bottom` or `scroll-direction=up`