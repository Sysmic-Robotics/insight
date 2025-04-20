import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Howl } from "howler";

export const Splash: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    // Step 1: show logo after slight delay
    const logoTimer = setTimeout(() => {
      setShowLogo(true);

      // Play intro sound
      const sound = new Howl({
        src: ["/sounds/intro.mp3"],
        volume: 1.0,
      });
      
      sound.play();
    }, 200);

    // Step 2: hide splash after full cycle
    const splashTimer = setTimeout(() => {
      setVisible(false);
    }, 1500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(splashTimer);
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#000",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          {showLogo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              style={{
                fontSize: "3rem",
                fontWeight: "bold",
                color: "transparent",
                backgroundImage:
                  "linear-gradient(120deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.1) 100%)",
                backgroundSize: "200% auto",
                backgroundPosition: "200% center",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                userSelect: "none",
                animation: "shimmer 1.5s ease-in-out forwards",
              }}
            >
              CondorSSL
              <style>
                {`
                @keyframes shimmer {
                  0% {
                    background-position: 200% center;
                  }
                  100% {
                    background-position: -200% center;
                  }
                }
                `}
              </style>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
