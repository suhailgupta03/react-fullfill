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

  return loading ? (
    <Spin className="d-flex justify-content-center" />
  ) : (
    <div className="d-flex flex-column">
      <SearchBar
        /**
         * Render the search bar
         */
        onSearchStringChanged={searchValue => {
          setUpSearchString(searchValue);
        }}
      />
      <DataTable
        /**
         * Render the data table
         */
        columns={DummyColumns}
        rows={(() => {
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
        })()}
        onRowClick={(rowData, rowIndex, isSelected) => {
          // console.log(rowData, rowIndex, isSelected, " onRowClick");
        }}
        onSelectionChange={selectedRows => {
          // console.log(selectedRows, " onSelectionChange");
        }}
        infiniteScroll={scrollInfo => {
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
        }}
        totalDataPointsSeen={downCounter}
      />
    </div>
  );
});

ReactDOM.render(<Main />, document.getElementById("container"));
