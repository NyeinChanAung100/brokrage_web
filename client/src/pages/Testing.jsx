import React, { useState } from 'react';

function DepositForm() {
  const [userId, setUserId] = useState('');
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      user_id: parseInt(userId),
      item_id: parseInt(itemId),
      quantity: parseInt(quantity),
    };
    // http://localhost/brokrage_web/server/market/listItems.php

    try {
      const res = await fetch(
        'http://localhost/brokrage_web/server/user/deposit-assest.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );

      const result = await res.json();
      setResponse(result);
    } catch (error) {
      console.error('Error:', error);
      setResponse({ error: 'An error occurred' });
    }
  };

  return (
    <div>
      <h1>Deposit Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>User ID:</label>
          <input
            type='number'
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Item ID:</label>
          <input
            type='number'
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type='number'
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <button type='submit'>Deposit</button>
      </form>

      {response && (
        <div>
          <h2>Response:</h2>
          <pre>{JSON.stringify(response.error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default DepositForm;
