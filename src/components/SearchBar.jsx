import React from "react";

const SearchBar = ({ city, setCity, handleSearch }) => {
  return (
    <div className="flex items-center gap-2 p-2 ">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Search for a city..."
        className="flex-1 h-12 px-4 bg-[#D9D9D9] text-black rounded-lg focus:outline-none"
      />
      <button
        onClick={() => handleSearch(city)}
        className="bg-blue-500 h-12 text-white rounded-lg px-4 hover:bg-blue-600 transition"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
