import React, { useState } from "react";
import { useAuth } from "../../Hook/useAuth";
import Spinner from "../../Utils/Spinner";

function Auth() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();

  const handleSubmit = () => {
    // console.log(userInfo);

    auth(userInfo, isSignup, setIsLoading);
  };

  return (
    <div className="w-screen h-screen bg-slate-50 flex justify-center items-center px-10">
      <div className="bg-white shadow-sm p-10 w-full md:w-[70%] lg:w-[60%] xl:w-[45%]">
        <h2 className="text-2xl font-bold text-center text-slate-800 pb-5">
          {isSignup ? "Signup" : "Login"}{" "}
        </h2>
        <div className="flex flex-col gap-4">
          {isSignup && (
            <input
              type="text"
              placeholder="Enter your name"
              onChange={(e) =>
                setUserInfo((prev) => ({ ...prev, name: e.target.value }))
              }
              value={userInfo.name}
              className="w-full outline-none border-b border-slate-300 py-2 px-2 focus:border-emerald-400"
            />
          )}
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) =>
              setUserInfo((prev) => ({ ...prev, email: e.target.value }))
            }
            value={userInfo.email}
            className="w-full outline-none border-b border-slate-300 py-2 px-2 focus:border-emerald-400"
          />
          <input
            type="text"
            placeholder="Enter your password"
            onChange={(e) =>
              setUserInfo((prev) => ({ ...prev, password: e.target.value }))
            }
            value={userInfo.password}
            className="w-full outline-none border-b border-slate-300 py-2 px-2 focus:border-emerald-400"
          />
          <button
            onClick={handleSubmit}
            className="bg-emerald-500 text-white py-1 rounded-md cursor-pointer active:bg-emerald-600 hover:scale-101 transition flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <Spinner />
            ) : (
              <span className="font-medium">
                {isSignup ? "Signup" : "Login"}
              </span>
            )}
          </button>

          <p>
            {isSignup ? (
              <span className="text-sm">
                Already an user?{" "}
                <small
                  onClick={() => setIsSignup(false)}
                  className="text-blue-600 cursor-pointer text-sm"
                >
                  Please Login
                </small>
              </span>
            ) : (
              <span className="text-sm">
                You are new ?{" "}
                <small
                  onClick={() => setIsSignup(true)}
                  className="text-blue-600 cursor-pointer text-sm"
                >
                  Please Signup
                </small>
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
