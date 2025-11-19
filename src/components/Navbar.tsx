import { useState } from "react";

const navLinks = ["Shop", "About", "Contact"];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
  setIsOpen(prev => {
    const newState = !prev;

    if (newState) {
      // When menu opens → lock body scrolling
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      // When menu closes → restore scroll
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    }

    return newState;
  });
};

  return (
    <>
      {/* NAVBAR */}
      <header className="w-full bg-[#F7F3E8] md:fixed md:top-0 md:left-0 md:right-0 md:z-40">
        <nav className="flex w-full items-center justify-between px-6 py-4">
          
          {/* LOGO */}
          <div className="text-xl font-semibold tracking-wide">
            Clothify
          </div>

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex gap-6 text-sm font-medium">
            {navLinks.map(link => (
              <li
                key={link}
                className="cursor-pointer hover:text-gray-600 transition-colors"
              >
                {link}
              </li>
            ))}
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

      {/* FULLSCREEN SLIDE MENU */}
     <div
        className={`
            fixed inset-0 z-50 bg-[#F7F3E8] md:hidden
            transform transition-transform duration-300 ease-out
            h-screen w-full overflow-y-hidden
            ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        >

        {/* TOP ROW INSIDE MENU */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-xl font-semibold tracking-wide">Clothify</div>
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

        {/* MENU LINKS */}
        <div className="mt-10 flex flex-col gap-8 text-xl font-medium w-full px-2">
            {navLinks.map(link => (
                <button
                key={link}
                className="w-full border-b border-black/20 pb-4"
                onClick={toggleMenu}
                >
                <div className="pl-5 text-left">
                    {link}
                </div>
                </button>
            ))}
            </div>

      </div>
      
    </>
  );
};

export default Navbar;
