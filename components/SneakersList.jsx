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
    <>
      Sneakers List:
      {sneakers && sneakers.map((t) => (
        <div
          key={t._id}
          className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start"
        >
          <div>
            <h2 className="font-bold text-2xl text-yellow-200">{t.title}</h2>
            <img className="w-20 h-20 "src={t.picture} alt={t.title} />
            <div>{t.description}</div>
          </div>
        </div>
      ))}
    </>
  );
}
