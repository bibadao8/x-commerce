import React from 'react'
import { Link } from 'react-router-dom'
import featured from '../../assets/featured.jpg'  // ✅ Thêm import

const FeaturedCollection = () => {
    return (
        <section className='py-16 px-4 lg:px-0'>
            <div className='container mx-auto flex flex-col-reverse lg:flex-row items-center bg-green-50 shadow-md transition-all duration-300 hover:shadow-xl'>
                <div className='lg:w-1/2 p-8 text-center lg:text-left'>
                    <h2 className='text-lg font-semibold text-green-800 mb-2 uppercase tracking-wide'>Comfort and Style</h2>
                    <h2 className='text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight'>Apparel made for your everyday life</h2>
                    <p className='text-lg text-gray-600 mb-6'>Discover high-quality, comfortable clothing...</p>
                    <Link to="/collections/all" className='bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800 transition duration-300 ease-in-out'>Shop Now</Link>
                </div>
                <div className='lg:w-1/2 overflow-hidden'>
                    <img src={featured} alt="Featured Collection" className='w-full h-full object-cover transform hover:scale-105 transition-transform duration-500' />
                </div>
            </div>
        </section>
    )
}

export default FeaturedCollection