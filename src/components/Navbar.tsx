import { auth, RecaptchaVerifier } from "./firebase";
import { useEffect, useState } from "react";

const navLinks = ["Shop", "About", "Contact"];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [otpStage, setOtpStage] = useState<"options" | "phone" | "otp">("options");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // ⭐ LOAD GOOGLE SDK ONCE
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "125602396414-8opuvdanvo8eso6fise6smerckth0glh.apps.googleusercontent.com",
          callback: handleGoogleResponse,
        });
        setGoogleLoaded(true);
      }
    };

    document.body.appendChild(script);
  }, []);

  // ⭐ SHOW GOOGLE BUTTON ONLY WHEN:
  // modal open + googleLoaded + otpStage = options
  useEffect(() => {
    if (!showLogin) return;
    if (!googleLoaded) return;
    if (otpStage !== "options") return;

    const interval = setInterval(() => {
      const btn = document.getElementById("googleContainer");
      if (btn) {
        btn.innerHTML = ""; // wipe old button

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

  // ⭐ GOOGLE CALLBACK
  const handleGoogleResponse = (res: any) => {
    console.log("Google Token:", res.credential);
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

  // ⭐ MENU TOGGLE
  const toggleMenu = () => {
    const next = !isOpen;
    setIsOpen(next);
    document.body.style.overflow = next ? "hidden" : "auto";
  };

  // ⭐ SEND OTP
  const sendOtp = () => {
    if (!phone) return alert("Enter phone number");

    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });

    setOtpStage("otp");
  };

  // ⭐ VERIFY OTP
  const verifyOtp = () => {
    if (!otp) return alert("Enter OTP");
    alert("OTP Verified!");
    closeModal();
  };

  return (
    <>
      {/* NAVBAR */}
      <header className="w-full bg-[#F7F3E8] md:fixed md:z-40">
        <nav className="flex justify-between items-center px-6 py-4">
          <div className="text-xl font-semibold">Clothify</div>

          <ul className="hidden md:flex gap-6 text-sm">
            {navLinks.map((l) => (
              <li key={l} className="cursor-pointer hover:text-gray-600">
                {l}
              </li>
            ))}
            <li>
              <button onClick={() => setShowLogin(true)} className="hover:text-gray-600">
                Login / Signup
              </button>
            </li>
          </ul>

          {/* MOBILE BURGER */}
          <button className="md:hidden flex flex-col gap-1 h-10 w-10" onClick={toggleMenu}>
            <span className="h-0.5 w-6 bg-black" />
            <span className="h-0.5 w-6 bg-black" />
            <span className="h-0.5 w-6 bg-black" />
          </button>
        </nav>
      </header>

      {/* LOGIN POPUP */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
          <div className="bg-white w-[90%] max-w-sm rounded-lg p-6 relative">

            {/* CLOSE */}
            <button className="absolute right-3 top-3 text-xl" onClick={closeModal}>
              ✖
            </button>

            {/* ⭐ GOOGLE BUTTON RESERVED SPACE (NO SHAKING) */}
            <div className="flex justify-center mb-6">
              <div
                id="googleContainer"
                style={{
                  height: "45px",
                  width: "250px",
                  display: otpStage === "options" ? "flex" : "none",
                }}
              ></div>
            </div>

            {/* OPTIONS */}
            {otpStage === "options" && (
              <>
                <button
                  className="w-full border rounded-md py-2 hover:bg-gray-50"
                  onClick={() => setOtpStage("phone")}
                >
                  Continue with Phone (OTP)
                </button>
              </>
            )}

            {/* PHONE */}
            {otpStage === "phone" && (
              <>
                <h2 className="text-lg font-semibold mb-4 text-center">Enter Phone Number</h2>
                <input
                  className="border w-full px-3 py-2 rounded-md mb-4"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <div id="recaptcha-container"></div>
                <button className="w-full bg-black text-white py-2 rounded-md" onClick={sendOtp}>
                  Send OTP
                </button>
              </>
            )}

            {/* OTP */}
            {otpStage === "otp" && (
              <>
                <h2 className="text-lg font-semibold mb-4 text-center">Enter OTP</h2>
                <input
                  className="border w-full px-3 py-2 rounded-md mb-4 text-center"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button className="w-full bg-black text-white py-2 rounded-md" onClick={verifyOtp}>
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
