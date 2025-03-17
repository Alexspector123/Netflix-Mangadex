"use client";
import React, { useCallback, useState } from "react";
import Input from "@/components/input";


const Auth = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const [variant, setVariant] = useState("login");

    const toggleVariant = useCallback(() => {
        setVariant((currentVariant) => currentVariant === "login" ? "register" : "login");
    }, []);


    return (
      <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-cover bg-center bg-fixed">
        <div className="bg-black/50 h-full w-full">
            <nav className="px-12 py-5">
                <img src="/images/logo.jpg" alt="Logo" className="h-12" />
            </nav>
            <div className="flex justify-center">
                <div className="bg-black/70 px-16 py-16 self-center mt-2 lg:max-w-md rounded-md w-full">
                    <h2 className="text-white text-4xl mb-8 font-semibold">
                        {variant === "login" ? "Sign In" : "Register"}
                    </h2>
                    <div className="flex flex-col space-y-4">
                        {variant === "register" && (
                            <Input
                                label="Username"
                                onChange={(ev: any) => setName(ev.target.value)}
                                id="name"
                                value={name}
                            />
                        )}
                        <Input
                            label="Email"
                            onChange={(ev: any) => setEmail(ev.target.value)}
                            id="email"
                            type="email"
                            value={email}
                        />
                        <Input
                            label="Password"
                            onChange={(ev: any) => setPassword(ev.target.value)}
                            id="password"
                            type="password"
                            value={password}
                        />
                        <button className="bg-red-600 text-white py-3 rounded-md w-full mt-10 hover:bg-red-700 transition duration-200">
                           {variant === "login" ? "Sign In" : "Register"}
                        </button>
                        <p className="text-neutral-500 mt-12">
                            {variant === "login" ? "Don't have an account?" : "Already have an account?"} <span onClick={toggleVariant} className="text-white ml-1 cursor-pointer hover:text-red-500">
                                {variant === "login" ? "Create an account" : "Log into your account"}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  };
  
  export default Auth;
  