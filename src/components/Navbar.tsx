import { auth, RecaptchaVerifier } from "./firebase";
import { useState, useEffect } from "react";

const navLinks = ["Shop", "About", "Contact"];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [otpStage, setOtpStage] = useState<"options" | "phone" | "otp">("options");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  // ⭐ LOAD GOOGLE SDK + REGISTER CALLBACK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log("Google SDK Loaded");

      window.google?.accounts.id.initialize({
        client_id: "125602396414-8opuvdanvo8eso6fise6smerckth0glh.apps.googleusercontent.com",
        callback: handleGoogleResponse,
      });
    };

    document.body.appendChild(script);
  }, []);

  // ⭐ ALWAYS RENDER BUTTON WHEN LOGIN POPUP OPENS
  useEffect(() => {
    if (showLogin && window.google) {
      setTimeout(() => {
        const btn = document.getElementById("googleBtn");

        if (btn) {
          btn.innerHTML = ""; // Clear old renders

          window.google.accounts.id.renderButton(btn, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "continue_with",
          });
        }
      }, 50);
    }
  }, [showLogin]);

  // ⭐ GOOGLE CALLBACK
  const handleGoogleResponse = (res: any) => {
    console.log("Google Token:", res.credential);
    alert("Google Login Success");
    setShowLogin(false);
  };

  // ⭐ HAMBURGER
  const toggleMenu = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      document.body.style.overflow = newState ? "hidden" : "auto";
      return newState;
    });
  };

  // ⭐ SEND OTP
  const sendOtp = async () => {
    if (!phone) return alert("Enter phone number");

    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });

      setOtpStage("otp"); // backend comes later
    } catch (error) {
      alert("Failed to send OTP");
    }
  };

  // ⭐ VERIFY OTP
  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");

    alert("OTP Verified (frontend only)");
    setShowLogin(false);
    setOtp("");
    setPhone("");
    setOtpStage("options");
  };

  return (
    <>
      {/* NAVBAR */}
      <header className="w-full bg-[#F7F3E8] md:fixed md:top-0 md:left-0 md:right-0 md:z-40">
        <nav className="flex w-full items-center justify-between px-6 py-4">
          <div className="text-xl font-semibold tracking-wide">Clothify</div>

          <ul className="hidden md:flex gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link} className="cursor-pointer hover:text-gray-600">{link}</li>
            ))}
            <li>
              <button className="hover:text-gray-600" onClick={() => setShowLogin(true)}>
                Login / Signup
              </button>
            </li>
          </ul>

          {/* HAMBURGER */}
          <button
            className="md:hidden flex flex-col gap-1 h-10 w-10 justify-center items-center"
            onClick={toggleMenu}
          >
            <span className={`h-0.5 w-6 bg-black ${isOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`h-0.5 w-6 bg-black ${isOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 bg-black ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </nav>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 bg-[#F7F3E8] z-50 md:hidden transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between px-6 py-4">
          <div className="text-xl font-semibold">Clothify</div>
          <button onClick={toggleMenu}>✖</button>
        </div>

        <button
          onClick={() => { toggleMenu(); setShowLogin(true); }}
          className="w-full border-b border-black/20 pb-4 pl-5 text-xl"
        >
          Login / Signup
        </button>

        <div className="mt-10 flex flex-col gap-8 px-2">
          {navLinks.map((link) => (
            <button key={link} className="border-b border-black/20 pb-4" onClick={toggleMenu}>
              <div className="pl-5">{link}</div>
            </button>
          ))}
        </div>
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex justify-center items-center">
          <div className="bg-white w-[90%] max-w-sm rounded-lg p-6 relative">

            <button className="absolute right-3 top-3 text-xl" onClick={() => setShowLogin(false)}>
              ✖
            </button>

            {/* ⭐ GOOGLE BUTTON (ALWAYS HERE) */}
            <div className="flex justify-center mb-6">
              <div id="googleBtn"></div>
            </div>

            {/* OPTIONS */}
            {otpStage === "options" && (
              <button
                className="w-full border rounded-md py-2 mb-4"
                onClick={() => setOtpStage("phone")}
              >
                Continue with Phone (OTP)
              </button>
            )}

            {/* PHONE */}
            {otpStage === "phone" && (
              <>
                <h2 className="text-xl font-semibold mb-4 text-center">Enter Phone Number</h2>
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  className="border w-full px-3 py-2 rounded-md mb-4"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <div id="recaptcha-container"></div>

                <button className="bg-black w-full text-white rounded-md py-2" onClick={sendOtp}>
                  Send OTP
                </button>
              </>
            )}

            {/* OTP */}
            {otpStage === "otp" && (
              <>
                <h2 className="text-xl font-semibold mb-4 text-center">Enter OTP</h2>
                <input
                  type="text"
                  placeholder="123456"
                  className="border w-full px-3 py-2 rounded-md mb-4 text-center"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <button className="bg-black w-full text-white rounded-md py-2" onClick={verifyOtp}>
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
