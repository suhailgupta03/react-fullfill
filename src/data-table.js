import React from "react";

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.prevTop = 0;
    this.prevBottom = Infinity;
    this.state = {
      selectedItems: [] // Container for the selected products
    };
  }

  componentDidCatch(error, info) {}

  componentDidMount() {
    document.addEventListener("scroll", this.trackScrolling);
  }

  componentWillUnmount() {
    // Remove the listener from the document
    // when the component unmounts
    document.removeEventListener("scroll", this.trackScrolling);
  }

  /**
   * Flags if the user has hit the bottom of the component
   * @param {HTMLElement} el
   */
  isBottom(el) {
    const currentBottom = el.getBoundingClientRect().bottom;
    return {
      isBottom: currentBottom <= window.innerHeight,
      currentBottom
    };
  }

  /**
   * Flags when user is about to reach the top. Approximates
   * the top flag when yCoordinate gets very close to 0. Currently set
   * at -3000
   * @param {HTMLElement} el
   */
  isTop(el) {
    const currentY = el.getBoundingClientRect().top;
    return {
      isTop: currentY > -5000,
      currentTop: currentY
    };
  }

  /**
   * Called at each scroll event of the data-table component
   */
  trackScrolling = () => {
    const wrappedElement = document.getElementsByClassName("table-responsive");
    const { isBottom, currentBottom } = this.isBottom(wrappedElement[0]);
    const { isTop, currentTop } = this.isTop(wrappedElement[0]);
    let scrollDirection = "down";
    if (this.prevBottom > currentBottom) {
      // Going down
    }
    if (this.prevTop < currentTop) {
      scrollDirection = "up";
    }
    this.prevBottom = currentBottom;
    this.prevTop = currentTop;
    if (isBottom) {
      if ("function" === typeof this.props.infiniteScroll) {
        this.props.infiniteScroll({
          scrollDirection,
          scrollType: "down"
        });
      }
    }

    if (isTop) {
      if ("function" === typeof this.props.infiniteScroll) {
        this.props.infiniteScroll({
          scrollDirection,
          scrollType: "up"
        });
      }
    }
  };

  /**
   * This function prepares the table header and returns a valid
   * React Node. React node could either be table-head structure
   * of null in case there are no columns to be rendered
   * @param {Array} possibleTableColumns
   * @param {Object} columnPropsMap Holds the column properties for each column
   */
  prepareTableHeader(
    possibleTableColumns = [],
    columnPropsMap = {},
    rowKeyContainer = [],
    totalRows = 0,
    rowValMap = {}
  ) {
    return (
      possibleTableColumns.length > 0 && (
        <thead>
          <tr>
            {possibleTableColumns.map((col, index) => (
              <th
                key={`header_${index}`}
                scope="col"
                className={
                  columnPropsMap[col] && columnPropsMap[col].numeric
                    ? "text-right"
                    : ""
                }
              >
                {// Add a checbox along with the first column
                // header; This checkbox will help select
                // all the rows in the table
                // Note: This only adds a single checkbox
                // in the table header
                // Checkbox for each row must be added
                // separately when preparing the render
                // structure for the row
                index === 0 ? (
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      onChange={this.onAllRowsSelected.bind(
                        this,
                        rowKeyContainer,
                        totalRows,
                        rowValMap
                      )}
                    />
                    <label className="form-check-label">
                      {this.getTableCell(
                        (columnPropsMap[col] && columnPropsMap[col].label) || ""
                      )}
                    </label>
                  </div>
                ) : (
                  this.getTableCell(
                    (columnPropsMap[col] && columnPropsMap[col].label) || ""
                  )
                )}
              </th>
            ))}
          </tr>
        </thead>
      )
    );
  }

  getTableCell(cellValue) {
    if (this.isURL(cellValue)) {
      // Assumption: Any URL passed will be an image URL
      return (
        <img src={cellValue} alt="" className="img-thumbnail h-50 w-50 ml-3" />
      );
    }
    return <span>{cellValue}</span>;
  }

  isURL(value) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
      value
    );
  }
  /**
   * This function prepares the row structure for the table
   * @param {Array} possibleTableColumns
   * @param {Object} columnValueMap
   * @param {Number} totalRows
   * @param {Object} columnPropsMap Holds the column properties for each column
   */
  prepareTableBody(
    possibleTableColumns = [],
    columnValueMap = {},
    totalRows = 0,
    columnPropsMap = {},
    rowKeyContainer = []
  ) {
    let tableRowContainer = [];
    const currentKeysSelected = Object.keys(this.state.selectedItems);
    if (possibleTableColumns.length > 0) {
      for (let i = 0, rowIndex = 0; i < totalRows; i++, rowIndex++) {
        tableRowContainer = [
          ...tableRowContainer,
          <tr
            key={rowKeyContainer[i]}
            onClick={this.onRowSelection.bind(
              this,
              columnValueMap,
              rowIndex,
              rowKeyContainer[i]
            )}
          >
            {possibleTableColumns.map((column, index) => (
              <td
                key={`${rowKeyContainer[i]}_${index}`}
                className={
                  columnPropsMap[column] && columnPropsMap[column].numeric
                    ? "text-right"
                    : ""
                }
                style={{
                  width: `${columnPropsMap[column].width || "auto"}`
                }}
              >
                {index === 0 && (
                  <div className="d-flex justify-content-start text-info">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        key={`${index}_${rowKeyContainer[i]}`}
                        checked={currentKeysSelected.includes(
                          rowKeyContainer[i].toString()
                        )}
                        onChange={this.onRowSelection.bind(
                          this,
                          columnValueMap,
                          rowIndex,
                          rowKeyContainer[i]
                        )}
                      />
                    </div>
                    {this.getTableCell(columnValueMap[column][rowIndex])}
                  </div>
                )}

                {index > 0 &&
                  this.getTableCell(columnValueMap[column][rowIndex])}
              </td>
            ))}
          </tr>
        ];
      }
    }

    return tableRowContainer;
  }

  /**
   * Composer function to prepare the table, that can be directly
   * used to render the content.
   * Uses:
   *  - Prepare table data schema function to prpare the table data structure
   *  - Prepare table header function to prepare the table header
   *  - Prepare table body function to prepare the table body
   *  that contains all the row data
   */
  composeTable() {
    const {
      rowValMap,
      possibleTableColumns,
      columnPropsMap,
      rowKeyContainer
    } = this.prepareTableDataSchema(this.props);

    return (
      <div className="table-responsive">
        <table className="table table-hover">
          {this.prepareTableHeader(
            possibleTableColumns,
            columnPropsMap,
            rowKeyContainer,
            this.props.rows.length,
            rowValMap
          )}
          <tbody>
            {this.prepareTableBody(
              possibleTableColumns,
              rowValMap,
              this.props.rows.length,
              columnPropsMap,
              rowKeyContainer
            )}
          </tbody>
        </table>
      </div>
    );
  }

  /**
   * This function prepares the initial data structure that
   * helps in rendering the table. The function clubs
   * and maps data for each column.
   * @param {*} props
   */
  prepareTableDataSchema(props) {
    const { rows, columns } = props;
    const possibleTableColumns = columns.map(c => c.id);

    const rowValMap = {};
    const columnPropsMap = {};
    const rowKeyContainer = rows.map(row => row.id);
    columns.forEach(column => (columnPropsMap[column.id] = column));
    // Iterate over the row data, to prepare
    // a hash-map that maps id to a list
    // of values
    // Note: For rows that have missing values,
    // value of null will be assigned
    // Also, the column-to-value map is based on the
    // column values derived from the columns props
    rows.forEach(row => {
      for (const column of possibleTableColumns) {
        // Base this
        // on total possible columns
        let columnValue = null;
        // Default value of null is assigned to the column
        // where the row data structure is missing the
        // column key
        if ("undefined" !== typeof row[column]) {
          columnValue = row[column];
        }
        if (rowValMap[column]) {
          rowValMap[column].push(columnValue);
        } else {
          rowValMap[column] = [columnValue];
        }
      }
    });
    // Now since the row data is clubbed into
    // a data structure from where it is easier
    // to follow, we can use this to render the
    // table easily

    return {
      rowValMap,
      possibleTableColumns,
      columnPropsMap,
      rowKeyContainer
    };
  }

  /**
   * Called when the row is clicked
   * @param {Object} columnValueMap
   * @param {Number} rowIndex
   * @param {Number} rowKey
   */
  onRowSelection(columnValueMap, rowIndex, rowKey) {
    const rowObject = {};
    for (const column in columnValueMap) {
      rowObject[column] = columnValueMap[column][rowIndex];
    }

    let selected = true;
    let selectedItems = {};
    if (this.state.selectedItems[rowKey]) {
      // Item was already selected
      // Deselected the item
      const transformedSelectedItems = { ...this.state.selectedItems };
      delete transformedSelectedItems[rowKey];
      selectedItems = transformedSelectedItems;
      selected = false;
    } else {
      // Item needs to be selected
      selectedItems = {
        ...this.state.selectedItems,
        ...{
          [rowKey]: rowObject
        }
      };
    }

    this.setState({
      selectedItems
    });
    if ("function" === typeof this.props.onRowClick) {
      // Return the results in the callback
      // Returns the currently selected item
      this.props.onRowClick(rowObject, rowIndex, selected);
    }

    if ("function" === typeof this.props.onSelectionChange) {
      // Return the array of objects as opposed
      // to the array of strings given in the documentation
      // This returns the incremental list of the selected items
      this.props.onSelectionChange(Object.values(selectedItems));
    }
  }

  onAllRowsSelected(rowKeyContainer, totalRows, colValMap, event) {
    let selectedItems = {};
    let selected = false;
    if (event.target.checked) {
      // Select all the rows
      for (let rc = 0; rc < totalRows; rc++) {
        const rowObject = {};
        for (const column in colValMap) {
          rowObject[column] = colValMap[column][rc];
        }
        selectedItems[rowKeyContainer[rc]] = rowObject;
      }
      selected = true;
    }

    if ("function" === this.props.onSelectionChange) {
      if (selected) {
        // As given in the documentation
        this.props.onSelectionChange("All");
      } else {
        this.props.onSelectionChange([]);
      }
    }

    this.setState({
      selectedItems
    });
  }

  /**
   * Method that shows the current data rows in the page
   * and also shows the data points seen
   */
  renderDataPointCount() {
    return (
      <div className="p-2 d-flex justify-content-end sticky-top">
      <span class="badge badge-primary small">Seen: {this.props.totalDataPointsSeen}</span>
      </div>
    );
  }
  render() {
    /**
     * Use a single composer function
     * to render the table
     */
    return (
      <div>
        {this.renderDataPointCount()}
        {this.composeTable()}
      </div>
    );
  }
}

export default DataTable;
