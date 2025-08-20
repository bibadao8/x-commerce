import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { registerUser } from '../redux/slices/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { mergeCart } from '../redux/slices/cartSlice'

const Register = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch()

    const navigate = useNavigate();
    const location = useLocation();
    const { user, guestId } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);

    // Get redirect parameter and check if it's checkout or something
    const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    const isCheckoutRedirect = redirect.includes("checkout");

    useEffect(() => {
        if (user) {
            if (cart?.products.length > 0 && guestId) {
                dispatch(mergeCart({ guestId, user })).then(() => {
                    navigate(isCheckoutRedirect ? "/checkout" : "/")
                })
            } else {
                navigate(isCheckoutRedirect ? "/checkout" : "/")
            }
        }
    }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(registerUser({ name, email, password }))
    }

    return (
        <div className='flex bg-white'>
            <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
                <form
                    onSubmit={handleSubmit}
                    className='w-full max-w-md bg-white p-8 rounded-lg shadow-2xl transform transition-transform duration-500 ease-in-out hover:scale-105'
                >
                    <div className='flex justify-center mb-6'>
                        <h2 className='text-xl font-medium'>X-Commerce</h2>
                    </div>
                    <h2 className='text-2xl font-bold text-center mb-6'>Hey there!👋</h2>
                    <p className='text-center mb-6'>Enter your details to register</p>
                    <div className='mb-4'>
                        <label className='block text-sm font-semibold mb-2'>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='w-full p-2 border rounded'
                            placeholder='Enter your name'
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-sm font-semibold mb-2'>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full p-2 border rounded'
                            placeholder='Enter your email address'
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-sm font-semibold mb-2'>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full p-2 border rounded'
                            placeholder='Enter your password'
                        />
                    </div>
                    <button
                        type='submit'
                        className='w-full bg-black text-white p-2 rounded-lg font-semibold hover:text-white hover:cursor-pointer hover:bg-[#565449] transition'
                    >
                        Sign Up
                    </button>
                    <p className='mt-6 text-center text-sm'>
                        Already have an account?
                        <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className='text-blue-500'> Login</Link>
                    </p>
                </form>
            </div>
            <div className='hidden md:block w-1/2 bg-gray-800'>
                <div className='h-full flex flex-col justify-center items-center overflow-hidden'>
                    <img
                        src="../../src/assets/registerimg.webp"
                        alt="Register to Account"
                        className='object-top h-[750px] w-full object-cover transform transition-transform duration-500 ease-in-out hover:scale-105'
                    />
                </div>
            </div>
        </div>
    )
}

export default Register
