import { auth } from "./firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useEffect, useState } from "react";

const navLinks = ["Shop", "About", "Contact"];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // hamburger
  const [showLogin, setShowLogin] = useState(false);
  const [otpStage, setOtpStage] = useState<"options" | "phone" | "otp">("options");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔹 On mount → check if user already logged in (JWT in localStorage)
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // ⭐ LOAD GOOGLE SDK ONCE
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id:
            "125602396414-8opuvdanvo8eso6fise6smerckth0glh.apps.googleusercontent.com",
          callback: handleGoogleResponse,
        });
        setGoogleLoaded(true);
      }
    };

    document.body.appendChild(script);
  }, []);

  // ⭐ RENDER GOOGLE BUTTON when: login open + options screen + SDK loaded
  useEffect(() => {
    if (!showLogin) return;
    if (!googleLoaded) return;
    if (otpStage !== "options") return;

    const interval = setInterval(() => {
      const btn = document.getElementById("googleContainer");

      if (btn) {
        btn.innerHTML = ""; // avoid duplicates
        window.google.accounts.id.renderButton(btn, {
          theme: "outline",
          size: "large",
          width: "250px",
          text: "continue_with",
        });
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [showLogin, otpStage, googleLoaded]);

  // 🔹 Dummy backend call for OTP login
  const mockLoginWithOtp = async (phone: string) => {
    // simulate API delay
    await new Promise((res) => setTimeout(res, 500));

    // dummy JWT
    const fakeJwt = `dummy-jwt-for-${phone}`;
    localStorage.setItem("authToken", fakeJwt);
    setIsAuthenticated(true);
  };

  // 🔹 Dummy backend call for Google login
  const mockLoginWithGoogle = async (idToken: string) => {
    await new Promise((res) => setTimeout(res, 500));

    const fakeJwt = `dummy-jwt-google-${idToken.substring(0, 10)}`;
    localStorage.setItem("authToken", fakeJwt);
    setIsAuthenticated(true);
  };

  // ⭐ GOOGLE CALLBACK
  const handleGoogleResponse = async (res: any) => {
    console.log("Google Token:", res.credential);

    // 👉 send to backend later. For now, mock:
    await mockLoginWithGoogle(res.credential);

    alert("Google Login Success!");
    closeModal();
  };

  // ⭐ CLOSE MODAL CLEANLY
  const closeModal = () => {
    setShowLogin(false);
    setOtpStage("options");
    setPhone("");
    setOtp("");
  };

  // ⭐ HAMBURGER TOGGLE
  const toggleMenu = () => {
    const next = !isOpen;
    setIsOpen(next);
    document.body.style.overflow = next ? "hidden" : "auto";
  };

  // ⭐ LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  // ⭐ SEND OTP (Invisible-ish reCAPTCHA + loader)
  const sendOtp = async () => {
    if (!phone) return alert("Enter phone number");

    try {
      setLoadingOtp(true);
      alert("Sending OTP...");

      // Create invisible reCAPTCHA only once
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible", // invisible widget
            callback: () => console.log("reCAPTCHA solved (auto)"),
          }
        );
      }

      const appVerifier = window.recaptchaVerifier;

      const result = await signInWithPhoneNumber(auth, phone, appVerifier);

      window.confirmationResult = result;

      alert("OTP Sent Successfully!");
      setOtpStage("otp");
    } catch (err) {
      console.error("OTP ERROR:", err);
      alert("Failed to send OTP");
    } finally {
      setLoadingOtp(false);
    }
  };

  // ⭐ VERIFY OTP
  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");

    try {
      const result = await window.confirmationResult.confirm(otp);
      console.log("Firebase User:", result.user);

      // 👉 Call backend (mocked):
      await mockLoginWithOtp(phone);

      alert("OTP Verified Successfully!");
      closeModal();
    } catch (error) {
      console.log(error);
      alert("Invalid OTP");
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <header className="w-full bg-[#F7F3E8] md:fixed md:z-40 top-0 left-0 right-0">
        <nav className="flex justify-between items-center px-6 py-4">
          <div className="text-xl font-semibold">Clothify</div>

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex gap-6 text-sm font-medium">
            {navLinks.map((l) => (
              <li key={l} className="cursor-pointer hover:text-gray-600">
                {l}
              </li>
            ))}
            <li>
              {!isAuthenticated ? (
                <button
                  className="hover:text-gray-600"
                  onClick={() => setShowLogin(true)}
                >
                  Login / Signup
                </button>
              ) : (
                <button
                  className="hover:text-gray-600"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              )}
            </li>
          </ul>

          {/* ⭐ MOBILE HAMBURGER */}
          <button
            onClick={toggleMenu}
            className="md:hidden relative flex h-10 w-10 flex-col items-center justify-center gap-1"
          >
            <span
              className={`h-0.5 w-6 bg-black transition duration-300 ${
                isOpen ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-black transition duration-300 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-black transition duration-300 ${
                isOpen ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </button>
        </nav>
      </header>

      {/* ⭐ MOBILE SLIDE MENU */}
      <div
        className={`
          fixed inset-0 bg-[#F7F3E8] md:hidden z-50
          transform transition-transform duration-300 ease-out
          h-screen w-full
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* TOP BAR */}
        <div className="flex justify-between items-center px-6 py-4">
          <div className="text-xl font-semibold">Clothify</div>

          {/* X BUTTON */}
          <button
            onClick={toggleMenu}
            className="relative flex h-10 w-10 flex-col items-center justify-center gap-1"
          >
            <span className="h-0.5 w-6 bg-black translate-y-1.5 rotate-45" />
            <span className="h-0.5 w-6 bg-black opacity-0" />
            <span className="h-0.5 w-6 bg-black -translate-y-1.5 -rotate-45" />
          </button>
        </div>

        {/* LOGIN / LOGOUT BUTTON */}
        <button
          onClick={() => {
            if (isAuthenticated) {
              handleLogout();
              toggleMenu();
            } else {
              toggleMenu();
              setShowLogin(true);
            }
          }}
          className="w-full border-b border-black/20 pb-4 pl-5 text-left text-xl"
        >
          {isAuthenticated ? "Logout" : "Login / Signup"}
        </button>

        {/* MENU LINKS */}
        <div className="mt-10 flex flex-col gap-8 text-xl px-2">
          {navLinks.map((l) => (
            <button
              key={l}
              onClick={toggleMenu}
              className="w-full border-b border-black/20 pb-4 text-left pl-5"
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* ⭐ LOGIN POPUP */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex justify-center items-center">
          <div className="bg-white w-[90%] max-w-sm rounded-lg p-6 relative">
            {/* CLOSE BUTTON */}
            <button className="absolute right-3 top-3 text-xl" onClick={closeModal}>
              ✖
            </button>

            {/* OPTIONS SCREEN */}
            {otpStage === "options" && (
              <>
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Login / Signup
                </h2>

                {/* OTP OPTION FIRST */}
                <button
                  onClick={() => setOtpStage("phone")}
                  className="w-full border rounded-md py-2 hover:bg-gray-50 mb-4"
                >
                  Continue with Phone (OTP)
                </button>

                {/* GOOGLE BUTTON BELOW OTP */}
                <div className="flex justify-center">
                  <div
                    id="googleContainer"
                    style={{
                      height: "45px",
                      width: "250px",
                    }}
                  ></div>
                </div>
              </>
            )}

            {/* PHONE INPUT */}
            {otpStage === "phone" && (
              <>
                <h2 className="text-lg font-semibold mb-4 text-center">
                  Enter Phone Number
                </h2>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 mb-4"
                  placeholder="+91 9876543210"
                />
                {/* recaptcha container (hidden) */}
                <div
                  id="recaptcha-container"
                  className="opacity-0 h-0 overflow-hidden"
                ></div>
                <button
                  onClick={sendOtp}
                  disabled={loadingOtp}
                  className="w-full bg-black text-white rounded-md py-2 disabled:opacity-60"
                >
                  {loadingOtp ? "Sending..." : "Send OTP"}
                </button>
              </>
            )}

            {/* OTP INPUT */}
            {otpStage === "otp" && (
              <>
                <h2 className="text-lg font-semibold mb-4 text-center">
                  Enter OTP
                </h2>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 mb-4 text-center"
                  placeholder="123456"
                />
                <button
                  onClick={verifyOtp}
                  className="w-full bg-black text-white rounded-md py-2"
                >
                  Verify OTP
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
