import React, { useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { Link } from 'react-router-dom'
import axios from "axios"

const NewArrivals = () => {
    const scrollRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [newArrivals, setNewArrivals] = useState([]);

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
                );
                setNewArrivals(response.data);
            } catch (error) {
                console.error(error)
            }
        };
        fetchNewArrivals()
    }, []);

    const handleMouseDown = (e) => {
        setIsDragging(true)
        setStartX(e.pageX - scrollRef.current.offsetLeft)
        setScrollLeft(scrollRef.current.scrollLeft)
    }

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = x - startX
        scrollRef.current.scrollLeft = scrollLeft - walk
    }

    const handleMouseUpOrLeave = () => {
        setIsDragging(false)
    }

    const scroll = (direction) => {
        const scrollAmount = direction === "left" ? -300 : 300
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }

    const updateScrollButtons = () => {
        const container = scrollRef.current
        if (container) {
            const leftScroll = container.scrollLeft
            const clientWidth = container.clientWidth
            const rightScrollable = container.scrollWidth > leftScroll + clientWidth
            setCanScrollLeft(leftScroll > 0)
            setCanScrollRight(rightScrollable)
        }
    }

    useEffect(() => {
        const container = scrollRef.current
        if (container) {
            container.addEventListener("scroll", updateScrollButtons)
            updateScrollButtons()
            return () => container.removeEventListener("scroll", updateScrollButtons)
        }
    }, [newArrivals])

    return (
        <section className='p-6'>
            <div className='container mx-auto text-center mt-8 mb-10 relative'>
                <h2 className='text-3xl font-bold mb-4'>Explore New Arrivals</h2>
                <p className='text-lg text-gray-600 mb-8'>
                    Discover the latest styles straight off the runway, freshly added to keep your wardrobe on the cutting edge of fashion.
                </p>

                <div className='absolute right-0 bottom-[-30px] flex space-x-2'>
                    <button
                        onClick={() => scroll("left")}
                        disabled={!canScrollLeft}
                        className={`p-2 rounded border ${canScrollLeft ? "bg-white text-black" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                    >
                        <FiChevronLeft className='text-2xl' />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className={`p-2 rounded border ${canScrollRight ? "bg-white text-black" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                    >
                        <FiChevronRight className='text-2xl' />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className='container mx-auto overflow-x-scroll flex space-x-6 relative scrollbar-hide'
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
            >
                {newArrivals.map((product) => (
                    <div key={product._id} className='min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative'>
                        <div className="relative h-[550px] overflow-hidden rounded-lg">
                            <img
                                className='w-full h-full object-cover object-top transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer'
                                draggable="false"
                                src={product.images[0]?.url}
                                alt={product.images[0]?.altText || product.name}
                            />
                            <div className='absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 backdrop-blur-sm'>
                                <Link to={`/product/${product._id}`} className='block'>
                                    <h4 className='font-medium'>{product.name}</h4>
                                    <p className='mt-1'>${product.price}</p>
                                </Link>
                            </div>
                        </div>
                    </div>

                ))}
            </div>
        </section>
    )
}

export default NewArrivals