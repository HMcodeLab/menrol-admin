import { useEffect, useState } from 'react';
import { BASE_URL } from '../../App';
import { MdDelete, MdEditSquare, MdAdd } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';
import DeleteServiceModal from '../../components/modals/DeleteService';
import { useNavigate } from 'react-router-dom';
import Loader from '../../common/Loader';

interface Subcategory {
  image: string;
  title: string;
}

interface Service {
  category: string;
  subcategory: Subcategory[];
}

function AllServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteServiceModalOpen, setDeleteServiceModalOpen] = useState(false);
  const [deleteSubCateoryModalOpen, setDeleteSubCateoryModalOpen] = useState(false);

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  const navigation = useNavigate();

  // Fetch services data
  const fetchServices = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getAllServices`);
      if (response.ok) {
        const data = await response.json();
        setServices(data.data);
      } else {
        toast.error('Failed to fetch services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Error fetching services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  function handleAddService() {
    navigation('/services/create');
  }

  // Open delete modal and set selected service
  const openDeleteModal = (category: string) => {
    setSelectedService(category);
    setDeleteServiceModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteServiceModalOpen(false);
    setSelectedService(null);
  };

  // Open delete modal and set selected category and SubCategory
  const openDeleteSubCateoryModal = (category: string,subCategory:string) => {
    setSelectedService(category);
    setSelectedSubCategory(subCategory)
    setDeleteSubCateoryModalOpen(true);
  };

  // Close delete modal
  const closeDeleteSubCateoryModal = () => {
    setDeleteSubCateoryModalOpen(false);
    setSelectedService(null);
    setSelectedSubCategory(null);
  };



  // Handle service deletion
  const handleDeleteService = async () => {
    if (!selectedService) return;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/deleteService`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: selectedService }),
      });
      if (response.ok) {
        toast.success('Service deleted successfully');
        fetchServices(); // Refresh services list
      } else {
        toast.error('Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Error deleting service');
    } finally {
      setLoading(false);
      closeDeleteModal();
    }
  };

//   Handle subCategory deletion
const handleDeleteSubCategory = async () => {
    if (!selectedService) return;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/removeSubCategory`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: selectedService,subcategoryTitle:selectedSubCategory }),
      });
      if (response.ok) {
        toast.success('Service deleted successfully');
        fetchServices(); // Refresh services list
      } else {
        toast.error('Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Error deleting service');
    } finally {
      setLoading(false);
      closeDeleteModal();
    }
  };

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className="rounded-md border border-stroke bg-white px-5 pt-6 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <Toaster />
      <div className="flex items-center gap-4 mb-4">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Services
        </h4>
        <MdAdd
          className="text-blue-500 cursor-pointer text-2xl"
          onClick={handleAddService}
        />
      </div>

      <div className="flex flex-col pb-4">
        {services.map((service, serviceIndex) => (
          <div
            className="flex flex-col rounded-md my-2 bg-gray-100 dark:bg-meta-4 sm:grid-cols-2"
            key={serviceIndex}
          >
            {/* Service Header */}
            <div className="p-2.5 xl:p-5">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  {service.category}
                </h5>
                <div className="flex items-center gap-3">
                  <MdAdd
                    className="text-blue-500 cursor-pointer text-2xl"
                    onClick={() => {
                      // Ensure service.category is correctly defined
                      navigation(
                        `/services/addSubCategory?category=${service.category}`,
                      );
                    }}
                  />
                  <MdEditSquare
                    className="text-yellow-400 cursor-pointer text-2xl"
                    onClick={() => toast.success('Edit service coming soon!')}
                  />
                  <MdDelete
                    className="text-red-500 cursor-pointer text-2xl"
                    onClick={() => openDeleteModal(service.category)}
                  />
                </div>
              </div>
            </div>

            {/* Subcategory Table */}
            <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold border-b">
                    Image
                  </th>
                  <th className="py-3 px-4 text-left font-semibold border-b">
                    Title
                  </th>
                  <th className="py-3 px-4 text-left font-semibold border-b">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {service.subcategory.map((subcategory, index) => (
                  <tr
                    key={index}
                    className="hover:bg-green-50 transition duration-150"
                  >
                    <td className="py-3 px-4 border-b">
                      <img
                        src={subcategory.image}
                        alt={subcategory.title}
                        className="w-20 object-center rounded-md"
                      />
                    </td>
                    <td className="py-3 px-4 border-b text-gray-600 ">
                      {subcategory.title}
                    </td>
                    <td className="py-3 px-4 border-b">
                      <div className="flex items-center gap-3">
                        {/* <MdEditSquare
                          className="text-yellow-400 cursor-pointer text-2xl"
                          onClick={() =>
                            toast.success('Edit subcategory coming soon!')
                          }
                        /> */}
                        <MdDelete
                          className="text-red-500 cursor-pointer text-2xl"
                          onClick={() =>
                            openDeleteSubCateoryModal(service.category,subcategory.title)
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Delete Service Modal */}
      {deleteServiceModalOpen && (
        <DeleteServiceModal
          modalOpen={deleteServiceModalOpen}
          modalClose={closeDeleteModal}
          handleDelete={handleDeleteService}
        />
      )}

      {/* Delete SubCateory Modal */}
      {deleteSubCateoryModalOpen && (
        <DeleteServiceModal
          modalOpen={deleteSubCateoryModalOpen}
          modalClose={closeDeleteSubCateoryModal}
          handleDelete={handleDeleteSubCategory}
        />
      )}
    </div>
  );
}

export default AllServices;
