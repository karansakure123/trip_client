import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updatePlace } from "../api/place";
import JoditEditor from 'jodit-react';

const UpdatePlace = () => {
  const { user } = useSelector((state) => state.user);
  const { currPlace } = useSelector((state) => state.place);

  const editor = useRef(null);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(currPlace?.title || '');
  const [location, setLocation] = useState(currPlace?.location || '');
  const [country, setCountry] = useState(currPlace?.country || '');
  const [price, setPrice] = useState(currPlace?.price || '');
  const [description, setDescription] = useState(currPlace?.description || '');
  const [url, setUrl] = useState(null);
  const [previewImage, setPreviewImage] = useState(currPlace?.image || null); // Set initial preview from existing image

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUrl(file);
      setPreviewImage(URL.createObjectURL(file)); // Update preview
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    if (!user) {
      return toast.error("You are not logged in.");
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (url) formData.append('image', url);
    formData.append('country', country);
    formData.append('price', price);
    formData.append('location', location);

    setLoading(true);
    try {
      await updatePlace(currPlace._id,formData);
      toast.success("Place updated successfully.");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth min-h-screen px-5 flex items-center justify-center">
      <div className="max-w-2xl mx-auto w-full bg-white my-24 px-5 py-8 border rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold">Update Place</h1>
          <button className="btn btn-success" onClick={() => navigate(-1)}>Back</button>
        </div>

        {/* Image Preview */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1 cursor-pointer">
            <div className="mb-5">
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="w-full h-52 object-cover rounded-lg border" />
              ) : (
                <div className="h-52 w-full flex items-center justify-center cursor-pointer rounded-lg hover:bg-gray-300 bg-gray-200 text-xl">
                  Upload Place Image
                </div>
              )}
            </div>
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-success w-full"
              placeholder="Enter place title"
              required
            />
          </div>

          <div>
            <JoditEditor
              ref={editor}
              value={description}
              tabIndex={1}
              onBlur={(newContent) => setDescription(newContent)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input input-success w-full"
                placeholder="Enter location"
                required
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-1">
                Country
              </label>
              <input
                type="text"
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="input input-success w-full"
                placeholder="Enter country"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input input-success w-full"
              placeholder="Enter price per day"
              min="0"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-success">
            {loading && <span className="loading loading-spinner"></span>}
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePlace;
