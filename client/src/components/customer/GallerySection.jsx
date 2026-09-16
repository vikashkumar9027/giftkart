import React, { useState, useEffect } from 'react';
import { Camera, Sparkles } from 'lucide-react';
import api from '../../services/api';

const GallerySection = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        if (res.data.success) {
          setGalleryItems(res.data.gallery);
        }
      } catch (err) {
        console.error('Failed to load gallery items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  if (!loading && galleryItems.length === 0) return null;

  return (
    <section className="py-16 bg-stone-100/70 border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 text-rose-600 text-xs font-bold uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            <Camera className="w-3.5 h-3.5" />
            <span>Curated Moments</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            Real Gifts, Real Smiles
          </h2>
          <p className="text-sm text-stone-500 leading-relaxed">
            Peek inside our studio and see how our handcrafted gift crates bring joy and wonder to
            thousands of doorsteps every day.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {galleryItems.slice(0, 6).map((item) => (
            <div
              key={item._id}
              className="group relative overflow-hidden rounded-2xl aspect-square bg-stone-200 shadow-xs hover:shadow-lg transition-all"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <span className="text-[10px] text-rose-300 font-bold uppercase">
                  {item.category || 'GiftNest'}
                </span>
                <p className="text-xs font-bold text-white line-clamp-1">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
