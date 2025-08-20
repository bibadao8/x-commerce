import React from 'react';
import { Link } from 'react-router-dom';
import { normalizeImageUrl } from '../../utils/imageUtils';

const ProductGrid = ({ products, loading, error }) => {
    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {products.map((product, index) => (
                <Link key={index} to={`/product/${product._id}`} className='block'>
                    <div className='bg-white p-4 rounded'>
                        <div className='w-full h-96 mb-4 overflow-hidden rounded-lg'>
                            <img
                                src={normalizeImageUrl(product.images?.[0]?.url)}
                                onError={(e) => { 
                                    e.currentTarget.src = '/placeholder.png'; 
                                    e.currentTarget.onerror = null; 
                                }}
                                alt={product.images?.[0]?.altText || product.name}
                                className='w-full h-full object-cover transform transition-transform duration-300 ease-in-out hover:scale-105'
                            />
                        </div>
                        <h3 className='text-sm mb-2 font-semibold'>{product.name}</h3>
                        <p className='text-gray-500 font-medium tracking-tighter text-sm'>
                            $ {product.price}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default ProductGrid;
