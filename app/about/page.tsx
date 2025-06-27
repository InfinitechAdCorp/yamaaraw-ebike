"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Globe,
  Target,
  Award,
  Users,
  Leaf,
  Calendar,
  TrendingUp,
  Shield,
  Heart,
  Star,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ETrikeLoader from "@/components/ui/etrike-loader";

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("mission");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const milestones = [
    {
      year: "2025",
      title: "Company Founded",
      description:
        "Glory Bright International Energy Corp established with a vision for sustainable transportation",
    },
    {
      year: "2025",
      title: "First Product Launch",
      description: "Launched our first line of electric tricycles and bicycles",
    },
    {
      year: "2025",
      title: "50K+ Customers",
      description:
        "Reached milestone of serving over 50,000 satisfied customers",
    },
    {
      year: "2025",
      title: "100+ Service Centers",
      description: "Expanded nationwide with comprehensive service network",
    },
  ];

  const values = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Sustainability",
      description:
        "Committed to eco-friendly solutions that protect our planet",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Quality",
      description: "Delivering reliable, high-performance electric vehicles",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Customer First",
      description:
        "Putting customer satisfaction at the heart of everything we do",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Innovation",
      description: "Continuously advancing electric mobility technology",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <ETrikeLoader />
        </div>
      ) : (
        <>
          <Header />

          {/* Enhanced Hero Section */}
          <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-32 overflow-hidden">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center">
                <Badge className="mb-8 bg-blue-500/20 text-blue-300 border-blue-400/30 hover:bg-blue-500/30 backdrop-blur-sm text-lg px-6 py-2">
                  About YAMAARAW
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                  Driving the
                  <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Electric Future
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-12">
                  Pioneering sustainable transportation solutions with
                  cutting-edge electric mobility technology
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Our Products
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Our Journey
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Company Story with Visual Timeline */}
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-20">
                <Badge className="mb-6 bg-blue-100 text-blue-600 border-blue-200 text-lg px-6 py-2">
                  Our Story
                </Badge>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                  The YAMAARAW Journey
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
                <div className="space-y-8">
                  <div className="prose prose-lg text-gray-700">
                    <p className="text-xl leading-relaxed">
                      <strong className="text-blue-600">
                        Glory Bright International Energy Corp
                      </strong>{" "}
                      was born from a vision to revolutionize transportation in
                      2025. We saw the urgent need for sustainable, efficient,
                      and accessible electric mobility solutions.
                    </p>
                    <p className="text-lg leading-relaxed">
                      Our journey began with a simple belief: everyone deserves
                      access to clean, reliable transportation that does not
                      compromise on performance or affordability.
                    </p>
                    <p className="text-lg leading-relaxed text-blue-600 font-semibold">
                      Today, we are proud to be at the forefront of the electric
                      revolution, serving communities across the Philippines and
                      beyond.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">50K+</div>
                        <div className="text-blue-100">Happy Customers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">100+</div>
                        <div className="text-blue-100">Service Centers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">5+</div>
                        <div className="text-blue-100">Product Lines</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">2025</div>
                        <div className="text-blue-100">Year Founded</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                <div className="space-y-12">
                  {milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                    >
                      <div
                        className={`w-1/2 ${index % 2 === 0 ? "pr-12 text-right" : "pl-12"}`}
                      >
                        <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                          <CardContent className="p-6">
                            <Badge className="mb-3 bg-blue-600 text-white">
                              {milestone.year}
                            </Badge>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {milestone.title}
                            </h3>
                            <p className="text-gray-600">
                              {milestone.description}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="relative z-10">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-4 border-white shadow-lg"></div>
                      </div>
                      <div className="w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Mission, Vision, Values */}
          <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <Badge className="mb-6 bg-purple-100 text-purple-600 border-purple-200 text-lg px-6 py-2">
                  Our Foundation
                </Badge>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                  What Drives Us
                </h2>
              </div>

              {/* Tab Navigation */}
              <div className="flex justify-center mb-12">
                <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
                  {[
                    {
                      id: "mission",
                      label: "Mission",
                      icon: <Target className="w-5 h-5" />,
                    },
                    {
                      id: "vision",
                      label: "Vision",
                      icon: <Globe className="w-5 h-5" />,
                    },
                    {
                      id: "values",
                      label: "Values",
                      icon: <Heart className="w-5 h-5" />,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="max-w-4xl mx-auto">
                {activeTab === "mission" && (
                  <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
                    <CardContent className="p-12 text-center">
                      <Target className="w-16 h-16 mx-auto mb-6 text-blue-200" />
                      <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
                      <p className="text-xl text-blue-100 leading-relaxed">
                        To provide smart, sustainable, and powerful electric
                        mobility solutions that improve lives, protect the
                        environment, and make clean transportation accessible to
                        everyone.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {activeTab === "vision" && (
                  <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white border-0 shadow-2xl">
                    <CardContent className="p-12 text-center">
                      <Globe className="w-16 h-16 mx-auto mb-6 text-purple-200" />
                      <h3 className="text-3xl font-bold mb-6">Our Vision</h3>
                      <p className="text-xl text-purple-100 leading-relaxed">
                        To be the leading innovator in new energy transportation
                        across Asia and beyond, creating a world where
                        sustainable mobility is the standard, not the exception.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {activeTab === "values" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {values.map((value, index) => (
                      <Card
                        key={index}
                        className="bg-white border-2 border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <CardContent className="p-8 text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                            {value.icon}
                          </div>
                          <h4 className="text-xl font-bold text-gray-900 mb-3">
                            {value.title}
                          </h4>
                          <p className="text-gray-600">{value.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Enhanced Product Portfolio */}
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <Badge className="mb-6 bg-green-100 text-green-600 border-green-200 text-lg px-6 py-2">
                  Product Portfolio
                </Badge>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                  Our Electric Solutions
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Discover our comprehensive range of electric vehicles designed
                  for every need and lifestyle
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Leaf className="w-8 h-8" />,
                    title: "Solar-Powered Bicycles",
                    description:
                      "Eco-friendly bicycles powered by renewable solar energy for sustainable commuting",
                    features: [
                      "Solar charging",
                      "Zero emissions",
                      "Smart connectivity",
                    ],
                    color: "from-green-500 to-emerald-600",
                  },
                  {
                    icon: <Zap className="w-8 h-8" />,
                    title: "Electric Bicycles & Motorcycles",
                    description:
                      "High-performance electric two-wheelers for urban mobility and adventure",
                    features: ["Long range", "Fast charging", "Smart features"],
                    color: "from-blue-500 to-cyan-600",
                  },
                  {
                    icon: <Users className="w-8 h-8" />,
                    title: "Electric Tricycles",
                    description:
                      "Versatile three-wheelers perfect for passenger and cargo transport",
                    features: [
                      "Heavy duty",
                      "Comfortable ride",
                      "Commercial grade",
                    ],
                    color: "from-purple-500 to-pink-600",
                  },
                  {
                    icon: <Globe className="w-8 h-8" />,
                    title: "Sightseeing Vehicles",
                    description:
                      "Electric vehicles designed for tourism and recreational use",
                    features: [
                      "Scenic tours",
                      "Quiet operation",
                      "Eco-friendly",
                    ],
                    color: "from-orange-500 to-red-600",
                  },
                  {
                    icon: <Award className="w-8 h-8" />,
                    title: "Electric Dump Trikes",
                    description:
                      "Heavy-duty electric vehicles for construction and industrial use",
                    features: [
                      "Industrial strength",
                      "High capacity",
                      "Reliable performance",
                    ],
                    color: "from-gray-600 to-slate-700",
                  },
                ].map((product, index) => (
                  <Card
                    key={index}
                    className="group bg-white border-2 border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    <CardContent className="p-8">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${product.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        {product.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {product.description}
                      </p>
                      <div className="space-y-2">
                        {product.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center text-sm text-gray-500"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Enhanced CTA Section */}
          <section className="py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
              <Star className="w-16 h-16 text-yellow-400 mx-auto mb-8" />
              <h2 className="text-4xl lg:text-5xl font-bold mb-8">
                Ready to Go Electric?
              </h2>
              <p className="text-xl lg:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of satisfied customers who have made the switch
                to sustainable transportation. Discover our innovative electric
                vehicles and be part of the future.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-10 py-4 shadow-2xl"
                >
                  <Link href="/products" className="flex items-center">
                    <Zap className="mr-3 w-6 h-6" />
                    Explore Products
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-10 py-4 shadow-2xl"
                >
                  <Link href="/contact" className="flex items-center">
                    <Users className="mr-3 w-6 h-6" />
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          <Footer />
        </>
      )}
    </div>
  );
}
