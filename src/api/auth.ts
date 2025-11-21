    import axios from "axios";

    const API = axios.create({
      baseURL: "http://localhost:5000/api",
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