import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function ScrollToTopButton({ darkMode }: { darkMode: boolean }) {
  const [visible, setVisible] = useState(false);
  const [hideForFooter, setHideForFooter] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);

      const footer = document.getElementById("site-footer");
      if (!footer) return;

      const footerTop = footer.getBoundingClientRect().top;
      setHideForFooter(footerTop < window.innerHeight);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible || hideForFooter) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`
        fixed bottom-6 right-6 z-40
        p-3 rounded-full shadow-md
        ${
          darkMode
            ? "bg-white text-black hover:bg-[#e5e5e5]"
            : "bg-black text-white hover:bg-[#222]"
        }
      `}
    >
      <FaArrowUp />
    </button>
  );
}
