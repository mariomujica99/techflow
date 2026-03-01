import React, { useEffect, useState } from "react"

const AvatarTooltip = ({ name, children }) => {
  const [visible, setVisible] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setVisible(false);
      }
    };
    if (visible) {
      document.addEventListener('mousedown', handleOutside);
      document.addEventListener('touchstart', handleOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [visible]);

  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => !isTouchDevice && setVisible(true)}
      onMouseLeave={() => !isTouchDevice && setVisible(false)}
      onTouchStart={(e) => { e.preventDefault(); setVisible(v => !v); }}
    >
      {children}
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-xs rounded-md whitespace-nowrap z-50 pointer-events-none shadow-md">
          {name}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-700" />
        </div>
      )}
    </div>
  );
};

export default AvatarTooltip;