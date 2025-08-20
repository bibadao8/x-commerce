import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import img1 from '../../assets/hero-section-image.jpg';
import img2 from '../../assets/featured.jpg';
import img3 from '../../assets/hero3.webp';
import img4 from '../../assets/hero2.jpg';

const images = [img1, img2, img3, img4];

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowContent(true);
        }, 500); // Delay before content appears

        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="relative w-full h-[700px] overflow-hidden">
            {images.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt={`Slide ${index}`}
                    className={`absolute inset-0 w-full h-225 object-cover object-center transition-opacity duration-1000 ease-in-out ${
                        index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                />
            ))}

            {/* Always present dark overlay */}
            <div className="absolute inset-0 bg-black/50 z-20" />

            {/* Content with delay */}
            {showContent && (
                <div className="absolute inset-0 flex items-center justify-center z-30">
                    <div
                        className="text-center text-white p-6 opacity-0 translate-y-5 animate-fade-up"
                        style={{
                            animation: 'fadeUp 0.8s ease-out forwards',
                        }}
                    >
                        <h1 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4 transform transition-all duration-300 ease-in-out hover:scale-102">
                            Vacation Ready
                        </h1>
                        <p className="text-sm tracking-tighter md:text-lg mb-6">
                            Explore our vacation-ready outfits with fast worldwide shipping.
                        </p>
                        <Link
                            to="#"
                            className="bg-white font-semibold text-gray-950 px-6 py-2 rounded-lg text-lg hover:bg-black hover:text-white transition-all duration-200"
                        >
                            Shop Now
                        </Link>
                    </div>
                </div>
            )}

            {/* Inline animation keyframes */}
            <style>
                {`
                @keyframes fadeUp {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-up {
                    animation: fadeUp 0.8s ease-out forwards;
                }
                `}
            </style>
        </section>
    );
};

export default Hero;
