const Contact = () => {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center pt-40 pb-16 font-main animate-fadeIn">

      {/* 🌟 TITLE */}
      <h1 className="text-4xl font-semibold mb-3 text-black">
        Contact
      </h1>

      <p className="text-lg text-gray-700 mb-10">
        You're welcome to contact us with any inquiry
      </p>

      {/* FORM CONTAINER */}
      <div className="w-[90%] max-w-3xl bg-white border border-gray-200 shadow-md rounded-lg p-10 text-black">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* FIRST NAME */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">First Name *</label>
            <input
              type="text"
              required
              className="border rounded-md px-3 py-2 focus:outline-none focus:border-black"
              placeholder="Enter first name"
            />
          </div>

          {/* LAST NAME */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Last Name (optional)</label>
            <input
              type="text"
              className="border rounded-md px-3 py-2 focus:outline-none focus:border-black"
              placeholder="Enter last name"
            />
          </div>

          {/* EMAIL */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Email</label>
            <input
              type="email"
              className="border rounded-md px-3 py-2 focus:outline-none focus:border-black"
              placeholder="Enter email"
            />
          </div>

          {/* PHONE + COUNTRY CODE */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Phone Number</label>

            <div className="flex gap-2">
              {/* Country Code */}
              <select className="border rounded-md px-3 py-2 focus:outline-none focus:border-black">
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+61">🇦🇺 +61</option>
                <option value="+81">🇯🇵 +81</option>
              </select>

              <input
                type="text"
                className="border rounded-md px-3 py-2 w-full focus:outline-none focus:border-black"
                placeholder="Enter phone number"
              />
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Either Email or Phone Number is required
            </p>
          </div>

          {/* MESSAGE (FULL WIDTH) */}
          <div className="flex flex-col md:col-span-2">
            <label className="font-medium mb-1">Message *</label>
            <textarea
              className="border rounded-md px-3 py-2 min-h-[120px] focus:outline-none focus:border-black"
              placeholder="Write your message..."
            ></textarea>
          </div>

        </div>

        {/* SUBMIT BUTTON — RIGHT SIDE */}
        <div className="flex justify-end mt-8">
          <button
            className="px-8 py-3 bg-black text-white rounded-md text-lg font-medium
                       hover:bg-white hover:text-black border border-black transition">
            Submit
          </button>
        </div>

      </div>

    </div>
  );
};

export default Contact;
