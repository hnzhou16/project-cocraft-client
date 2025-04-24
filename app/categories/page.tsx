import { Suspense } from 'react';
import Link from 'next/link';

const popularTags = [
  'art', 'design', 'photography', 'music', 'writing',
  'coding', 'technology', 'fashion', 'food', 'travel',
  'fitness', 'gaming', 'education', 'business', 'marketing'
];

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Categories</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Popular Tags</h2>
          <div className="flex flex-wrap gap-3">
            {popularTags.map(tag => (
              <Link 
                key={tag} 
                href={`/categories?tag=${tag}`}
                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CategoryCard 
              title="Art & Design" 
              description="Explore creative works from artists and designers" 
              tags={['art', 'design', 'illustration', 'drawing']} 
            />
            <CategoryCard 
              title="Technology" 
              description="Discover tech innovations and coding projects" 
              tags={['coding', 'technology', 'programming', 'ai']} 
            />
            <CategoryCard 
              title="Photography" 
              description="View stunning photography from around the world" 
              tags={['photography', 'portrait', 'landscape', 'street']} 
            />
            <CategoryCard 
              title="Writing" 
              description="Read stories, poems, and articles" 
              tags={['writing', 'poetry', 'fiction', 'blog']} 
            />
            <CategoryCard 
              title="Music" 
              description="Listen to tracks and compositions" 
              tags={['music', 'audio', 'composition', 'production']} 
            />
            <CategoryCard 
              title="Lifestyle" 
              description="Explore content about food, travel, and more" 
              tags={['food', 'travel', 'fitness', 'lifestyle']} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface CategoryCardProps {
  title: string;
  description: string;
  tags: string[];
}

function CategoryCard({ title, description, tags }: CategoryCardProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Link 
            key={tag} 
            href={`/categories?tag=${tag}`}
            className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-full text-xs hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            #{tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
