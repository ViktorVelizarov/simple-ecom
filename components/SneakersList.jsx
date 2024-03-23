"use client"

import React, { useState, useEffect, useRef } from 'react';

const getSneakers = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/sneakers");

    if (!res.ok) {
      throw new Error("Failed to fetch sneakers");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading sneakers: ", error);
    return { sneakers: [] };
  }
};

export default function SneakersList() {
  const [selectedColor, setSelectedColor] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sneakers, setSneakers] = useState([]);
  const [filteredSneakers, setFilteredSneakers] = useState([]);
  const [colors, setColors] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // State for managing popup visibility
  const popupRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const { sneakers } = await getSneakers();
      setSneakers(sneakers);
      const uniqueColors = Array.from(new Set(sneakers.map(sneaker => sneaker.color)));
      setColors(['All', ...uniqueColors]);
      const uniqueTypes = Array.from(new Set(sneakers.map(sneaker => sneaker.type)));
      setTypes(['All', ...uniqueTypes]);
      const uniqueCategories = Array.from(new Set(sneakers.map(sneaker => sneaker.category)));
      setCategories(['All', ...uniqueCategories]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  const filterSneakers = () => {
    let filtered = sneakers;
    if (selectedColor !== 'All') {
      filtered = filtered.filter(sneaker => sneaker.color === selectedColor);
    }
    if (selectedType !== 'All') {
      filtered = filtered.filter(sneaker => sneaker.type === selectedType);
    }
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(sneaker => sneaker.category === selectedCategory);
    }
    setFilteredSneakers(filtered);
  }

  const handleColorChange = (color) => {
    setSelectedColor(color);
  }

  const handleTypeChange = (type) => {
    setSelectedType(type);
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  }

  const addToCart = async (sneakerId) => {
    try {
      const response = await fetch("http://localhost:3000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ sneakerId })
      });

      if (!response.ok) {
        throw new Error("Failed to add sneaker to cart");
      }

      // Set showPopup to true to display the popup
      setShowPopup(true);

      // After 3 seconds, hide the popup
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    } catch (error) {
      console.error("Error adding sneaker to cart:", error);
    }
  }

  useEffect(() => {
    filterSneakers();
  }, [selectedColor, selectedType, selectedCategory, sneakers]);

  return (
    <div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div ref={popupRef} className="bg-white p-4 rounded-md">
            Item added to cart
          </div>
        </div>
      )}

      <div className='flex flex-row ml-14 mr-14'>
        <div className='bg-gray-400 p-3'>
          <label htmlFor="colorSelect">Color:</label>
          <select id="colorSelect" value={selectedColor} onChange={(e) => handleColorChange(e.target.value)}>
            {colors.map((color, index) => (
              <option key={index} value={color}>{color}</option>
            ))}
          </select>
        </div>
        <div className='bg-gray-400 p-3'>
          <label htmlFor="typeSelect">Type:</label>
          <select id="typeSelect" value={selectedType} onChange={(e) => handleTypeChange(e.target.value)}>
            {types.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className='bg-gray-400 p-3'>
          <label htmlFor="categorySelect">Category:</label>
          <select id="categorySelect" value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)}>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 ml-14 mr-14">
        {(filteredSneakers.length > 0 ? filteredSneakers : sneakers).map((t) => (
          <div
            key={t._id}
            className="border border-slate-300 my-3 flex flex-col justify-between items-start p-4"
          >
            <img className="w-full h-full" src={t.picture} alt={t.title} />
            <div>
              <h2 className="font-bold text-lg">{t.title}</h2>
              <p className='text-gray-500 font-medium'>{t.type}</p>
              <p className='text-gray-500 font-medium'>{t.category}</p>
              {t.sale !== "no" ? (
                <div className="flex flex-row">
                  <p className='mt-3 font-semibold text-green-500'>
                    Sale Price: ${(t.price - (t.price * t.sale / 100)).toFixed(2)}
                  </p>
                  <p className='mt-3 ml-2 line-through'>${t.price}</p>
                </div>
              ) : (
                <p className='mt-3 font-semibold'>Price: ${t.price}</p>
              )}
            </div>
            <button className='bg-green-500 p-2 rounded-md mt-3 font-semibold' onClick={() => addToCart(t._id)}>Add to cart</button>

          </div>
        ))}
      </div>
    </div>
  );
}
