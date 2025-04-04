"use client";

function LogoText() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" width="120" viewBox="0 0 130.51 24.238">
      <text xmlSpace="preserve" x="-26.765" y="348.928" fill="#ffffff" strokeWidth="2.072" fontFamily="Satoshi" fontSize="24.86" fontWeight="900" transform="translate(45.505 -330.66)">
        <tspan x="-26.765" y="348.928" fontWeight="bold" className="font-custom">
          Filmetryx
        </tspan>
      </text>
      <path
        fill="#82c4ff"
        d="M.003 12.16c.058-.1.323-.456 4.866-6.544C6.366 3.61 7.713 1.8 7.862 1.595 8.236 1.08 8.773.594 9.19.392c.736-.355.943-.375 3.942-.376 1.55 0 2.819.02 2.819.044 0 .055-1.119 1.566-6.373 8.614-1.087 1.458-2.056 2.685-2.23 2.822a5 5 0 0 1-.807.479l-.502.237-3.046.022c-2.486.018-3.037.005-2.991-.074"
      ></path>
      <path
        fill="#82c4ff"
        d="M7.661 17.26c-.002-2.514.028-4.41.074-4.735.203-1.44 1.32-2.612 2.725-2.861.51-.09 6.043-.134 6.043-.048 0 .035-.262.416-.583.847a3144 3144 0 0 0-6.666 9c-1.063 1.445-1.485 1.99-1.537 1.99-.03 0-.054-1.887-.056-4.193"
      ></path>
    </svg>
  );
}

export default function Footer() {
    const handleLogoClick = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  
    return (
      <div className="relative overflow-hidden min-h-[100px] md:min-h-[240px]">
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-30px] sm:bottom-[-40px] md:bottom-[-60px] lg:bottom-[-80px] xl:bottom-[-90px]">
          <div
            className="transform opacity-5 select-none cursor-pointer origin-bottom scale-[4] sm:scale-[5] md:scale-[7] lg:scale-[9] xl:scale-[11]"
            onClick={handleLogoClick}
          >
            <LogoText />
          </div>
        </div>
      </div>
    );
  }
  