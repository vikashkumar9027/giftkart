import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Heart, Mail, Phone, MapPin, Instagram, Facebook, Twitter, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-900">
                <Gift className="w-5 h-5" />
              </div>
              <span className="text-2xl font-serif font-bold text-white tracking-tight">
                GiftNest
              </span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              GiftNest is dedicated to turning ordinary days into unforgettable celebrations. We curate
              thoughtful, handcrafted gifts, exquisite hampers, and personalized keepsakes crafted with love.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:text-white hover:bg-rose-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:text-white hover:bg-rose-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:text-white hover:bg-rose-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-sans">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-rose-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-rose-400 transition-colors">Shop Catalog</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-rose-400 transition-colors">Track Orders</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-rose-400 transition-colors">Our Story</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-rose-400 transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-sans">
              Top Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/shop?category=birthday" className="hover:text-rose-400 transition-colors">
                  Birthday Gifts
                </Link>
              </li>
              <li>
                <Link to="/shop?category=anniversary" className="hover:text-rose-400 transition-colors">
                  Anniversary Hampers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=wedding" className="hover:text-rose-400 transition-colors">
                  Wedding Keepsakes
                </Link>
              </li>
              <li>
                <Link to="/shop?category=corporate" className="hover:text-rose-400 transition-colors">
                  Corporate Crates
                </Link>
              </li>
              <li>
                <Link to="/shop?category=personalised-gifts" className="hover:text-rose-400 transition-colors">
                  Personalised Gifts
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-sans">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-1" />
                <span>45 Blossom Avenue, Suite 200, San Francisco, CA</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-rose-500 shrink-0" />
                <span>+1 (800) 443-8637</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                <span>hello@giftnest.com</span>
              </li>
              <li className="flex items-center space-x-2 pt-1 text-xs text-stone-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Safe & Trusted Packaging</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} GiftNest Inc. All rights reserved. Crafted with care.</p>
          <div className="flex items-center space-x-6">
            <Link to="/about" className="hover:text-stone-400 transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-stone-400 transition-colors">Terms of Service</Link>
            <Link to="/admin/login" className="text-stone-600 hover:text-stone-400 transition-colors">
              Staff CMS Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
