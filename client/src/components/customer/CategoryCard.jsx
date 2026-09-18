import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/shop?category=${category.slug || category._id}`}
      className="group relative overflow-hidden rounded-3xl bg-stone-900 aspect-4/5 flex flex-col justify-end p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Background Image with Gradient Overlay */}
      <img
        src={category.image}
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

      {/* Category Content */}
      <div className="relative z-10 space-y-2">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-rose-300 bg-rose-950/70 backdrop-blur-xs px-2.5 py-1 rounded-full inline-block">
          {category.productCount ? `${category.productCount} Gifts` : 'Featured Collection'}
        </span>
        <h3 className="text-xl font-serif font-bold text-white group-hover:text-rose-200 transition-colors">
          {category.name}
        </h3>
        <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
          {category.description}
        </p>
        <div className="pt-2 flex items-center text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
          <span>Explore Gifts</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1.5 transform group-hover:translate-x-1.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
