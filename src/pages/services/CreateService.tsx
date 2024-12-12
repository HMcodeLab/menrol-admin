import React, { useRef, useState } from 'react';
import axios from 'axios';
import { IoMdAddCircle } from 'react-icons/io';
import { ImCross } from 'react-icons/im';
import toast, { Toaster } from 'react-hot-toast';

interface Subcategory {
  title: string;
}

const CreateServiceForm: React.FC = () => {
  const [category, setCategory] = useState<string>('');
  const [subcategories, setSubcategories] = useState<Subcategory[]>([{ title: '' }]);
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubcategoryChange = (index: number, value: string) => {
    const updatedSubcategories = [...subcategories];
    updatedSubcategories[index].title = value;
    setSubcategories(updatedSubcategories);
  };

  const handleAddSubcategory = () => {
    setSubcategories([...subcategories, { title: '' }]);
  };

  const handleRemoveSubcategory = (index: number) => {
    const updatedSubcategories = subcategories.filter((_, i) => i !== index);
    setSubcategories(updatedSubcategories);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('category', category);
    formData.append('subcategory', JSON.stringify(subcategories));
    images.forEach((image) => formData.append('subcategoryImages', image));

    try {
      const response = await axios.post(
        'https://api.menrol.com/api/v1/createService',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      toast.success('Service successfully created');
      setCategory('');
      setSubcategories([{ title: '' }]);
      setImages([]);
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create service');
    }
  };

  return (
    <div className=" flex items-center justify-center bg-white dark:bg-[#1a222c]  ">
      <Toaster />
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full dark:bg-boxdark dark:text-white">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Create Service
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Input */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Subcategories */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Subcategories
              </label>
              <IoMdAddCircle
                className="text-green-500 text-2xl cursor-pointer"
                onClick={handleAddSubcategory}
              />
            </div>
            <div className="space-y-4 mt-4">
              {subcategories.map((subcategory, index) => (
                <div key={index} className="flex items-center gap-4">
                  <input
                    type="text"
                    value={subcategory.title}
                    onChange={(e) => handleSubcategoryChange(index, e.target.value)}
                    placeholder="Enter subcategory title"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <ImCross
                    className="text-red-500 text-lg cursor-pointer"
                    onClick={() => handleRemoveSubcategory(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
              Subcategory Images
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleFileButtonClick}
                className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
              >
                Upload Images
              </button>
              <input
                type="file"
                id="subcategoryImages"
                multiple
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
            </div>
            <div className="mt-4 space-y-2">
              {images.map((image, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                  <span className="text-gray-700 text-sm">{image.name}</span>
                  <ImCross
                    className="text-red-500 text-lg cursor-pointer"
                    onClick={() => handleRemoveFile(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-green-500 text-white font-medium rounded-md shadow-sm hover:bg-green-600 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateServiceForm;
