import React from 'react';
import {useCheckout} from '@stripe/react-stripe-js';
import { Button } from '@/sudoComponents/ui/button';


const PayButton = () => {
  const {confirm} = useCheckout();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleClick = () => {
    setLoading(true);
    confirm().then((result) => {
      if (result.type === 'error') {
        setError(result.type)
      }
      setLoading(false);
    })
  };

  return (
    <div className=''>
      <Button className='mx-auto hover:bg-blue-800 transition duration-150 bg-dark p-4 mt-2 text-white  rounded-lg shadow-md '
       disabled={loading} onClick={handleClick}>
        Pay
      </Button>
      {error && <div>{error}</div>}
    </div>
  )
};

export default PayButton;