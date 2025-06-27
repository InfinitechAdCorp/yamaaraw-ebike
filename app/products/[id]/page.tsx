"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  Zap,
  Star,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Award,
  Phone,
} from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ETrikeLoader from "@/components/ui/etrike-loader";
import { productApi, type ProductData } from "@/lib/api";
import { addToCart } from "@/lib/cart";
import { getCurrentUser } from "@/lib/auth";
import { useETrikeToast } from "@/components/ui/toast-container";
import { useCart } from "@/contexts/cart-context";
import { useFlyingETrike } from "@/components/ui/flying-etrike-animation";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useETrikeToast();
  const { refreshCart } = useCart();
  const { triggerAnimation, AnimationContainer } = useFlyingETrike();

  const [product, setProduct] = useState<ProductData | null>(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productApi.getProduct(Number(params.id));
      setProduct(response);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to load product details");
      toast.error(
        "Failed to Load",
        "Could not load product details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const user = getCurrentUser();

    if (!user) {
      toast.warning(
        "Login Required",
        "Please log in to add items to your cart"
      );
      router.push("/login");
      return;
    }

    try {
      setAddingToCart(true);

      // Get button and cart icon elements for animation
      const button = event.currentTarget;
      const cartIcon = document.querySelector(
        "[data-cart-icon]"
      ) as HTMLElement;

      if (cartIcon) {
        // Trigger flying animation
        triggerAnimation(button, cartIcon);
      }

      const selectedColor = product?.colors?.[selectedColorIndex]?.name;
      await addToCart(product!.id!, quantity, selectedColor);

      // Refresh cart count in header
      await refreshCart();

      // Show success toast
      toast.cartAdded(product!.name, {
        label: "View Cart",
        onClick: () => router.push("/cart"),
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(
        "Failed to Add",
        "Could not add item to cart. Please try again."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  // Enhanced price formatting for large numbers
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

  const nextImage = () => {
    const images = product?.images ?? [];
    if (images.length > 1) {
      setSelectedImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    const images = product?.images ?? [];
    if (images.length > 1) {
      setSelectedImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
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

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Product not found
            </h1>
            <Button
              onClick={() => router.push("/products")}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.original_price);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Flying Animation Container */}
      <AnimationContainer />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => router.push("/products")}
              className="text-orange-600 hover:text-orange-700"
            >
              Products
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{product.category}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Images and Service Features */}
          <div className="space-y-6">
            {/* Main Image Container - Optimized Height */}
            <div className="relative w-full h-80 bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
              <Image
                src={product.images?.[selectedImageIndex] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />

              {/* Navigation Arrows */}
              {product.images && product.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-md z-10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-md z-10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </>
              )}

              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg z-20">
                  -{discount}%
                </div>
              )}

              {/* Featured Badge */}
              {product.featured && (
                <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center shadow-lg z-20">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </div>
              )}
            </div>

            {/* Thumbnail Images - Consistent Size */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-orange-500 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-contain p-1"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Service Features - Compact Design */}
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-orange-800 flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  Service Highlights
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center text-center p-2 bg-white rounded-lg shadow-sm">
                    <Truck className="w-6 h-6 text-orange-500 mb-1" />
                    <div className="text-xs font-semibold text-gray-900">
                      Free Delivery
                    </div>
                    <div className="text-xs text-gray-600">Metro Manila</div>
                  </div>
                  <div className="flex flex-col items-center text-center p-2 bg-white rounded-lg shadow-sm">
                    <Shield className="w-6 h-6 text-green-500 mb-1" />
                    <div className="text-xs font-semibold text-gray-900">
                      2 Year Warranty
                    </div>
                    <div className="text-xs text-gray-600">Full Coverage</div>
                  </div>
                  <div className="flex flex-col items-center text-center p-2 bg-white rounded-lg shadow-sm">
                    <Zap className="w-6 h-6 text-blue-500 mb-1" />
                    <div className="text-xs font-semibold text-gray-900">
                      Service Support
                    </div>
                    <div className="text-xs text-gray-600">Nationwide</div>
                  </div>
                  <div className="flex flex-col items-center text-center p-2 bg-white rounded-lg shadow-sm">
                    <Phone className="w-6 h-6 text-purple-500 mb-1" />
                    <div className="text-xs font-semibold text-gray-900">
                      24/7 Support
                    </div>
                    <div className="text-xs text-gray-600">Customer Care</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Product Info - Optimized */}
          <div className="space-y-4">
            {/* Product Header */}
            <div>
              <Badge className="bg-orange-100 text-orange-600 border-orange-200 mb-3 text-sm font-medium">
                {product.category}
              </Badge>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm text-gray-500">Model:</span>
                <span className="text-base font-semibold text-gray-700">
                  {product.model}
                </span>
              </div>

              {/* Enhanced Price Section for Large Numbers */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPrice(product.price)}
                    </div>
                    {product.original_price &&
                      product.original_price > product.price && (
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-base text-gray-500 line-through">
                            {formatPrice(product.original_price)}
                          </span>
                          <Badge className="bg-blue-100 text-blue-600 border-red-200 text-xs">
                            Save{" "}
                            {formatPrice(
                              product.original_price - product.price
                            )}
                          </Badge>
                        </div>
                      )}
                  </div>
                  <div className="text-right">
                    <Badge
                      className={`text-sm font-medium ${
                        product.in_stock
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}
                    >
                      {product.in_stock ? "✓ In Stock" : "✗ Out of Stock"}
                    </Badge>
                    {product.featured && (
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-sm mt-2 block">
                        ⭐ Featured Product
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Purchase Section */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <label
                      htmlFor="quantity"
                      className="text-sm font-medium text-gray-700"
                    >
                      Quantity:
                    </label>
                    <select
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      disabled={!product.in_stock || addingToCart}
                      onClick={handleAddToCart}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {addingToCart ? "Adding..." : "Add to Cart"}
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      <Heart className="w-5 h-5" />
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Description - Compact */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Product Description</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-700 leading-relaxed text-sm">
                  {product.description}
                </p>
              </CardContent>
            </Card>

            {/* Colors - Compact */}
            {product.colors && product.colors.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Available Colors</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedColorIndex(index)}
                          className={`flex items-center space-x-2 p-2 rounded-lg border-2 transition-all hover:shadow-md ${
                            selectedColorIndex === index
                              ? "border-orange-500 bg-orange-50 shadow-md"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div
                            className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: color.value }}
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {color.name}
                          </span>
                        </button>
                      ))}
                    </div>
                    {selectedColorIndex !== null &&
                      product.colors[selectedColorIndex] && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                          <span className="font-medium">Selected Color:</span>{" "}
                          {product.colors[selectedColorIndex].name}
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ideal For - Compact */}
            {product.ideal_for && product.ideal_for.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Perfect For</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {product.ideal_for.map((use, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors text-xs"
                      >
                        {use}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Technical Specifications - Full Width */}
        {product.specifications && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Zap className="w-6 h-6 mr-2 text-orange-500" />
                Technical Specifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 bg-gray-50">
                        Specification
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 bg-gray-50">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.specifications.dimensions && (
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium text-gray-700">
                          Dimensions
                        </td>
                        <td className="py-4 px-6 text-gray-900">
                          {product.specifications.dimensions}
                        </td>
                      </tr>
                    )}
                    {product.specifications.battery_type && (
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium text-gray-700">
                          Battery Type
                        </td>
                        <td className="py-4 px-6 text-gray-900">
                          {product.specifications.battery_type}
                        </td>
                      </tr>
                    )}
                    {product.specifications.motor_power && (
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium text-gray-700">
                          Motor Power
                        </td>
                        <td className="py-4 px-6 text-gray-900">
                          {product.specifications.motor_power}
                        </td>
                      </tr>
                    )}
                    {product.specifications.main_features && (
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium text-gray-700">
                          Main Features
                        </td>
                        <td className="py-4 px-6 text-gray-900">
                          {product.specifications.main_features}
                        </td>
                      </tr>
                    )}
                    {product.specifications.front_rear_suspension && (
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium text-gray-700">
                          Suspension
                        </td>
                        <td className="py-4 px-6 text-gray-900">
                          {product.specifications.front_rear_suspension}
                        </td>
                      </tr>
                    )}
                    {product.specifications.front_tires && (
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium text-gray-700">
                          Front Tires
                        </td>
                        <td className="py-4 px-6 text-gray-900">
                          {product.specifications.front_tires}
                        </td>
                      </tr>
                    )}
                    {product.specifications.rear_tires && (
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium text-gray-700">
                          Rear Tires
                        </td>
                        <td className="py-4 px-6 text-gray-900">
                          {product.specifications.rear_tires}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
