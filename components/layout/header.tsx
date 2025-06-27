"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  Zap,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser, logout } from "@/lib/auth";
import NotificationDropdown from "@/components/notification-dropdown";
import WishlistDropdown from "@/components/wishlist-dropdown";
import ToastIntegration from "@/components/toast-integration";
import type { User as UserType } from "@/lib/types";
import { getCart, getCartItemsCount } from "@/lib/cart";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  category: string;
  model: string;
  images: string[];
  ideal_for?: string[];
  colors?: string[];
  in_stock: boolean;
  featured: boolean;
}

interface SearchFilters {
  categories: string[];
  priceRange: [number, number];
  inStock: boolean;
  featured: boolean;
}

export default function Header() {
  const [user, setUser] = useState<UserType | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);

  // Enhanced search states
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    priceRange: [0, 1000000],
    inStock: false,
    featured: false,
  });
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (mounted && user) {
      fetchCartCount();
    }
  }, [mounted, user]);

  // Add cart event listeners
  useEffect(() => {
    const handleCartUpdate = () => {
      if (user) {
        fetchCartCount();
      }
    };

    const handleCartCleared = () => {
      setCartCount(0);
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("cartCleared", handleCartCleared);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("cartCleared", handleCartCleared);
    };
  }, [user]);

  // Load recent searches and categories
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
    fetchCategories();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCartCount = async () => {
    try {
      const cartItems = await getCart();
      const count = getCartItemsCount(cartItems);
      setCartCount(count);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      if (data.success) {
        const categories = [
          ...new Set(data.data.map((product: Product) => product.category)),
        ] as string[];
        setAvailableCategories(categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        search: query,
      });

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (data.success) {
        setSuggestions(data.data.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);

    // Debounce the API call
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  // Fix hydration issue
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setUser(getCurrentUser());
    }
  }, [mounted]);

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsUserMenuOpen(false);
  };

  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;

    // Save to recent searches
    const newRecentSearches = [
      searchTerm,
      ...recentSearches.filter((s) => s !== searchTerm),
    ].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));

    setShowSuggestions(false);

    // Build search URL with filters
    const params = new URLSearchParams({ search: searchTerm });

    // Add filters to URL
    if (filters.categories.length > 0) {
      params.append("categories", filters.categories.join(","));
    }
    if (filters.priceRange[0] > 0) {
      params.append("min_price", filters.priceRange[0].toString());
    }
    if (filters.priceRange[1] < 1000000) {
      params.append("max_price", filters.priceRange[1].toString());
    }
    if (filters.inStock) {
      params.append("in_stock", "true");
    }
    if (filters.featured) {
      params.append("featured", "true");
    }

    window.location.href = `/products?${params.toString()}`;
  };

  const handleSuggestionClick = (product: Product) => {
    setSearchQuery(product.name);
    handleSearch(product.name);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeRecentSearch = (search: string) => {
    const newRecentSearches = recentSearches.filter((s) => s !== search);
    setRecentSearches(newRecentSearches);
    localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));
  };

  const updateFilters = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 1000000],
      inStock: false,
      featured: false,
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 1000000 ||
    filters.inStock ||
    filters.featured;

  return (
    <>
      <ToastIntegration />
      <header className="bg-white shadow-sm border-b sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-12 h-8">
                <Image
                  src="/images/yamaaraw_logo.png"
                  alt="YAMAARAW"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                YAMAARAW
              </span>
            </Link>

            {/* Enhanced Search Bar - Desktop */}
            <div
              className="hidden md:flex flex-1 max-w-2xl mx-8"
              ref={searchRef}
            >
              <div className="flex gap-2 w-full">
                {/* Main Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Search for electric vehicles, parts, accessories..."
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch();
                      }
                      if (e.key === "Escape") {
                        setShowSuggestions(false);
                      }
                    }}
                    className="pl-12 pr-12 w-full h-12 rounded-full border-2 border-gray-200 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all"
                  />

                  {/* Clear Button */}
                  {searchQuery && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}

                  {/* Loading Indicator */}
                  {isLoading && (
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Search Button */}
                <Button
                  onClick={() => handleSearch()}
                  className="h-12 px-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Search
                </Button>

                {/* Filters Button */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`h-12 px-4 rounded-full border-2 ${hasActiveFilters ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                    >
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Filters
                      {hasActiveFilters && (
                        <Badge className="ml-2 bg-blue-600 text-white">
                          {filters.categories.length +
                            (filters.inStock ? 1 : 0) +
                            (filters.featured ? 1 : 0)}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="end">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Filters</h3>
                        {hasActiveFilters && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                          >
                            Clear all
                          </Button>
                        )}
                      </div>

                      {/* Categories */}
                      <div>
                        <Label className="text-sm font-medium">
                          Categories
                        </Label>
                        <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                          {availableCategories.map((category) => (
                            <div
                              key={category}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={category}
                                checked={filters.categories.includes(category)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    updateFilters("categories", [
                                      ...filters.categories,
                                      category,
                                    ]);
                                  } else {
                                    updateFilters(
                                      "categories",
                                      filters.categories.filter(
                                        (c) => c !== category
                                      )
                                    );
                                  }
                                }}
                              />
                              <Label
                                htmlFor={category}
                                className="text-sm capitalize"
                              >
                                {category}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Price Range */}
                      <div>
                        <Label className="text-sm font-medium">
                          Price Range: ₱{filters.priceRange[0].toLocaleString()}{" "}
                          - ₱{filters.priceRange[1].toLocaleString()}
                        </Label>
                        <div className="mt-2">
                          <Slider
                            value={filters.priceRange}
                            onValueChange={(value) =>
                              updateFilters(
                                "priceRange",
                                value as [number, number]
                              )
                            }
                            max={1000000}
                            min={0}
                            step={10000}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* Other Filters */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="in_stock"
                            checked={filters.inStock}
                            onCheckedChange={(checked) =>
                              updateFilters("inStock", checked)
                            }
                          />
                          <Label htmlFor="in_stock" className="text-sm">
                            In Stock Only
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="featured"
                            checked={filters.featured}
                            onCheckedChange={(checked) =>
                              updateFilters("featured", checked)
                            }
                          />
                          <Label htmlFor="featured" className="text-sm">
                            Featured Products
                          </Label>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Search Suggestions Dropdown */}
              {showSuggestions &&
                (searchQuery.length > 0 || recentSearches.length > 0) && (
                  <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg border-2 border-gray-100">
                    <CardContent className="p-0">
                      {/* Recent Searches */}
                      {searchQuery.length === 0 &&
                        recentSearches.length > 0 && (
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-600">
                                Recent Searches
                              </span>
                            </div>
                            <div className="space-y-1">
                              {recentSearches.map((search, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between group"
                                >
                                  <button
                                    onClick={() => handleSearch(search)}
                                    className="flex-1 text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded"
                                  >
                                    <Search className="w-3 h-3 inline mr-2 text-gray-400" />
                                    {search}
                                  </button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeRecentSearch(search)}
                                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Product Suggestions */}
                      {searchQuery.length > 0 && (
                        <div className="p-4">
                          {isLoading ? (
                            <div className="flex items-center justify-center py-4">
                              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                              <span className="ml-2 text-sm text-gray-500">
                                Searching...
                              </span>
                            </div>
                          ) : suggestions.length > 0 ? (
                            <div className="space-y-2">
                              <span className="text-sm font-medium text-gray-600">
                                Products
                              </span>
                              {suggestions.map((product) => (
                                <button
                                  key={product.id}
                                  onClick={() => handleSuggestionClick(product)}
                                  className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg text-left"
                                >
                                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    {product.images &&
                                    product.images.length > 0 ? (
                                      <Image
                                        src={
                                          product.images[0] ||
                                          "/placeholder.svg"
                                        }
                                        alt={product.name}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <Search className="w-4 h-4 text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm text-gray-900 truncate">
                                      {product.name}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate">
                                      {product.category} • ₱
                                      {product.price.toLocaleString()}
                                    </div>
                                  </div>
                                  {product.featured && (
                                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                      Featured
                                    </Badge>
                                  )}
                                </button>
                              ))}
                              <Separator />
                              <button
                                onClick={() => handleSearch()}
                                className="w-full text-left px-2 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Search className="w-3 h-3 inline mr-2" />
                                Search for "{searchQuery}"
                              </button>
                            </div>
                          ) : searchQuery.length >= 2 ? (
                            <div className="py-4 text-center text-sm text-gray-500">
                              No products found for "{searchQuery}"
                            </div>
                          ) : null}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                href="/products"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
              >
                Products
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-1">
              {/* Notifications - Only show if user is logged in */}
              {mounted && user && <NotificationDropdown />}

              {/* Wishlist - Only show if user is logged in */}
              {mounted && user && <WishlistDropdown />}

              {/* Cart with Animation Target */}
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-2 rounded-full hover:bg-blue-50 transition-all duration-300 group"
                  data-cart-icon
                >
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    {/* E-Trike Icon Overlay for Animation */}
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-300">
                      <Zap className="w-5 h-5 text-orange-500" />
                    </div>
                  </div>
                  {mounted && cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold animate-pulse">
                      {cartCount > 99 ? "99+" : cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 rounded-full hover:bg-blue-50 group"
                >
                  {mounted && user ? (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <User className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                  )}
                </Button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100">
                    {mounted && user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="font-semibold text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Wishlist
                        </Link>
                        {user.role === "admin" && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Admin Panel
                          </Link>
                        )}
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-blue-50 group"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                  className="relative"
                >
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search electric vehicles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 w-full rounded-full border-2 border-gray-200 focus:border-blue-500"
                  />
                </form>
                <Link
                  href="/products"
                  className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
