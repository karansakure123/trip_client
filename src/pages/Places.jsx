import { useState, lazy } from "react";
import { useSelector } from "react-redux";

// Lazy-loaded components
const PlaceCard = lazy(() => import('../components/PlaceCard'));
const HomePageLoading = lazy(() => import('../components/HomePageLoading'));
const Searchbar = lazy(() => import('../components/Searchbar'));

import useFetchPlaces from "../hooks/useFetchPlaces";

const Places = () => {
  useFetchPlaces();
  const { places, isLoading, searchTerm } = useSelector((state) => state.place);
  const [filter, setFilter] = useState(""); // For sorting filter

  // Fallback to an empty array if places is not an array
  const safePlaces = Array.isArray(places) ? places : [];

  // Filter places based on searchTerm
  const filteredPlaces = safePlaces.filter((place) => {
    const search = searchTerm.toLowerCase();
    return (
      place.title.toLowerCase().includes(search) ||
      place.location.toLowerCase().includes(search) ||
      place.country.toLowerCase().includes(search)
    );
  });

  // Sort places based on price
  const sortedPlaces = [...filteredPlaces].sort((a, b) => {
    if (filter === "asc") return a.price - b.price;
    if (filter === "desc") return b.price - a.price;
    return 0;
  });

  return (
    <div>
      {!isLoading && (
        <div className="max-w-6xl mx-auto px-5 mt-12 w-full flex gap-5 justify-between items-center">
          <div>
            <select
              className="select select-bordered w-full max-w-xs rounded-full bg-white shadow-xl"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>
          <div className="lg:w-1/3 w-1/2">
            <Searchbar />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-5 mt-12 mb-24">
        {isLoading ? (
          <HomePageLoading />
        ) : (
          <>
            {sortedPlaces.length > 0 ? (
              <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-12">
                {sortedPlaces.map((place) => (
                  <PlaceCard key={place._id} place={place} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 col-span-full">
                No places found.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Places;
