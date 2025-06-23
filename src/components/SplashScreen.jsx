import { useEffect, useState } from "react";
import logo from "../assets/logo_sdn_gadungan02.png";

const SplashScreen = ({ onComplete }) => {
  const fullLine1 = "Selamat Datang di Website Resmi";
  const fullLine2 = "SDN Gadungan 02";

  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [typingLine, setTypingLine] = useState(1); // 1 = line1, 2 = line2

  useEffect(() => {
    let index = 0;
    const interval1 = setInterval(() => {
      setLine1(fullLine1.substring(0, index));
      index++;

      if (index > fullLine1.length) {
        clearInterval(interval1);
        setTypingLine(2); // Pindah ke baris kedua

        let index2 = 0;
        const interval2 = setInterval(() => {
          setLine2(fullLine2.substring(0, index2));
          index2++;

          if (index2 > fullLine2.length) {
            clearInterval(interval2);
            setTimeout(() => {
              onComplete();
            }, 1000);
          }
        }, 70);
      }
    }, 70);

    return () => clearInterval(interval1);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-green-600 via-green-200 to-green-800 text-black flex flex-col items-center justify-center p-4">
      <img
        src={logo}
        alt="Logo SDN Gadungan 02"
        className="h-48 sm:h-56 w-auto mb-6 drop-shadow-md"
      />

      <div className="mb-6 text-xl sm:text-2xl md:text-3xl font-mono font-bold text-center leading-relaxed tracking-wide">
        <div>
          {line1}
          {typingLine === 1 && <span className="animate-blink ml-1">|</span>}
        </div>
        <div>
          {line2}
          {typingLine === 2 && <span className="animate-blink ml-1">|</span>}
        </div>
      </div>

      <div className="w-[220px] h-[4px] bg-gray-300 rounded overflow-hidden shadow-inner">
        <div className="w-[40%] h-full bg-yellow-400 animate-loading-bar"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
