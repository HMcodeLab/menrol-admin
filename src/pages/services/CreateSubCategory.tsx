import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import the useLocation hook
import axios from 'axios';
import { IoMdAddCircle } from 'react-icons/io';
import { ImCross } from 'react-icons/im';
import toast, { Toaster } from 'react-hot-toast';

// Type definitions
interface Subcategory {
  title: string;
}

const CreateSubCategoryForm: React.FC = () => {
  const [category, setCategory] = useState<string>('');
  const [subcategories, setSubcategories] = useState<Subcategory[]>([
    { title: '' },
  ]);
  const [images, setImages] = useState<File[]>([]);

  // Use the useLocation hook to get the current URL and query parameters
  const location = useLocation();

  useEffect(() => {
    // Extract query parameters from the URL using URLSearchParams
    const queryParams = new URLSearchParams(location.search);
    const categoryFromQuery = queryParams.get('category');
    if (categoryFromQuery) {
      setCategory(categoryFromQuery);
    }
  }, [location]); // Only re-run when the location (URL) changes

  // Handle subcategory input changes
  const handleSubcategoryChange = (index: number, value: string) => {
    const updatedSubcategories = [...subcategories];
    updatedSubcategories[index].title = value;
    setSubcategories(updatedSubcategories);
  };

  // Reference for the hidden file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Add a new subcategory field
  const handleAddSubcategory = () => {
    setSubcategories([...subcategories, { title: '' }]);
  };

  // Remove a subcategory field
  const handleRemoveSubcategory = (index: number) => {
    const updatedSubcategories = subcategories.filter((_, i) => i !== index);
    setSubcategories(updatedSubcategories);
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  // Remove a specific file
  const handleRemoveFile = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Trigger the hidden file input
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('category', category);
    formData.append('subcategory', JSON.stringify(subcategories));
    images.forEach((image) => formData.append('subcategoryImages', image));

    try {
      const response = await axios.put(
        'https://api.menrol.com/api/v1/addSubCategory',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response) {
        toast.success('Service successfully created');
        setCategory('');
        setSubcategories([]);
        setImages([]);
        console.log('Response:', response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="form-container">
      <Toaster />
      <h1 className="text-3xl text-center font-bold underline py-4">Create SubCategory</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Category Input */}
        <div className="flex xl:flex-row md:flex-col xl:gap-2 xl:items-center mt-4">
          <label htmlFor="category" className="text-md font-semibold">
            Category
          </label>
          <input
            type="text"
            id="category"
            disabled
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category"
            className="px-3 py-2 rounded-md w-full text-black font-semibold bg-white"
            required
          />
        </div>

        {/* Subcategories */}
        <div className="flex flex-col gap-2 py-2">
          <label className="text-md font-semibold flex items-center gap-2">
            Subcategories
            <IoMdAddCircle
              className="dark:text-white text-green-500 text-xl cursor-pointer"
              onClick={handleAddSubcategory}
            />
          </label>
          {subcategories.map((subcategory, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={subcategory.title}
                onChange={(e) => handleSubcategoryChange(index, e.target.value)}
                placeholder="Enter subcategory title"
                className="px-3 py-2 rounded-md w-full text-black font-semibold bg-white placeholder:text-gray-200 focus:outline-none"
                required
              />
              <ImCross
                className="text-xl cursor-pointer text-red-500"
                onClick={() => handleRemoveSubcategory(index)}
              />
            </div>
          ))}
        </div>

        {/* Custom File Upload */}
        <div className="flex items-center gap-4">
          <label>Subcategory Images:</label>
          <button
            type="button"
            onClick={handleFileButtonClick}
            style={{
              display: 'block',
              marginTop: '0.5rem',
              cursor: 'pointer',
              padding: '0.5rem',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            Upload Images
          </button>
          <input
            type="file"
            id="subcategoryImages"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }} // Hide the file input
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          {images.map((image, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}
            >
              <span style={{ flexGrow: 1 }}>{image.name}</span>
              <ImCross
                className="text-xl cursor-pointer text-red-500"
                onClick={() => handleRemoveFile(index)}
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button type="submit" className="text-center bg-lime-500 text-white px-4 py-2 rounded-md center">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateSubCategoryForm;
