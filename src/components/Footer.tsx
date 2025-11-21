const Footer = () => {
    return (
        <footer className="w-full bg-black text-white py-10 px-1">
            <div className="w-full bg-black text-white px-4 md:px-50 py-10">

                {/* GRID: 1 column on mobile, 2 columns on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">

                    {/* LEFT — CONTACT */}
                    <div className="space-y-3">
                        <p className="font-semibold text-lg">Contact</p>
                        <p>Phone: +91 98765 43210</p>
                        <p>Email: clothify@gmail.com</p>
                    </div>

                    {/* RIGHT — FOLLOW */}
                    <div className="space-y-3 md:text-right">
                        <p className="font-semibold text-lg">Follow</p>

                        <p className="flex md:justify-end gap-2 hover:text-gray-400">
                            <span>Instagram:</span>
                            <a href="#" className="underline">@clothify_insta</a>
                        </p>

                        <p className="flex md:justify-end gap-2 hover:text-gray-400">
                            <span>Facebook:</span>
                            <a href="#" className="underline">@clothify_fb</a>
                        </p>
                    </div>

                </div>

            </div>


        </footer>
    );
};

export default Footer;
