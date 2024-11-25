'use client'
import { useEffect } from "react";

const InstagramWidget = () => {
  useEffect(() => {
    // Adaugă scriptul Elfsight
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    document.body.appendChild(script);

    // Elimină branding-ul după ce widget-ul s-a încărcat
    const removeBranding = () => {
      const elfsightBranding = document.querySelector("a[href*='elfsight']");
      if (elfsightBranding) {
        elfsightBranding.style.display = "none";
      }
    };

    // Asigură-te că branding-ul este eliminat periodic, în caz că este re-adăugat
    const intervalId = setInterval(removeBranding, 1000);

    return () => {
      clearInterval(intervalId);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className="elfsight-app-f21305b2-a3fe-4667-8642-78bd065b28a9 w-full lg:!w-[900px]"
      data-elfsight-app-lazy
    ></div>
  );
};

export default InstagramWidget;
