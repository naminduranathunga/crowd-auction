import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TopNav } from '../components/TopNav';
import { Camera, X, ArrowLeft } from 'lucide-react';
export function CreateListing() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [duration, setDuration] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
      );
      setImages([...images, ...newImages]);
    }
  };
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Listing published!');
    navigate('/seller/listings');
  };
  const handleSaveDraft = () => {
    alert('Listing saved as draft');
    navigate('/seller/listings');
  };
  const inputClass =
  'w-full px-4 py-2 bg-white/40 backdrop-blur-sm border border-white/60 rounded-2xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-800/30 focus:border-slate-800/40';
  return (
    <div className="min-h-screen">
      <TopNav />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/seller/listings"
          className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 mb-6 font-medium">
          
          <ArrowLeft className="w-4 h-4" />
          Back to listings
        </Link>

        <h1 className="text-3xl font-semibold text-slate-800 mb-8">
          Create new listing
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card rounded-3xl p-6 space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700 mb-1">
                
                Item Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                required />
              
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700 mb-1">
                
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={`${inputClass} resize-none`}
                required />
              
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-slate-700 mb-1">
                
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
                required>
                
                <option value="">Select a category</option>
                <option value="watches">Watches</option>
                <option value="art">Art</option>
                <option value="books">Books</option>
                <option value="fashion">Fashion</option>
                <option value="electronics">Electronics</option>
                <option value="collectibles">Collectibles</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="startingPrice"
                className="block text-sm font-medium text-slate-700 mb-1">
                
                Starting Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
                  $
                </span>
                <input
                  id="startingPrice"
                  type="number"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(e.target.value)}
                  className={`${inputClass} pl-8`}
                  min="1"
                  step="0.01"
                  required />
                
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDateTime"
                  className="block text-sm font-medium text-slate-700 mb-1">
                  
                  Start Date and Time
                </label>
                <input
                  id="startDateTime"
                  type="datetime-local"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  className={inputClass}
                  required />
                
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-slate-700 mb-1">
                  
                  Duration
                </label>
                <div className="relative">
                  <input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className={inputClass}
                    min="1"
                    required />
                  
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm">
                    minutes
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Images
              </label>
              <div className="border-2 border-dashed border-slate-400 bg-white/30 backdrop-blur-sm rounded-3xl p-8 text-center hover:border-slate-600 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload" />
                
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Camera className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                  <p className="text-sm text-slate-600">
                    Drag and drop images or click to upload
                  </p>
                </label>
              </div>

              {images.length > 0 &&
              <div className="grid grid-cols-4 gap-3 mt-4">
                  {images.map((img, idx) =>
                <div key={idx} className="relative group">
                      <img
                    src={img}
                    alt=""
                    className="w-full aspect-square object-cover rounded-2xl" />
                  
                      <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                )}
                </div>
              }
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex-1 px-6 py-3 bg-white/40 backdrop-blur-sm border border-white/60 text-slate-800 rounded-full font-semibold hover:bg-white/60 transition-colors">
              
              Save as draft
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-slate-800 text-white rounded-full font-semibold hover:bg-slate-900 transition-colors">
              
              Publish listing
            </button>
          </div>
        </form>
      </div>
    </div>);

}