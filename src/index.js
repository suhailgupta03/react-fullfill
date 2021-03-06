import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Spin } from "antd";
import DataTable from "./data-table";
import SearchBar from "./search-bar";
import Fetch from "./fetch-hook";
import DummyColumns from "./dummy-columns";
import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const URL = "https://jsonplaceholder.typicode.com/photos";

const Main = React.memo(() => {
  const JUMP_VALUE = 5;
  const MAX_RENDER = 10;
  const [downCounter, setDownCounter] = useState(MAX_RENDER);
  const [upCounter, setUpCounter] = useState(0);
  const [searchString, setUpSearchString] = useState("");
  const [data, loading] = Fetch(URL);

  useEffect(() => {}, [downCounter]);

  /**
   * Infinite scroll logic for the DataTable component
   * Note: This method is called during the scroll
   * event with the DataTable Component
   * @param {Object} scrollInfo
   */
  function infiniteScroll(scrollInfo) {
    const { scrollDirection, scrollType } = scrollInfo;
    // type: String = "up" | "down"
    if (scrollType === "up") {
      let maxUpJumpAllowed = upCounter + -1 * JUMP_VALUE;

      if (maxUpJumpAllowed < 0) {
        // Jump by the difference remaining
        maxUpJumpAllowed = 0;
      }
      setUpCounter(maxUpJumpAllowed);
      // As the upper counter is modified
      // also modify the down counter
      // This will lead to ~constant
      // memory with the browser

      if (scrollDirection === "up" && downCounter > 105) {
        setDownCounter(downCounter - JUMP_VALUE);
      }

      // if (downCounter - JUMP_VALUE < 0) {
      //   setDownCounter(MAX_RENDER);
      // } else {
      //   setDownCounter(downCounter - JUMP_VALUE);
      // }
    } else {
      let nextCounter = downCounter + JUMP_VALUE;
      // Check if we can scroll down more
      if (nextCounter > data.length) {
        // Looks like there isn't enough
        // data to jump by 10
        // We could confirm this
        if (data.length > downCounter) {
          // Now we can only go max by
          // the difference of 2 counters
          nextCounter = downCounter + (data.length - downCounter);
        }
      }
      setDownCounter(nextCounter);
      setUpCounter(upCounter + JUMP_VALUE);
    }
  }

  /**
   * Call this function to get the rows that must
   * be shown in the data table. This function utilizes
   * the up-counter and down-counter that to pump
   * the relevant data into the data table.
   * @returns {Array} rowCluster
   */
  function composeTableRows() {
    let rowCluster = data.slice(upCounter, downCounter);
    if (searchString) {
      /**
       * If user has some search string entered
       * use the that search string to filter
       * the values
       */
      return rowCluster.filter(
        value => value.title && value.title.includes(searchString)
      );
    } // else return the non-filtered data
    return rowCluster;
  }

  /**
   * The following function returns the
   * search-bar component
   */
  function getSearchBar() {
    return (
      <SearchBar
        /**
         * Render the search bar
         */
        onSearchStringChanged={searchValue => {
          setUpSearchString(searchValue);
        }}
      />
    );
  }

  /**
   * This function returns the main data-table component
   */
  function getDataTable() {
    return (
      <DataTable
        /**
         * Render the data table
         */
        columns={DummyColumns}
        rows={composeTableRows()}
        onRowClick={(rowData, rowIndex, isSelected) => {
          // console.log(rowData, rowIndex, isSelected, " onRowClick");
        }}
        onSelectionChange={selectedRows => {
          // console.log(selectedRows, " onSelectionChange");
        }}
        infiniteScroll={infiniteScroll}
        totalDataPointsSeen={downCounter}
      />
    );
  }

  /**
   * The following returns the JSX (elements) to be rendered.
   * Note:
   *  - When the data from the REST API has not been loaded, the call
   *  simply returns the spinner (or the loader)
   *
   *  - When the data from the REST API is returned, the call returns
   *  the SearchBar component and the DataTable component stacked
   *  on the top of each other
   */
  return loading ? (
    <Spin className="d-flex justify-content-center" />
  ) : (
    <div className="d-flex flex-column">
      {getSearchBar()}
      {getDataTable()}
    </div>
  );
});

ReactDOM.render(<Main />, document.getElementById("container"));
