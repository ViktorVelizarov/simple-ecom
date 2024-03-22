
const getSneakers = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/sneakers", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch sneakers");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading sneakers: ", error);
    return { sneakers: [] }; // Return an empty array or handle the error in a different way
  }
};

export default async function SneakersList() {
  const { sneakers } = await getSneakers();

  return (
    <div className="grid grid-cols-3 gap-4 ml-14 mr-14">
      {sneakers && sneakers.map((t) => (
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
  );
}
