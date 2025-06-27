"use client";
export const dynamic = "force-dynamic";
import type React from "react";

import { useState, useEffect } from "react";
import {
  Filter,
  Search,
  Grid,
  List,
  Star,
  Heart,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ETrikeLoader from "@/components/ui/etrike-loader";
import { productApi, type ProductData } from "@/lib/api";
import { addToCart } from "@/lib/cart";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [sortBy, setSortBy] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [animatingProduct, setAnimatingProduct] = useState<number | null>(null);

  const categories = [
    "All Products",
    "E-Bike",
    "E-Trike",
    "E-Scooter",
    "E-Motorcycle",
  ];
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedCategory, sortBy, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getProducts();

      const productsWithStock = response.map((product) => ({
        ...product,
        in_stock: Boolean(product.in_stock),
      }));

      console.log("Fetched products:", productsWithStock);
      setProducts(productsWithStock);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All Products") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "featured":
          return b.featured ? 1 : -1;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  };

  const formatPrice = (price: number) => {
    if (!price || isNaN(price)) return "₱0.00";

    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const calculateDiscount = (price: number, originalPrice?: number) => {
    if (!originalPrice || originalPrice <= price || !price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const handleAddToCart = async (
    product: ProductData,
    event: React.MouseEvent
  ) => {
    const user = getCurrentUser();

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setAnimatingProduct(product.id!);

      const button = event.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();
      const cartIcon = document.querySelector("[data-cart-icon]");
      const cartRect = cartIcon?.getBoundingClientRect();

      if (cartRect) {
        const animationEl = document.createElement("div");
        animationEl.className =
          "fixed w-8 h-8 bg-blue-500 rounded-full z-50 pointer-events-none";
        animationEl.style.left = `${rect.left + rect.width / 2 - 16}px`;
        animationEl.style.top = `${rect.top + rect.height / 2 - 16}px`;
        animationEl.style.transition =
          "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

        document.body.appendChild(animationEl);

        setTimeout(() => {
          animationEl.style.left = `${cartRect.left + cartRect.width / 2 - 16}px`;
          animationEl.style.top = `${cartRect.top + cartRect.height / 2 - 16}px`;
          animationEl.style.transform = "scale(0.5)";
          animationEl.style.opacity = "0";
        }, 100);

        setTimeout(() => {
          if (document.body.contains(animationEl)) {
            document.body.removeChild(animationEl);
          }
        }, 900);
      }

      await addToCart(product.id!, 1);

      setAnimatingProduct(null);

      console.log("Added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      setAnimatingProduct(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <ETrikeLoader />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm">
              Electric Mobility Solutions
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Our Products
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Discover our complete range of electric vehicles designed for
              sustainable transportation
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 rounded-lg border-2 border-blue-200 focus:border-blue-500"
              />
            </div>

            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid" ? "bg-blue-500 hover:bg-blue-600" : ""
                }
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list" ? "bg-blue-500 hover:bg-blue-600" : ""
                }
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Category Filters */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block mt-6`}>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-white hover:bg-blue-100"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid/List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="p-4">
                <Link href={`/products/${product.id}`}>
                  <div className="relative">
                    <Image
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {product.in_stock ? (
                      <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                        In Stock
                      </Badge>
                    ) : (
                      <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </Link>
                <h2 className="text-xl font-bold mt-2">{product.name}</h2>
                <p className="text-gray-600 mt-1 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-lg font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </p>
                  {product.original_price && (
                    <div className="flex items-center gap-2">
                      <p className="text-sm line-through text-gray-400">
                        {formatPrice(product.original_price)}
                      </p>
                      <Badge className="bg-blue-500 text-white">
                        {calculateDiscount(
                          product.price,
                          product.original_price
                        )}
                        % Off
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="default"
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={
                      !product.in_stock || animatingProduct === product.id
                    }
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {animatingProduct === product.id
                      ? "Adding..."
                      : "Add to Cart"}
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <Heart className="w-4 h-4 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-16 h-16 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No products found
            </h3>
            <p className="text-gray-600 mb-8">
              Try adjusting your search or filter criteria.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All Products");
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
