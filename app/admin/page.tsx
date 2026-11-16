"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/shop";
import Link from "next/link";
import {
  Flower2,
  PlusCircle,
  Trash2,
  Upload,
  Lock,
  ArrowLeft,
  Package,
  ShoppingBag,
} from "lucide-react";

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  delivery_date: string;
  greeting_card: string;
  total_price: number;
  status: string;
  created_at: string;
}

export default function AdminPage() {
  // Ganti PIN rahasia admin di sini
  const ADMIN_PIN = "1357";

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  // State Produk
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Romantic");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // State Pesanan
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchOrders();
    }
  }, [isAuthenticated]);

  async function fetchProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProducts(data);
  }

  async function fetchOrders() {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setOrders(data);
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
    } else {
      alert("PIN salah! Coba lagi.");
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return alert("Nama buket dan harga wajib diisi!");

    setUploading(true);
    let imageUrl =
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80";

    // Upload foto ke Supabase Storage jika memilih file gambar
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("flower-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        alert("Gagal upload foto: " + uploadError.message);
        setUploading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("flower-images")
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
    }

    // Simpan data buket ke tabel products
    const { error } = await supabase.from("products").insert([
      {
        name,
        category,
        price: Number(price),
        stock: Number(stock),
        description,
        image_url: imageUrl,
      },
    ]);

    setUploading(false);

    if (error) {
      alert("Gagal menyimpan produk: " + error.message);
    } else {
      alert("Buket baru berhasil ditambahkan!");
      setName("");
      setPrice("");
      setStock("10");
      setDescription("");
      setImageFile(null);
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id: string, productName: string) => {
    const yakin = confirm(`Yakin ingin menghapus "${productName}"?`);
    if (!yakin) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) {
      fetchProducts();
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (!error) {
      fetchOrders();
    }
  };

  const formatRupiah = (angka: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);

  // Layar Kunci PIN sebelum masuk dashboard
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDF8F5] flex items-center justify-center p-6">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-3xl shadow-lg border border-rose-100 max-w-sm w-full text-center space-y-5"
        >
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-stone-800">
              Admin Fleur & Co.
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Masukkan PIN pemilik toko untuk mengelola katalog
            </p>
          </div>
          <input
            type="password"
            placeholder="Masukkan PIN..."
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            className="w-full text-center tracking-widest text-lg px-4 py-3 rounded-2xl bg-[#FDF8F5] border border-rose-200 focus:outline-none focus:border-rose-500"
          />
          <button
            type="submit"
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-3 rounded-full font-medium text-sm transition cursor-pointer"
          >
            Masuk Dashboard
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-rose-500"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Toko
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F5] text-stone-800 pb-20">
      {/* Header Admin */}
      <header className="bg-white border-b border-rose-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-emerald-100 text-emerald-800">
              <Flower2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold">Dashboard Admin</h1>
              <p className="text-xs text-stone-500">Fleur & Co. Florist</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition ${
                activeTab === "products"
                  ? "bg-rose-500 text-white"
                  : "bg-rose-50 text-stone-600"
              }`}
            >
              <Package className="w-4 h-4" /> Kelola Buket ({products.length})
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition ${
                activeTab === "orders"
                  ? "bg-rose-500 text-white"
                  : "bg-rose-50 text-stone-600"
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Pesanan Masuk ({orders.length})
            </button>
            <Link
              href="/"
              className="text-xs font-medium text-emerald-800 hover:underline ml-2"
            >
              Lihat Toko →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-8">
        {activeTab === "products" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Tambah Buket Baru */}
            <form
              onSubmit={handleAddProduct}
              className="bg-white p-6 rounded-3xl border border-rose-100 shadow-xs space-y-4 h-fit"
            >
              <h2 className="font-serif text-lg font-bold flex items-center gap-2 text-stone-800">
                <PlusCircle className="w-5 h-5 text-rose-500" /> Tambah Buket
                Baru
              </h2>

              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1">
                  Nama Buket
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pastel Hydrangea Dream"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-[#FDF8F5] border border-rose-100 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-sm px-3 py-2.5 rounded-xl bg-[#FDF8F5] border border-rose-100 focus:outline-none"
                  >
                    <option value="Romantic">Romantic</option>
                    <option value="Minimalist">Minimalist</option>
                    <option value="Graduation">Graduation</option>
                    <option value="Wedding">Wedding</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">
                    Stok
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-[#FDF8F5] border border-rose-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1">
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  required
                  placeholder="250000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-[#FDF8F5] border border-rose-100 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan jenis bunga & warna wrapping..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-[#FDF8F5] border border-rose-100 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1">
                  Foto Buket (Upload ke Supabase)
                </label>
                <label className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-dashed border-rose-300 bg-rose-50/50 text-rose-600 text-xs font-medium cursor-pointer hover:bg-rose-50">
                  <Upload className="w-4 h-4" />
                  {imageFile ? imageFile.name : "Pilih file foto (JPG/PNG)"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white py-3 rounded-full text-sm font-semibold transition cursor-pointer"
              >
                {uploading ? "Menyimpan..." : "Simpan ke Katalog"}
              </button>
            </form>

            {/* Daftar Produk Aktif */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-serif text-lg font-bold text-stone-800">
                Daftar Buket di Etalase
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-2xl border border-rose-100 flex gap-4 items-center justify-between"
                  >
                    <div className="flex gap-3.5 items-center">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover bg-rose-50"
                      />
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-500">
                          {item.category} • Stok: {item.stock}
                        </span>
                        <h3 className="font-serif font-bold text-sm text-stone-800">
                          {item.name}
                        </h3>
                        <p className="text-xs font-bold text-emerald-800 mt-0.5">
                          {formatRupiah(item.price)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteProduct(item.id, item.name)}
                      title="Hapus buket"
                      className="p-2 rounded-full text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Tab Pesanan Masuk */
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-bold text-stone-800">
              Daftar Pesanan Pembeli
            </h2>
            {orders.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-rose-100 text-center text-stone-400 text-sm">
                Belum ada pesanan masuk saat ini.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white p-5 rounded-2xl border border-rose-100 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-stone-800">
                          {order.customer_name}
                        </h3>
                        <p className="text-xs text-stone-500">
                          WA: {order.customer_phone} • Kirim:{" "}
                          {order.delivery_date}
                        </p>
                      </div>
                      <span className="font-bold text-sm text-emerald-800">
                        {formatRupiah(order.total_price)}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 bg-[#FDF8F5] p-3 rounded-xl">
                      <strong>Alamat:</strong> {order.shipping_address}
                      {order.greeting_card && (
                        <>
                          <br />
                          <strong>Kartu Ucapan:</strong> &ldquo;
                          {order.greeting_card}&rdquo;
                        </>
                      )}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-stone-500">
                        Status Pesanan:
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateOrderStatus(order.id, e.target.value)
                        }
                        className="text-xs font-semibold px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200"
                      >
                        <option value="Menunggu Pembayaran">
                          Menunggu Pembayaran
                        </option>
                        <option value="Dirangkai">Sedang Dirangkai</option>
                        <option value="Dikirim">Sedang Dikirim</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}