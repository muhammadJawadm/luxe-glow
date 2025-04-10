import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="bg-white min-h-screen flex justify-center items-center px-4 sm:px-6 lg:px-">
      <div className="w-full max-w-lg p-6">
        <div className="flex justify-center items-center flex-col">
          <h2 className="text-3xl lg:text-2xl text-center font-bold mb-2">
            Login
          </h2>
          <p className="text-center text-sm text-grey mb-6">
            Logging in to your account. Access personalized features, save your
            preferences, and experience a seamless journey through our
            application
          </p>
        </div>

        <div className="border border-gray-300 p-4 rounded-xl">
          <form className="space-y-6 ">
            <div>
              <label
                htmlFor="email-address"
                className="mb-2 block text-md font-bold text-black-100"
              >
                Email Address
              </label>
              <div className="flex items-center border rounded-xl bg-transparent border-gray-300">
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent text-primary placeholder-gray-500 focus:outline-primary focus:rounded-xl text-sm px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-md font-bold text-black-100"
              >
                Password
              </label>
              <div className="flex items-center border rounded-xl bg-transparent border-gray-300">
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className="flex-1 bg-transparent text-primary placeholder-gray-500 focus:outline-primary focus:rounded-xl text-sm px-3 py-2"
                />
              </div>
            </div>

            <div>
              <Link
                to={"/"}
                className="w-full flex justify-center py-2 px-4 text-md font-medium border border-transparent rounded-xl text-white bg-primary"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
