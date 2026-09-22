import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newCat, setNewCat] = useState({ nameEn: '', descriptionEn: '', icon: 'Tool', color: 'bg-primary' });

  const fetchCategories = async () => {
    try {
      const res = await api.get('/admin/categories');
      setCategories(res.data.data);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/categories', newCat);
      toast.success('Category added successfully!');
      setIsAdding(false);
      setNewCat({ nameEn: '', descriptionEn: '', icon: 'Tool', color: 'bg-primary' });
      fetchCategories();
    } catch (err) {
      toast.error('Failed to add category');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading categories...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Service Categories</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="px-4 py-2 bg-primary text-white rounded font-medium hover:bg-secondary transition-colors">
          {isAdding ? 'Cancel' : '+ Add New Category'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddCategory} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input required type="text" value={newCat.nameEn} onChange={e => setNewCat({...newCat, nameEn: e.target.value})} className="w-full border p-2 rounded" placeholder="e.g. Plumbing" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name (Lucide React)</label>
              <input required type="text" value={newCat.icon} onChange={e => setNewCat({...newCat, icon: e.target.value})} className="w-full border p-2 rounded" placeholder="e.g. Wrench" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input type="text" value={newCat.descriptionEn} onChange={e => setNewCat({...newCat, descriptionEn: e.target.value})} className="w-full border p-2 rounded" placeholder="Brief description..." />
            </div>
          </div>
          <button type="submit" className="px-6 py-2 bg-success text-white rounded font-medium hover:bg-green-700">Save Category</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div key={cat._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-800">{cat.nameEn}</h3>
              <p className="text-sm text-gray-500">{cat.descriptionEn || 'No description'}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${cat.color || 'bg-primary'}`}>
              <span className="font-bold text-xs">{cat.icon}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
