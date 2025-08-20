import React from 'react'
import { Link } from 'react-router-dom'
import womenColl from '../../assets/women-coll.avif'  // ✅ Thêm import
import menColl from '../../assets/men-coll.jpg'       // ✅ Thêm import

const GenderCollectionSection = () => {
    return (
        <section className='py-1 px-4 lg:px-0'>
            <div className='container mx-auto flex flex-col md:flex-row gap-1'>
                <Link to="/collections/all?gender=Women" className='relative flex-1 overflow-hidden group block'>
                    <img src={womenColl} alt="Women's Collection" className='w-full h-[700px] object-cover transform group-hover:scale-105 transition duration-500 ease-in-out' />
                    <div className='absolute bottom-8 backdrop-blur-sm rounded-lg left-8 bg-white/50 p-4'>
                        <h2 className='text-2xl font-bold text-gray-900 mb-3'>Women's Collection</h2>
                        <span className="text-gray-900 underline">Shop Now</span>
                    </div>
                </Link>

                <Link to="/collections/all?gender=Men" className='relative flex-1 overflow-hidden group block'>
                    <img src={menColl} alt="Men's Collection" className='w-full h-[700px] object-cover object-top transform group-hover:scale-105 transition duration-500 ease-in-out' />
                    <div className='absolute bottom-8 left-8 backdrop-blur-sm rounded-lg bg-white/50 p-4'>
                        <h2 className='text-2xl font-bold text-gray-900 mb-3'>Men's Collection</h2>
                        <span className="text-gray-900 underline">Shop Now</span>
                    </div>
                </Link>
            </div>
        </section>
    )
}

export default GenderCollectionSection