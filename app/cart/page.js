"use client"

import React, { useEffect, useState } from 'react';

// Component for displaying the cart page
export default function Page() {
  // State variable to store the cart data
  const [cart, setCart] = useState([]);

  // Effect hook to fetch cart data from the server
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
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
      const response = await fetch('/api/cart', {
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

  // JSX for rendering the component
  return (
    <div className='flex justify-center items-center m-20'>
      <div>
        {/* Display a message if the cart is empty */}
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          // Map over each sneaker in the cart and render SneakerInfo component
          cart.map((sneakerId) => (
            <SneakerInfo key={sneakerId} sneakerId={sneakerId} onRemove={removeFromCart} />
          ))
        )}
      </div>
    </div>
  );
}

// Component for displaying information about a single sneaker in the cart
function SneakerInfo({ sneakerId, onRemove }) {
  // State variable to store the sneaker data
  const [sneaker, setSneaker] = useState(null);

  // Effect hook to fetch sneaker data from the server
  useEffect(() => {
    const fetchSneaker = async () => {
      try {
        const response = await fetch('/api/sneaker', {
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

  // Function to handle removing a sneaker from the cart
  const handleRemove = async () => {
    try {
      const response = await fetch('/api/cart', {
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

  // JSX for rendering the component
  if (!sneaker) {
    return <div>Loading...</div>;
  }

  // Calculate discounted price if there's a sale
  const discountedPrice = sneaker.sale !== 'no' ? 
    (sneaker.price - (sneaker.price * sneaker.sale / 100)).toFixed(2) :
    null;

  return (
    <div className='flex flex-row bg-slate-400 m-2'>
      <img className='h-32 w-32' src={sneaker.picture} alt={sneaker.name} />
      <div className='flex justify-center  flex-col m-4'>
        <p className='font-bold'>{sneaker.title}</p>
        {/* Display discounted price and original price with strike-through */}
        {discountedPrice ? (
          <div className='flex'>
            <p className='text-green-600 mr-2 font-semibold'>${discountedPrice}</p>
            <p className='line-through text-gray-500'>${sneaker.price}</p>
          </div>
        ) : (
          <p>${sneaker.price}</p>
        )}
        {/* Button to remove sneaker from cart */}
        <button className='bg-red-500 rounded-md cursor-pointer w-20' onClick={handleRemove}>Remove</button>
      </div>
    </div>
  );
        }
