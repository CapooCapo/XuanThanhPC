import React, { useState, useEffect, useMemo } from 'react';
import { mockProducts } from '@/data/mockProducts';
import FilterSidebar from '@/components/buildpc/FilterSidebar';
import MobileFilterDrawer from '@/components/buildpc/MobileFilterDrawer';
import SearchBar from '@/components/buildpc/SearchBar';
import ProductGrid from '@/components/buildpc/ProductGrid';
import Pagination from '@/components/buildpc/Pagination';
import Header from '@/components/layout/Header/Header';
import BuildPCQuizModal from '@/components/buildpc/quiz/BuildPCQuizModal';
import { calculateRecommendations } from '@/utils/recommendationEngine';
import { getProducts } from '@/services/productService';
import '@/styles/build-pc/build-pc.scss';

const PRODUCTS_PER_PAGE = 20;

const BuildPCPage = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        if (data && data.length > 0) {
          // Map backend specifications to match frontend expectations
          const mappedData = data.map(p => ({
            ...p,
            cpu: p.specifications?.cpu || 'Unknown',
            gpu: p.specifications?.gpu || 'Unknown',
            ram: p.specifications?.ram || 'Unknown',
            purpose: p.specifications?.purpose || 'Gaming',
            specs: p.specifications?.specs || []
          }));
          setProducts(mappedData);
        }
      } catch (error) {
        console.error('Failed to fetch products, falling back to mock data:', error);
      }
    };
    fetchProducts();
  }, []);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset page on new search
  };

  const handleFilterChange = (filterTitle, option) => {
    setActiveFilters(prev => {
      const currentOptions = prev[filterTitle] || [];
      const updatedOptions = currentOptions.includes(option)
        ? currentOptions.filter(o => o !== option)
        : [...currentOptions, option];
      
      return {
        ...prev,
        [filterTitle]: updatedOptions
      };
    });
    setCurrentPage(1); // Reset page on filter change
  };

  const handleApplyRecommendation = (answers) => {
    setQuizAnswers(answers);
    const newFilters = { ...activeFilters };
    
    // Map quiz answers to product filters for the regular grid too
    if (answers.purpose) {
      const purposeMap = {
        'gaming': 'Gaming',
        'office': 'Văn phòng',
        'design': 'Đồ họa',
        'streaming': 'Streamer'
      };
      if (purposeMap[answers.purpose]) {
        newFilters['Mục đích sử dụng'] = [purposeMap[answers.purpose]];
      }
    }
    
    if (answers.budget) {
      const budgetMap = {
        'under_10m': 'Dưới 10 triệu',
        '10_20m': '10 - 20 triệu',
        '20_40m': '20 - 40 triệu',
        'above_40m': 'Trên 40 triệu'
      };
      if (budgetMap[answers.budget]) {
        newFilters['Khoảng giá'] = [budgetMap[answers.budget]];
      }
    }

    setActiveFilters(newFilters);
    setCurrentPage(1);
    
    // Scroll to products slightly below header
    setTimeout(() => window.scrollTo({ top: 300, behavior: 'smooth' }), 100);
  };

  const recommendedProducts = useMemo(() => {
    if (!quizAnswers) return [];
    return calculateRecommendations(products, quizAnswers)
      .filter(p => p.recommendationScore >= 20); // Only keep highly relevant matches
  }, [quizAnswers, products]);

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  const checkPriceRange = (price, rangeString) => {
    if (rangeString === 'Dưới 10 triệu') return price < 10000000;
    if (rangeString === '10 - 20 triệu') return price >= 10000000 && price <= 20000000;
    if (rangeString === '20 - 40 triệu') return price > 20000000 && price <= 40000000;
    if (rangeString === 'Trên 40 triệu') return price > 40000000;
    return true;
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Search Query
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.cpu.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.gpu.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      // 2. Filters
      let matchesFilters = true;
      for (const [key, values] of Object.entries(activeFilters)) {
        if (values.length === 0) continue;

        if (key === 'Khoảng giá') {
          const matchesAnyPrice = values.some(val => checkPriceRange(product.price, val));
          if (!matchesAnyPrice) matchesFilters = false;
        } else if (key === 'CPU') {
          if (!values.includes(product.cpu)) matchesFilters = false;
        } else if (key === 'GPU') {
          // Approximate match for GPU family (e.g. RTX 4060 vs RTX 4060 Ti)
          const matchesAnyGpu = values.some(val => product.gpu.includes(val));
          if (!matchesAnyGpu) matchesFilters = false;
        } else if (key === 'RAM') {
          if (!values.includes(product.ram)) matchesFilters = false;
        } else if (key === 'Mục đích sử dụng') {
          if (!values.includes(product.purpose)) matchesFilters = false;
        }
      }

      return matchesFilters;
    });
  }, [searchQuery, activeFilters, products]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <>
      <Header />
      <BuildPCQuizModal onApplyRecommendation={handleApplyRecommendation} />
      <div className="build-pc-page">
        <div className="container">
          {/* Left Sidebar (Desktop) */}
        <div className="left-sidebar">
          <FilterSidebar 
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Right Content */}
        <div className="right-content">
          <div className="top-section">
            <SearchBar onSearch={handleSearch} />
            <button 
              className="mobile-filter-btn" 
              onClick={toggleMobileFilter}
              style={{
                display: 'none', // Hidden on desktop, shown via CSS on mobile
                marginTop: '16px',
                width: '100%',
                padding: '12px',
                backgroundColor: '#19C37D',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Bộ lọc
            </button>
          </div>

          <div className="products-section">
            {quizAnswers && recommendedProducts.length > 0 && (
              <div className="recommendations-section" style={{ marginBottom: '40px' }}>
                <div className="results-count" style={{ marginBottom: '16px', color: '#19C37D', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.5rem' }}>✨</span> Gợi ý hàng đầu dựa trên bài test của bạn
                </div>
                <ProductGrid products={recommendedProducts.slice(0, 4)} />
                <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #eee' }} />
              </div>
            )}

            <div className="results-count" style={{ marginBottom: '16px', color: '#667085' }}>
              Hiển thị {currentProducts.length} trên tổng số {filteredProducts.length} sản phẩm
            </div>
            
            <ProductGrid products={currentProducts} />
            
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileFilterDrawer 
        isOpen={isMobileFilterOpen}
        onClose={toggleMobileFilter}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      />
      
      {/* Inline style specifically for mobile filter button since we want to keep CSS simple */}
      <style>{`
        @media (max-width: 767px) {
          .mobile-filter-btn {
            display: block !important;
          }
        }
      `}</style>
      </div>
    </>
  );
};

export default BuildPCPage;
