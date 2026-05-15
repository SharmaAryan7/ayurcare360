import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import BlogsTable from '../../components/admin/blogs/BlogsTable';
import BlogMetricsRow from '../../components/admin/blogs/BlogMetricsRow';
import { Loader2 } from 'lucide-react';

const AdminBlogsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    blogs: [],
    metrics: { trendingCategory: 'N/A', reviewRequired: 0, totalTraffic: 0 }
  });

  useEffect(() => {
    const fetchBlogsData = async () => {
      try {
        const [blogsRes, trendRes, reviewRes, trafficRes] = await Promise.all([
          adminApi.getAllBlogs(),
          adminApi.getTrendingCategory(),
          adminApi.getBlogsReviewRequired(),
          adminApi.getBlogTraffic()
        ]);

        setData({
          blogs: blogsRes.blogs || [],
          metrics: {
            trendingCategory: trendRes.category || 'N/A',
            reviewRequired: reviewRes.count || 0,
            totalTraffic: trafficRes.traffic || 0
          }
        });
      } catch (error) {
        console.error("Failed to load blogs data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogsData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-[#3A6447] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 md:p-10 max-w-[1600px] mx-auto animate-in fade-in duration-300 flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-3xl md:text-[32px] font-extrabold text-gray-900 tracking-tight leading-none mb-2">
          Blogs
        </h1>
        <p className="text-sm font-medium text-gray-500">
          Curate wellness insights for your patients.
        </p>
      </div>

      <div className="flex-1">
        <BlogsTable blogs={data.blogs} />
      </div>

      <BlogMetricsRow metrics={data.metrics} totalBlogs={data.blogs.length} />
    </div>
  );
};

export default AdminBlogsPage;