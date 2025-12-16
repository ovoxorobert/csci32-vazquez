import Link from 'next/link'
import React from 'react'

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  linkText?: string
  linkHref?: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  linkText,
  linkHref,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    {linkHref && (
      <Link
        href={linkHref}
        className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
      >
        {linkText} &rarr;
      </Link>
    )}
  </div>
)

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center py-20 bg-indigo-50 rounded-xl shadow-lg mb-12">
        <h1 className="text-5xl font-extrabold text-indigo-900 mb-4">
          Welcome to 3DPC Mart
        </h1>
        <p className="text-xl text-indigo-700 mb-8 max-w-2xl mx-auto">
          Your destination for high-quality components and accessories.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
        >
          Start Shopping Now
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <FeatureCard
          icon="🛠️"
          title="Premium Quality"
          description="We source only the best products for superior performance and durability."
        />
        <FeatureCard
          icon="🚀"
          title="Fast Shipping"
          description="Get your components quickly with our expedited and reliable delivery service."
        />
        <FeatureCard
          icon="🛒"
          title="Extensive Catalog"
          description="Browse hundreds of items across all major categories."
          linkText="View Products"
          linkHref="/products"
        />
      </div>
    </div>
  )
}
