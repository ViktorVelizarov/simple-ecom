"use client"

import { useEffect, useState } from 'react';

export default function Page() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/cart');
        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }
        const data = await response.json();
        setCart(data.cart.sneakers);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, []);

  // Function to remove a sneaker from the cart and update the cart state
  const removeFromCart = async (sneakerIdToRemove) => {
    try {
      const response = await fetch('http://localhost:3000/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sneakerId: sneakerIdToRemove })
      });

      if (!response.ok) {
        throw new Error('Failed to remove sneaker from cart');
      }

      // Update the cart state by filtering out the removed sneaker
      setCart(prevCart => prevCart.filter(id => id !== sneakerIdToRemove));
    } catch (error) {
      console.error(`Error removing sneaker ${sneakerIdToRemove} from cart:`, error);
    }
  };

  return (
    <div className='flex justify-center items-center m-20'>
      <div>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map((sneakerId) => (
            <SneakerInfo key={sneakerId} sneakerId={sneakerId} onRemove={removeFromCart} />
          ))
        )}
      </div>
    </div>
  );
}

function SneakerInfo({ sneakerId, onRemove }) {
  const [sneaker, setSneaker] = useState(null);

  useEffect(() => {
    const fetchSneaker = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/sneaker', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sneakerId })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch sneaker');
        }

        const data = await response.json();
        setSneaker(data.sneaker);
      } catch (error) {
        console.error(`Error fetching sneaker ${sneakerId}:`, error);
      }
    };

    fetchSneaker();
  }, [sneakerId]);

  const handleRemove = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sneakerId })
      });

      if (!response.ok) {
        throw new Error('Failed to remove sneaker from cart');
      }

      // Call the onRemove callback to update the UI
      onRemove(sneakerId);
    } catch (error) {
      console.error(`Error removing sneaker ${sneakerId} from cart:`, error);
    }
  };


  if (!sneaker) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-row bg-slate-400'>
      <img className='h-32 w-32' src={sneaker.picture} alt={sneaker.name} />
      <div className='flex justify-center  flex-col m-4'>
        <p>{sneaker.title}</p>
        <p>${sneaker.price}</p>
        <button onClick={handleRemove}>Remove</button>
      </div>
    </div>
  );
}
