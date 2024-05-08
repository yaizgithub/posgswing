import React, { useState } from 'react';
import { Select } from 'antd';
// import 'antd/dist/antd.css';

const { Option } = Select;

const CombineMultipleSelect = () => {
  const [selectedValues1, setSelectedValues1] = useState([]);
  const [selectedValues2, setSelectedValues2] = useState([]);
  const [selectedValues3, setSelectedValues3] = useState([]);
  const [combinedValues, setCombinedValues] = useState([]);

  const handleSelect1Change = (values) => {
    setSelectedValues1(values);
    combineValues();
  };

  const handleSelect2Change = (values) => {
    setSelectedValues2(values);
    combineValues();
  };

  const handleSelect3Change = (values) => {
    setSelectedValues3(values);
    combineValues();
  };

  const combineValues = () => {
    const combined = [
      ...selectedValues1.map(value => ({ component: 1, value })),
      ...selectedValues2.map(value => ({ component: 2, value })),
      ...selectedValues3.map(value => ({ component: 3, value }))
    ];
    setCombinedValues(combined);
  };

  return (
    <div>
      <Select
        mode="multiple"
        placeholder="Please select"
        style={{ width: '100%' }}
        onChange={handleSelect1Change}
        value={selectedValues1}
      >
        <Option value="value1">Value 1</Option>
        <Option value="value2">Value 2</Option>
        <Option value="value3">Value 3</Option>
      </Select>

      <Select
        mode="multiple"
        placeholder="Please select"
        style={{ width: '100%' }}
        onChange={handleSelect2Change}
        value={selectedValues2}
      >
        <Option value="value4">Value 4</Option>
        <Option value="value5">Value 5</Option>
        <Option value="value6">Value 6</Option>
      </Select>

      <Select
        mode="multiple"
        placeholder="Please select"
        style={{ width: '100%' }}
        onChange={handleSelect3Change}
        value={selectedValues3}
      >
        <Option value="value7">Value 7</Option>
        <Option value="value8">Value 8</Option>
        <Option value="value9">Value 9</Option>
      </Select>

      <div>
        <h2>Combined Values:</h2>
        {combinedValues.map((item, index) => (
          <p key={index}>{`Component: ${item.component}, Value: ${item.value}`}</p>
        ))}
      </div>
    </div>
  );
};

export default CombineMultipleSelect;
