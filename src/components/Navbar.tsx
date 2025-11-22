import { auth } from "./firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useEffect, useState } from "react";
import { loginWithGoogle, loginWithOtp } from "../api/auth";
import { useNavigate, useLocation } from "react-router-dom";


const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [otpStage, setOtpStage] = useState<"options" | "phone" | "otp">("options");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [fade, setFade] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const defaultLinks = ["Shop", "Category", "About", "Contact"];
  const adminLinks = userRole === "admin" ? ["Admin"] : [];
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  const navLinks = [...defaultLinks, ...adminLinks];
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (token) {
      setIsAuthenticated(true)
      setUserRole(role);
    };
  }, []);

  // ---------------- GOOGLE SCRIPT ----------------
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
          auto_select: false
        });
        setGoogleLoaded(true);
      }
    };

    document.body.appendChild(script);
  }, []);

  // ---------------- GOOGLE BUTTON RENDER ----------------
  useEffect(() => {
    if (!showLogin || !googleLoaded || otpStage !== "options") return;

    const interval = setInterval(() => {
      const btn = document.getElementById("googleContainer");
      if (btn) {
        btn.innerHTML = "";
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

  const doOtpLogin = async (phone: string) => {
    const res = await loginWithOtp(phone);
    localStorage.setItem("authToken", res.token);
    localStorage.setItem("userRole", res.user.role);
  setUserRole(res.user.role); 
    setIsAuthenticated(true);
      setJustLoggedIn(true);  // ⭐️ Prevent auto nav jump
      window.location.reload();


  };

  const doGoogleLogin = async (idToken: string) => {
    const res = await loginWithGoogle(idToken);
    localStorage.setItem("authToken", res.token);
    localStorage.setItem("userRole", res.user.role);
    setUserRole(res.user.role); 
    setIsAuthenticated(true);
      setJustLoggedIn(true);  // ⭐️ Prevent auto nav jump
      window.location.reload();


  };

  const handleGoogleResponse = async (res: any) => {
    setGoogleLoading(true); // ⬅️ START LOADING

    try {
      await doGoogleLogin(res.credential);
      alert("Google Login Success!");
      closeModal();
    } catch (error) {
      alert("Google login failed");
    } finally {
      setGoogleLoading(false); // ⬅️ STOP LOADING
    }
  };

  const closeModal = () => {
    setShowLogin(false);
    setOtpStage("options");
    setPhone("");
    setOtp("");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = !isOpen ? "hidden" : "auto";
  };

  const handleLogout = () => {

    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");  
    setIsAuthenticated(false);
    setUserRole(null);    
    navigate("/");
            
  };

  // ---------------- OTP SEND ----------------
  const sendOtp = async () => {
    if (!phone) return alert("Enter phone number");

    try {
      setLoadingOtp(true);

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
        });
        await window.recaptchaVerifier.render();
      }

      const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      window.confirmationResult = result;
      setOtpStage("otp");
    } catch (err) {
      alert("Failed to send OTP");
    } finally {
      setLoadingOtp(false);
    }
  };

  // ---------------- OTP VERIFY ----------------
  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");

    try {
      setVerifyingOtp(true); // ⬅️ START LOADING

      await window.confirmationResult.confirm(otp);
      await doOtpLogin(phone);

      alert("OTP Verified!");
      closeModal();
    } catch {
      alert("Invalid OTP");
    } finally {
      setVerifyingOtp(false); // ⬅️ STOP LOADING
    }
  };


  // ---------------- ABOUT SCROLL ----------------
  const smoothAboutScroll = () => {
    document.body.style.overflow = "auto";
    document.getElementById("about-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // ---------------- FIXED NAV CLICK HANDLER ----------------
  const handleNavClick = async (label: string) => {
     if (justLoggedIn) {
    setJustLoggedIn(false);
    return;
  }
    // ALWAYS close hamburger when clicking an option
    setIsOpen(false);
    document.body.style.overflow = "auto";

    if (label === "About") {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(smoothAboutScroll, 350);
      } else {
        smoothAboutScroll();
      }
      return;
    }

    if (label === "Contact") {
      setFade(true);
      setTimeout(() => {
        navigate("/contact");
        setFade(false);
      }, 300);
      return;
    }

    if (label === "Shop") alert("Shop coming soon!");
    if (label === "Category") alert("Category coming soon!");

    if (label === "Admin") {
      navigate("/admin");
      return;
    }
  };

  return (
    <>
      {/* PAGE FADE WRAPPER */}
      <div className={`${fade ? "opacity-0 transition-opacity duration-300" : "opacity-100"}`}>

        <header className="w-full bg-white md:fixed md:z-40 top-0 left-0 right-0">
          <nav className="flex justify-between items-center px-6 py-10">

            <div className="text-3xl font-semibold leading-none">Clothify</div>

            <ul className="hidden md:flex justify-center gap-10 text-2xl font-medium">
              {navLinks.map((l) => (
                <li
                  key={l}
                  className="cursor-pointer hover:text-gray-400"
                  onClick={() => handleNavClick(l)}
                >
                  {l}
                </li>
              ))}
            </ul>

            <div className="hidden md:flex justify-end">
              {!isAuthenticated ? (
                <button className="hover:text-gray-400 text-xl" onClick={() => setShowLogin(true)}>
                  Log In
                </button>
              ) : (
                <button className="hover:text-gray-400 text-xl" onClick={handleLogout}>
                  Logout
                </button>
              )}
            </div>

            {/* HAMBURGER */}
            <button
              onClick={toggleMenu}
              className="md:hidden relative flex h-10 w-10 flex-col items-center justify-center gap-1"
            >
              <span className={`h-0.5 w-6 bg-black transition ${isOpen ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`h-0.5 w-6 bg-black transition ${isOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`h-0.5 w-6 bg-black transition ${isOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </button>

          </nav>
        </header>

      </div>

      {/* ---------------- MOBILE MENU ---------------- */}
      {isOpen && (
        <div className="fixed inset-0 bg-white z-50 md:hidden transition-transform">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="text-2xl font-semibold">Clothify</div>

            <button
              onClick={toggleMenu}
              className="relative flex h-10 w-10 flex-col items-center justify-center gap-1"
            >
              <span className="h-0.5 w-6 bg-black translate-y-1.5 rotate-45" />
              <span className="h-0.5 w-6 bg-black opacity-0" />
              <span className="h-0.5 w-6 bg-black -translate-y-1.5 -rotate-45" />
            </button>
          </div>

          <button
            onClick={() => {
              if (isAuthenticated) handleLogout();
              else setShowLogin(true);
              toggleMenu();
            }}
            className="w-full border-b border-black/20 pb-4 pl-7 text-left text-xl"
          >
            {isAuthenticated ? "Logout" : "Log In"}
          </button>

          <div className="mt-10 flex flex-col gap-8 text-xl px-2">
            {navLinks.map((l) => (
              <button
                key={l}
                onClick={() => handleNavClick(l)}
                className="w-full border-b border-black/20 pb-4 text-left pl-5"
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* LOGIN POPUP */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex justify-center items-center">
          <div className="bg-white w-[90%] max-w-sm rounded-lg p-6 relative">
            <button className="absolute right-3 top-3 text-xl" onClick={closeModal}>✖</button>

            {otpStage === "options" && (
              <>
                <h2 className="text-3xl font-semibold mb-4 text-center">Log In</h2>

                <button
                  onClick={() => setOtpStage("phone")}
                  className="w-full border rounded-md py-2 hover:bg-gray-50 mb-4"
                >
                  Continue with Phone (OTP)
                </button>

                <div className="flex justify-center">
                  {googleLoading ? (
                    <div className="text-center text-gray-600 text-lg py-2">
                      Please wait...
                    </div>
                  ) : (
                    <div
                      id="googleContainer"
                      style={{ height: "45px", width: "250px" }}
                    ></div>
                  )}
                </div>
              </>
            )}

            {otpStage === "phone" && (
              <>
                <h2 className="text-lg font-semibold mb-4 text-center">Enter Phone Number</h2>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 mb-4"
                  placeholder="+91 9876543210"
                />
                <button
                  onClick={sendOtp}
                  disabled={loadingOtp}
                  className="w-full bg-black text-white rounded-md py-2 disabled:opacity-60"
                >
                  {loadingOtp ? "Sending..." : "Send OTP"}
                </button>
              </>
            )}

            {otpStage === "otp" && (
              <>
                <h2 className="text-lg font-semibold mb-4 text-center">Enter OTP</h2>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 mb-4 text-center"
                  placeholder="123456"
                />
                <button
                  onClick={verifyOtp}
                  disabled={verifyingOtp}
                  className="w-full bg-black text-white rounded-md py-2 disabled:opacity-60"
                >
                  {verifyingOtp ? "Verifying..." : "Verify OTP"}
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
