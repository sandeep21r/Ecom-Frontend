    import axios from "axios";

    const API = axios.create({
      baseURL: "https://ecom-backend-9qo4.onrender.com/api",
    });


    // POST: Google Login
    export const loginWithGoogle = async (idToken: string) => {
      const res = await API.post("/auth/google", { idToken });
      return res.data; // contains { token, user }
    };

    // POST: OTP Login
    export const loginWithOtp = async (phone: string) => {
      const res = await API.post("/auth/otp", { phone });
      
      return res.data; // contains { token, user }
    };