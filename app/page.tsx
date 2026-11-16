"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Product, CartItem } from "@/types/shop";
import FallingPetals from "@/components/floral/FallingPetals";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Sparkles,
  Heart,
  Plus,
  Minus,
  X,
  Flower2,
  Send,
} from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const categories = ["All", "Romantic", "Minimalist", "Graduation", "Wedding"];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((item) => item.category === selectedCategory);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, greetingCard: "" }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const updateGreetingCard = (id: string, text: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, greetingCard: text } : item
      )
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const formatRupiah = (angka: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);

  return (
    <div className="min-h-screen bg-[#FDF8F5] text-stone-800 relative selection:bg-rose-200">
      <FallingPetals />

      {/* Hiasan Sudut Floral Dekoratif */}
      <div className="pointer-events-none fixed top-0 left-0 w-48 h-48 bg-gradient-to-br from-rose-200/40 via-emerald-100/20 to-transparent rounded-br-full z-0" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-emerald-200/30 via-rose-100/20 to-transparent rounded-tl-full z-0" />

      {/* Navbar */}
      <nav className="sticky top-0 z-30 backdrop-blur-md bg-[#FDF8F5]/80 border-b border-rose-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-full bg-rose-100 text-rose-600">
              <Flower2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold tracking-wide text-stone-800">
                Fleur & Co.
              </h1>
              <p className="text-[11px] text-emerald-700 tracking-widest uppercase">
                Artisan Florist
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2.5 rounded-full shadow-sm transition cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-sm font-medium">Keranjang</span>
            {totalItems > 0 && (
              <span className="ml-1 bg-rose-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 max-w-6xl mx-auto px-6 pt-14 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-100/80 text-rose-700 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Rangkaian Bunga Segar Setiap Hari
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-800 leading-tight max-w-2xl mx-auto">
            Sampaikan Perasaan Lewat Keindahan{" "}
            <span className="text-rose-500 italic">Kelopak Bunga</span>
          </h2>
          <p className="mt-4 text-stone-600 max-w-xl mx-auto text-sm md:text-base">
            Pilih buket favoritmu, tulis pesan pribadi di kartu ucapan gratis, dan
            biarkan kami merangkainya dengan penuh kehangatan.
          </p>
        </motion.div>

        {/* Filter Kategori */}
        <div className="flex flex-wrap justify-center gap-2.5 mt-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                  : "bg-white text-stone-600 hover:bg-rose-50 border border-rose-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Katalog Produk */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-80 rounded-3xl bg-white/70 animate-pulse border border-rose-100"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="group bg-white rounded-3xl overflow-hidden border border-rose-100/80 shadow-sm hover:shadow-xl hover:shadow-rose-100/50 transition-all flex flex-col"
              >
                <div className="relative h-60 overflow-hidden bg-rose-50">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-800">
                      {product.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1.5 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-rose-50 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-stone-400 block">Harga</span>
                      <span className="font-bold text-emerald-800">
                        {formatRupiah(product.price)}
                      </span>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => addToCart(product)}
                      className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm cursor-pointer transition"
                    >
                      <Heart className="w-3.5 h-3.5" /> Pilih
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Drawer Keranjang & Kartu Ucapan */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-40"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#FDF8F5] shadow-2xl z-50 flex flex-col border-l border-rose-100"
            >
              <div className="p-6 border-b border-rose-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-rose-500" />
                  <h3 className="font-serif text-lg font-bold">
                    Keranjang Buketmu
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-full hover:bg-rose-50 text-stone-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-stone-400">
                    <Flower2 className="w-12 h-12 mx-auto mb-3 text-rose-200" />
                    <p className="text-sm">Keranjang masih kosong.</p>
                    <p className="text-xs mt-1">
                      Pilih buket cantik dulu yuk!
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs space-y-3"
                    >
                      <div className="flex gap-3.5">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-serif font-bold text-sm text-stone-800">
                            {item.name}
                          </h4>
                          <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                            {formatRupiah(item.price)}
                          </p>
                          <div className="flex items-center gap-2.5 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Input Kartu Ucapan */}
                      <div>
                        <label className="text-[11px] font-medium text-stone-500 block mb-1">
                          Pesan Kartu Ucapan (Gratis):
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Selamat wisuda ya! Dari..."
                          value={item.greetingCard || ""}
                          onChange={(e) =>
                            updateGreetingCard(item.id, e.target.value)
                          }
                          className="w-full text-xs px-3 py-2 rounded-xl bg-[#FDF8F5] border border-rose-100 focus:outline-none focus:border-rose-400"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-white border-t border-rose-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-500">Total Belanja</span>
                    <span className="text-lg font-bold text-emerald-800">
                      {formatRupiah(totalPrice)}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      alert(
                        "Lanjut ke form Checkout & simpan ke tabel orders Supabase!"
                      )
                    }
                    className="w-full flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white py-3.5 rounded-full font-medium text-sm shadow-md transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Lanjut ke Checkout
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}