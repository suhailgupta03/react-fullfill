import React from "react";
import { Select, Input } from "antd";
const { Option } = Select;

export default React.memo(props => {
  const { onSearchStringChanged } = props;

  /**
   * Fired when there is a change in the search bar
   */
  function onInputChanged(text) {
    onSearchStringChanged(text.target.value);
  }

  return (
    <div className="mb-4 mt-3">
      <Input
        onChange={onInputChanged}
        addonBefore={
          <Select defaultValue="Filter ">
            <Option value="by-name">name</Option>
          </Select>
        }
        placeholder="Search items"
      />
    </div>
  );
});
