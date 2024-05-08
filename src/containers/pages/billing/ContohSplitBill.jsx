import React, { useState } from 'react';

const ContohSplitBill = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [splitAmount, setSplitAmount] = useState(0);

  const handleCalculateSplitAmount = () => {
    const split = totalAmount / numberOfPeople;
    setSplitAmount(split);
  };

  return (
    <div>
      <h1>Split Bill Calculator</h1>
      <label>Total Amount:</label>
      <input type="number" value={totalAmount} onChange={(e) => setTotalAmount(Number(e.target.value))} />

      <label>Number of People:</label>
      <input type="number" value={numberOfPeople} onChange={(e) => setNumberOfPeople(Number(e.target.value))} />

      <button onClick={handleCalculateSplitAmount}>Calculate Split</button>

      {splitAmount > 0 && (
        <div>
          <h2>Split Amount per Person:</h2>
          <p>{splitAmount}</p>
        </div>
      )}
    </div>
  );
};

export default ContohSplitBill;