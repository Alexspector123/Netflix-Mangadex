import React from 'react'
import { useState } from "react";
import "../styles.css";
import { useAuthStore } from "../store/authUser";

import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

const AuthPage = () => {
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);

    // Login
    const [logInEmail, setLogInEmail] = useState("");
	const [logInPassword, setLogInPassword] = useState("");
    const [showLogInPassword, setShowLogInPassword] = useState(false);

	const { login, isLoggingIn } = useAuthStore();

    // Sign Up
    const { searchParams } = new URL(document.location);
	const emailValue = searchParams.get("email");

	const [signUpEmail, setSignUpEmail] = useState(emailValue || "");
	const [username, setUsername] = useState("");
	const [signUpPassword, setSignUpPassword] = useState("");
    const [showSignUpPassword, setShowSignUpPassword] = useState(false);

	const { signup, isSigningUp } = useAuthStore();

    const handleSignUpClick = () => {
        setIsRightPanelActive(true);
    };

    const handleSignInClick = () => {
        setIsRightPanelActive(false);
    };

    const handleLogin = (e) => {
		e.preventDefault();
		login({ logInEmail, logInPassword });
	};

    const handleSignUp = (e) => {
		e.preventDefault();
		signup({ signUpEmail, username, signUpPassword });
	};

    return (
        <div className="box-border">
            <div className="bg-[#221f24]
                            flex justify-center items-center flex-col
                            font-Montserrat
                            h-screen
                            -mt-5 mx-0 mb-[50px]">
                <div className={`auth-container ${isRightPanelActive ? "right-panel-active" : ""}`}>
                    <div className="form-container sign-up-container">
                        <form className="auth-form" action="#" onSubmit={handleSignUp}>
                            <h1 className="auth-h1">Create Account</h1>
                            <input 
                                className="auth-input" 
                                type="email"
                                placeholder="Email"
                                id="signUpEmail"
                                value={signUpEmail}
                                onChange={(e) => setSignUpEmail(e.target.value)} 
                            />
                            <input 
                                className="auth-input" 
                                type="text" 
                                placeholder="Username"
                                id='username'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)} 
                            />
                            <div className='relative w-full'>
                                <input 
                                    className="auth-input" 
                                    type={showSignUpPassword ? "text" : "password"} 
                                    placeholder="Password"
                                    id='signUpPassword'
                                    value={signUpPassword}
                                    onChange={(e) => setSignUpPassword(e.target.value)} 
                                />
                                <div 
                                    className='absolute right-1/25 top-2/5 cursor-pointer' 
                                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                                >
                                    {showSignUpPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                </div>
                            </div>
                            <button 
                                className="auth-button" 
                                type="submit"
                                disabled={isSigningUp}
                                >
                                {isSigningUp ? "Loading..." : "Sign Up"}
                            </button>
                        </form>
                    </div>

                    <div className="form-container sign-in-container">
                        <form className="auth-form" action="#" onSubmit={handleLogin}>
                            <h1 className="auth-h1">Login</h1>
                                <input 
                                    className="auth-input" 
                                    type="email" 
                                    placeholder="Email" 
                                    id='logInEmail'
                                    value={logInEmail}
                                    onChange={(e) => setLogInEmail(e.target.value)}
                                />
                                <div className='relative w-full'>
                                    <input
                                        type={showLogInPassword ? 'text' : 'password'}
                                        className="auth-input"
                                        placeholder='Password'
                                        id='logInPassword'
                                        value={logInPassword}
                                        onChange={(e) => setLogInPassword(e.target.value)}
                                    />
                                    <div 
                                        className='absolute right-1/25 top-2/5 cursor-pointer' 
                                        onClick={() => setShowLogInPassword(!showLogInPassword)}
                                    >
                                        {showLogInPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                    </div>
                                </div>
                            <a className="auth-a" href="#">Forgot your password?</a>					
                            <button
                                className='auth-button'
                                type='submit'
                                disabled={isLoggingIn}
                            >
                                {isLoggingIn ? "Loading..." : "Login"}
                            </button>
                        </form>
                    </div>

                    <div className="overlay-container">
                        <div className="overlay">
                            <div className="overlay-panel overlay-left">
                            <h1 className="auth-h1 text-white">Welcome Back!</h1>
                            <p className="auth-p">To keep connected with us please login with your personal info</p>
                            <button className="ghost auth-button" onClick={handleSignInClick}>
                                Login
                            </button>
                            </div>
                            <div className="overlay-panel overlay-right">
                            <h1 className="auth-h1 text-white">Hello, Friend!</h1>
                            <p className="auth-p">Enter your personal details and start journey with us</p>
                            <button className="ghost auth-button" onClick={handleSignUpClick}>
                                Sign Up
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthPage