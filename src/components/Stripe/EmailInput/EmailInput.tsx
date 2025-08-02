import React from 'react';
import {useCheckout} from '@stripe/react-stripe-js';

const EmailInput = () => {
  const checkout = useCheckout();
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState("");

  const handleBlur = () => {
    checkout.updateEmail(email).then((result) => {
      if (result.type==='error') {
        setError(result.error.message);
      }
    })
  };

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setEmail(e.target.value);
  };
  return (
    <div>
      <input
        type="text"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        className='bg-gray-400 p-2 rounded-lg shadow-md w-full mb-4'
      />
      {error && <div>{error}</div>}
    </div>
  );
};

export default EmailInput;