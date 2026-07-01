import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { TopNav } from '../components/TopNav';
import { Camera, X, ArrowLeft, AlertCircle } from 'lucide-react';
import { getAuctionById, updateAuction, updateItem, AuctionResponse, ItemImageResponse } from '../services/itemApi';
import { ConfirmModal } from '../components/ConfirmModal';

export function EditListing() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [auction, setAuction] = useState<AuctionResponse | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');
  const [startingPrice, setStartingPrice] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [existingImages, setExistingImages] = useState<ItemImageResponse[]>([]);
  const [newImages, setNewImages] = useState<Array<{ file: File; previewUrl: string }>>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        if (!id) return;
        const data = await getAuctionById(id);
        setAuction(data);
        setTitle(data.name || '');
        setDescription(data.description || '');
        // Load category from local storage
        const storedCat = localStorage.getItem(`auction_category_${id}`);
        setCategory(storedCat || 'other');
        
        if (data.startTime) {
          const startStr = data.startTime.endsWith('Z') ? data.startTime : `${data.startTime}Z`;
          const d = new Date(startStr);
          if (!isNaN(d.getTime())) {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            setStartDateTime(`${year}-${month}-${day}T${hours}:${minutes}`);
          }
        }
        
        if (data.startTime && data.endTime) {
          const startStr = data.startTime.endsWith('Z') ? data.startTime : `${data.startTime}Z`;
          const endStr = data.endTime.endsWith('Z') ? data.endTime : `${data.endTime}Z`;
          const startMs = new Date(startStr).getTime();
          const endMs = new Date(endStr).getTime();
          if (!isNaN(startMs) && !isNaN(endMs)) {
            const diffMs = endMs - startMs;
            setDuration(String(Math.round(diffMs / 60000)));
          }
        }

        if (data.items && data.items.length > 0) {
          setStartingPrice(String(data.items[0].startPrice || ''));
          setExistingImages(data.items[0].images || []);
        }
      } catch (err) {
        console.error('Failed to load auction', err);
        setError('Failed to load listing details.');
      } finally {
        setLoading(false);
      }
    };
    fetchAuction();
  }, [id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      return;
    }

    const nextImages = Array.from(files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setNewImages((currentImages) => [...currentImages, ...nextImages]);
    e.target.value = '';
  };

  const removeNewImage = (index: number) => {
    setNewImages((currentImages) => {
      const nextImages = currentImages.filter((_, currentIndex) => currentIndex !== index);
      URL.revokeObjectURL(currentImages[index]?.previewUrl);
      return nextImages;
    });
  };

  const buildEndTime = (startStr: string, durationMinutes: string) => {
    const startMs = new Date(startStr).getTime();
    const endMs = startMs + parseInt(durationMinutes) * 60000;
    return new Date(endMs).toISOString().slice(0, 19);
  };

  const submitListing = async (status: string) => {
    if (!id || !auction) return;
    
    setSaving(true);
    setError(null);
    try {
      await updateAuction(id, {
        name: title,
        description,
        startTime: new Date(startDateTime).toISOString().slice(0, 19),
        endTime: buildEndTime(startDateTime, duration),
        status: status as any,
      });

      if (auction.items && auction.items.length > 0) {
        const itemId = auction.items[0].id;
        await updateItem(
          id,
          itemId,
          {
            name: title,
            description,
            startPrice: Number(startingPrice),
          },
          newImages.map((image) => image.file)
        );
      }

      localStorage.setItem(`auction_category_${id}`, category);

      navigate('/seller/listings');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update listing.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full px-4 py-2 bg-white/40 backdrop-blur-sm border border-white/60 rounded-2xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-800/30 focus:border-slate-800/40';

  if (loading) {
    return (
      <div className="min-h-screen">
        <TopNav />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-600">
          Loading listing...
        </div>
      </div>
    );
  }

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

        {error && (
          <div className="flex items-start gap-3 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-4 mb-6">
            <AlertCircle className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-900">{error}</p>
          </div>
        )}

        <div className="flex items-start gap-3 bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-4 mb-6">
          <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900">
            You can only edit this item before the auction starts.
          </p>
        </div>

        <h1 className="text-3xl font-semibold text-slate-800 mb-8">
          Edit listing
        </h1>

        <form onSubmit={(e) => { e.preventDefault(); submitListing(auction?.status || 'DRAFT'); }} className="space-y-6">
          <div className="glass-card rounded-3xl p-6 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                Item Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                required 
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={`${inputClass} resize-none`}
                required 
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
                required>
                <option value="electronics">Electronics</option>
                <option value="antiques">Antiques</option>
                <option value="collectibles">Collectibles</option>
                <option value="art">Art</option>
                <option value="jewelry_watches">Jewelry &amp; Watches</option>
                <option value="vehicles">Vehicles</option>
                <option value="fashion">Fashion</option>
                <option value="home_furniture">Home &amp; Furniture</option>
                <option value="books_manuscripts">Books &amp; Manuscripts</option>
                <option value="musical_instruments">Musical Instruments</option>
                <option value="sports_outdoors">Sports &amp; Outdoors</option>
                <option value="coins_bullion">Coins &amp; Bullion</option>
                <option value="luxury_goods">Luxury Goods</option>
                <option value="office_equipment">Office Equipment</option>
                <option value="industrial_equipment">Industrial Equipment</option>
                <option value="cameras_photography">Cameras &amp; Photography</option>
                <option value="toys_hobbies">Toys &amp; Hobbies</option>
                <option value="health_beauty">Health &amp; Beauty</option>
                <option value="garden_outdoor">Garden &amp; Outdoor</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="startingPrice" className="block text-sm font-medium text-slate-700 mb-1">
                Starting Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">$</span>
                <input
                  id="startingPrice"
                  type="number"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(e.target.value)}
                  className={`${inputClass} pl-8`}
                  min="1"
                  step="0.01"
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDateTime" className="block text-sm font-medium text-slate-700 mb-1">
                  Start Date and Time
                </label>
                <input
                  id="startDateTime"
                  type="datetime-local"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  className={inputClass}
                  required 
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-1">
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
                    required 
                  />
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
                  id="image-upload" 
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Camera className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                  <p className="text-sm text-slate-600">
                    Drag and drop images or click to upload
                  </p>
                </label>
              </div>

              {existingImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-600 mb-2">Current images</p>
                  <div className="grid grid-cols-4 gap-3">
                    {existingImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.imageUrl}
                          alt={image.originalFilename || ''}
                          className="w-full aspect-square object-cover rounded-2xl"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {newImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-600 mb-2">New images to upload</p>
                  <div className="grid grid-cols-4 gap-3">
                    {newImages.map((image, idx) => (
                      <div key={idx} className="relative group">
                        <img src={image.previewUrl} alt="" className="w-full aspect-square object-cover rounded-2xl" />
                        <button
                          type="button"
                          onClick={() => removeNewImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            {auction?.status === 'DRAFT' ? (
              <>
                <button
                  type="button"
                  onClick={() => submitListing('DRAFT')}
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-white/40 backdrop-blur-sm border border-white/60 text-slate-800 rounded-full font-semibold hover:bg-white/60 transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save as Draft'}
                </button>
                <button
                  type="button"
                  onClick={() => submitListing('PENDING')}
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-slate-800 text-white rounded-full font-semibold hover:bg-slate-900 transition-colors disabled:opacity-50">
                  Publish Listing
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => submitListing(auction?.status as string)}
                disabled={saving}
                className="flex-1 px-6 py-3 bg-slate-800 text-white rounded-full font-semibold hover:bg-slate-900 transition-colors disabled:opacity-50">
                {saving ? 'Updating...' : 'Update Listing'}
              </button>
            )}

            {(auction?.status === 'DRAFT' || auction?.status === 'PENDING' || auction?.status === 'ACTIVE') && (
              <button
                type="button"
                onClick={() => setShowCancelConfirm(true)}
                disabled={saving}
                className="flex-none px-6 py-3 bg-red-500/10 text-red-600 rounded-full font-semibold hover:bg-red-500/20 transition-colors disabled:opacity-50">
                Cancel Auction
              </button>
            )}
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={showCancelConfirm}
        title="Cancel Auction"
        message="Are you sure you want to cancel this auction? This action cannot be undone."
        onConfirm={() => {
          setShowCancelConfirm(false);
          submitListing('CANCELLED');
        }}
        onCancel={() => setShowCancelConfirm(false)}
        confirmText="Yes, cancel it"
        cancelText="No, keep it"
        isDestructive={true}
      />
    </div>
  );
}