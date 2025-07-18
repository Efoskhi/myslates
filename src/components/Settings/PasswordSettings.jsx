import React, { useState } from "react";
import Logo from "../../assets/Logo3.png";
import Key from "../../assets/Key3.png";
import { IoIosArrowBack } from "react-icons/io";
import { MdLockOutline } from "react-icons/md";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Lines from "../../assets/Lines.png";
import useSettings from "../../Hooks/useSettings";
import Loading from "../Layout/Loading";

export default function PasswordSettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const { inputs, isSaving, handleInput, handleUpdatePassword } = useSettings();

  const checkPasswordStrength = (pass) => {
    let strength = 0;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (pass.length >= 8) strength += 1;
    return strength;
  };

  const passwordStrength = checkPasswordStrength(inputs.password.newPassword);

  const getStrengthColor = () => {
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength === 3) return "bg-green-500";
    return "bg-gray-300";
  };

  return (
    <div className="flex flex-col relative items-center justify-between py-8 h-screen w-full text-black">
      <div>
        <div className="text-start border-b pb-4 flex flex-col">
          <h1 className="text-xl font-bold">Change Password</h1>
          <p className="mt-2 text-gray-600 text-sm w-96 mx-auto">
            Update password for enhanced account security.
          </p>
        </div>

        <div className="mt-2 w-full flex flex-col space-y-2">
          <div>
            <label className="text-xs text-black font-semibold">
              Current Password
            </label>
            <div className="relative border px-2 rounded-md">
              <MdLockOutline className="absolute top-2.5 text-1xl" />
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={inputs.password.currentPassword}
                onChange={(e) => handleInput("password.currentPassword", e.target.value)}
                placeholder="********"
                className="px-8 border-none outline-none text-sm py-2 rounded-md font-semibold w-full"
              />
              <button
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute top-2.5 right-3"
              >
                {showCurrentPassword ? (
                  <FiEyeOff className="text-1xl" />
                ) : (
                  <FiEye className="text-1xl" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-2 w-full flex flex-col space-y-2">
          <div>
            <label className="text-xs text-black font-semibold">
              New Password
            </label>
            <div className="relative border px-2 rounded-md">
              <MdLockOutline className="absolute top-2.5 text-1xl" />
              <input
                type={showPassword ? "text" : "password"}
                value={inputs.password.newPassword}
                onChange={(e) => handleInput("password.newPassword", e.target.value)}
                placeholder="********"
                className="px-8 border-none outline-none text-sm py-2 rounded-md font-semibold w-full"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2.5 right-3"
              >
                {showPassword ? (
                  <FiEyeOff className="text-1xl" />
                ) : (
                  <FiEye className="text-1xl" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-black font-semibold">
              Confirm Password
            </label>
            <div className="relative border px-2 rounded-md">
              <MdLockOutline className="absolute top-2.5 text-1xl" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={inputs.password.retypePassword}
                onChange={(e) => handleInput("password.retypePassword", e.target.value)}
                placeholder="********"
                className="px-8 border-none outline-none text-sm py-2 rounded-md font-semibold w-full"
              />
              <button
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-2.5 right-3"
              >
                {showConfirmPassword ? (
                  <FiEyeOff className="text-1xl" />
                ) : (
                  <FiEye className="text-1xl" />
                )}
              </button>
            </div>
          </div>

          <div className="w-full mt-2 h-2 rounded-md overflow-hidden bg-gray-200">
            <div
              className={`h-full ${getStrengthColor()} transition-all`}
              style={{ width: `${(passwordStrength / 3) * 100}%` }}
            />
          </div>
          <div className="text-xs space-y-1 mt-2">
            <p className="text-gray-500">
              Weak password. Must contain at least:
            </p>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    /[A-Z]/.test(inputs.password.newPassword) ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <span>At least 1 uppercase</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    /[0-9]/.test(inputs.password.newPassword) ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <span>At least 1 number</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    inputs.password.newPassword.length >= 8 ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <span>At least 8 characters</span>
              </div>
            </div>
          </div>
          <button 
            onClick={handleUpdatePassword}
            className="bg-[#047aa5] text-white text-sm py-3 rounded-md font-semibold w-full"
          >
              {isSaving ? <Loading/> : "Save Changes"}
            </button>
        </div>
      </div>
    </div>
  );
}
