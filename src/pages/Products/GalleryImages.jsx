import React from "react";

const GalleryImages = ({
  gallery,
  removeImage,
  newGalleryImage,
  confirmAddImage,
  handleImageChange,
  cancelAddImage,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Gallery Images
      </label>
      <div className="grid grid-cols-3 gap-3">
        {gallery.map((img, index) => (
          <div key={index} className="relative group">
            <img
              src={img}
              alt={`Gallery ${index + 1}`}
              className="h-28 w-full object-cover rounded border border-gray-200"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove image"
            >
              ×
            </button>
          </div>
        ))}
        <div className="border-2 border-dashed border-gray-300 rounded h-28 flex items-center justify-center">
          {newGalleryImage ? (
            <div className="relative">
              <img
                src={newGalleryImage.url}
                alt="New gallery"
                className="h-24 object-contain"
              />
              <div className="flex justify-center mt-1 space-x-2">
                <button
                  onClick={confirmAddImage}
                  className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                >
                  Add
                </button>
                <button
                  onClick={cancelAddImage}
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
                id="gallery-upload"
              />
              <label
                htmlFor="gallery-upload"
                className="text-gray-400 text-sm cursor-pointer p-2 text-center"
              >
                <svg
                  className="mx-auto h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <div>Add Image</div>
              </label>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryImages;
