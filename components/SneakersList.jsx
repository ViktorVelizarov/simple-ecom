"use client"

import React, { useState, useEffect } from 'react';

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
  const [sneakers, setSneakers] = useState([]);
  const [filteredSneakers, setFilteredSneakers] = useState([]);
  const [colors, setColors] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const { sneakers } = await getSneakers();
      setSneakers(sneakers);
      const uniqueColors = Array.from(new Set(sneakers.map(sneaker => sneaker.color)));
      setColors(['All', ...uniqueColors]);
    };
    fetchData();
  }, []);

  const filterSneakersByColor = (color) => {
    if (color === 'All') {
      setFilteredSneakers([]);
    } else {
      const filtered = sneakers.filter(sneaker => sneaker.color === color);
      setFilteredSneakers(filtered);
    }
    setSelectedColor(color);
  }

  return (
    <div>
      <select value={selectedColor} onChange={(e) => filterSneakersByColor(e.target.value)}>
        {colors.map((color, index) => (
          <option key={index} value={color}>{color}</option>
        ))}
      </select>

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
          </div>
        ))}
      </div>
    </div>
  );
}
