'use client';

import Link from 'next/link';
import { Activity, Users, Calendar, Package } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Users,
      title: 'Patient Management',
      description: 'Complete patient records with medical history and allergies',
    },
    {
      icon: Calendar,
      title: 'Appointments',
      description: 'Schedule and manage patient appointments effortlessly',
    },
    {
      icon: Package,
      title: 'Inventory Control',
      description: 'Track medicine stock with automated low-stock alerts',
    },
    {
      icon: Activity,
      title: 'Prescriptions & Billing',
      description: 'Create prescriptions and generate invoices instantly',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow">
        <div className="flex items-center space-x-2 text-blue-600 font-bold text-2xl">
          <span className="bg-blue-600 text-white rounded-full px-2 py-1 text-lg">E</span>
          <span>EMR System</span>
        </div>

        <nav className="space-x-4">
          <Link
            href="/login"
            className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-20 bg-gray-50 px-6">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Complete Clinic Management Solution
        </h1>
        <p className="text-gray-600 max-w-2xl mb-8">
          Streamline your medical practice with our comprehensive EMR system. Manage patients,
          appointments, inventory, and billing — all in one place.
        </p>
        <div className="space-x-4">
          <Link
            href="/signup"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Start Free Trial
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-white">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="p-6 border rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center space-x-3 mb-3">
                <Icon className="text-blue-600" size={28} />
                <h3 className="text-lg font-semibold text-gray-800">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
