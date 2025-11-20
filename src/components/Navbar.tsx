import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "./firebase";
import { useState, useEffect } from "react";

const navLinks = ["Shop", "About", "Contact"];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [otpStage, setOtpStage] = useState<"options" | "phone" | "otp">("options");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);

  // ⭐ GOOGLE LOGIN INIT
  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: "125602396414-8opuvdanvo8eso6fise6smerckth0glh.apps.googleusercontent.com",
      callback: handleGoogleResponse,
    });
  }, []);

  // ⭐ RENDER GOOGLE BUTTON WHEN POPUP OPENS
  useEffect(() => {
    if (showLogin && otpStage === "options" && window.google) {
      const interval = setInterval(() => {
        const btn = document.getElementById("gsi-button");
        if (btn && btn.childElementCount === 0) {
          window.google.accounts.id.renderButton(btn, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "continue_with",
          });
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [showLogin, otpStage]);

  // ⭐ GOOGLE CALLBACK
  const handleGoogleResponse = (response: any) => {
    console.log("Google ID Token:", response.credential);
    alert("Google Login Success!");
    setShowLogin(false);
  };

  // ⭐ HAMBURGER TOGGLE
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

      const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmation(result);
      setOtpStage("otp");
    } catch (error) {
      console.log(error);
      alert("Failed to send OTP");
    }
  };

  // ⭐ VERIFY OTP
  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");
    try {
      // const data = await confirmation.confirm(otp);

      alert("OTP Verified!");
      setShowLogin(false);
      setOtp("");
      setPhone("");
      setOtpStage("options");
    } catch (error) {
      console.log(error);
      alert("Invalid OTP");
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <header className="w-full bg-[#F7F3E8] md:fixed md:top-0 md:left-0 md:right-0 md:z-40">
        <nav className="flex w-full items-center justify-between px-6 py-4">
          <div className="text-xl font-semibold tracking-wide">Clothify</div>

          <ul className="hidden md:flex gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link} className="cursor-pointer hover:text-gray-600 transition-colors">
                {link}
              </li>
            ))}
            <li>
              <button className="text-sm font-medium hover:text-gray-600" onClick={() => setShowLogin(true)}>
                Login / Signup
              </button>
            </li>
          </ul>

          {/* MOBILE HAMBURGER */}
          <button
            className="relative flex h-10 w-10 flex-col items-center justify-center gap-1 md:hidden"
            onClick={toggleMenu}
          >
            <span className={`h-0.5 w-6 bg-black transition-transform duration-300 ${isOpen ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`h-0.5 w-6 bg-black transition-all duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`h-0.5 w-6 bg-black transition-transform duration-300 ${isOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </button>
        </nav>
      </header>

      {/* MOBILE SIDE MENU */}
      <div
        className={`
          fixed inset-0 z-50 bg-[#F7F3E8] md:hidden
          transform transition-transform duration-300 ease-out
          h-screen w-full overflow-y-hidden
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-xl font-semibold tracking-wide">Clothify</div>

          <button onClick={toggleMenu} className="relative flex h-10 w-10 flex-col items-center justify-center gap-1">
            <span className="h-0.5 w-6 bg-black translate-y-1.5 rotate-45" />
            <span className="h-0.5 w-6 bg-black opacity-0" />
            <span className="h-0.5 w-6 bg-black -translate-y-1.5 -rotate-45" />
          </button>
        </div>

        <button
          onClick={() => {
            toggleMenu();
            setShowLogin(true);
          }}
          className="w-full border-b border-black/20 pb-4 text-left pl-5 text-xl font-medium"
        >
          Login / Signup
        </button>

        <div className="mt-10 flex flex-col gap-8 text-xl font-medium w-full px-2">
          {navLinks.map((link) => (
            <button key={link} className="w-full border-b border-black/20 pb-4" onClick={toggleMenu}>
              <div className="pl-5 text-left">{link}</div>
            </button>
          ))}
        </div>
      </div>

      {/* LOGIN POPUP */}
      {/* LOGIN POPUP */}
{showLogin && (
  <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center">
    <div className="bg-white w-[90%] max-w-sm rounded-lg p-6 shadow-lg relative">

      {/* CLOSE BUTTON */}
      <button
        className="absolute right-3 top-3 text-xl"
        onClick={() => {
          setShowLogin(false);
          setOtpStage("options");
          setPhone("");
          setOtp("");
        }}
      >
        ✖
      </button>

      {/* SCREEN 1: OTP + GOOGLE BELOW */}
      {otpStage === "options" && (
        <>
          <h2 className="text-xl font-semibold mb-6 text-center">Login / Signup</h2>

          {/* PHONE LOGIN FIRST */}
          <button
            className="w-full border border-gray-300 rounded-md py-2 text-sm font-medium hover:bg-gray-50 mb-5"
            onClick={() => setOtpStage("phone")}
          >
            Continue with Phone (OTP)
          </button>

          {/* ⭐ GOOGLE BUTTON (INSIDE CENTER, BELOW OTP) */}
          <div className="flex justify-center mt-2">
            <div id="gsi-button"></div>
          </div>
        </>
      )}

      {/* SCREEN 2: ENTER PHONE */}
      {otpStage === "phone" && (
        <>
          <h2 className="text-xl font-semibold mb-4 text-center">Enter Phone Number</h2>

          <input
            type="text"
            placeholder="+91 9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border px-3 py-2 rounded-md mb-4"
          />

          <div id="recaptcha-container"></div>

          <button className="w-full bg-black text-white rounded-md py-2" onClick={sendOtp}>
            Send OTP
          </button>

          {/* ⭐ GOOGLE BUTTON BELOW PHONE INPUT */}
          <div className="flex justify-center mt-5">
            <div id="gsi-button"></div>
          </div>
        </>
      )}

      {/* SCREEN 3: ENTER OTP */}
      {otpStage === "otp" && (
        <>
          <h2 className="text-xl font-semibold mb-4 text-center">Enter OTP</h2>

          <input
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border px-3 py-2 rounded-md mb-4 text-center tracking-widest"
          />

          <button className="w-full bg-black text-white rounded-md py-2" onClick={verifyOtp}>
            Verify OTP
          </button>

          {/* ⭐ GOOGLE BUTTON BELOW OTP also */}
          <div className="flex justify-center mt-5">
            <div id="gsi-button"></div>
          </div>
        </>
      )}

    </div>
  </div>
)}

    </>
  );
};

export default Navbar;
