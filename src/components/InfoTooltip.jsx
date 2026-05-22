import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

/**
 * Hover/click tooltip — used to define jargon inline.
 *
 * Usage:
 *   <InfoTooltip content="Plain-language explanation here" />
 *   <InfoTooltip content="..." iconSize={14}>Inline label</InfoTooltip>
 */
const InfoTooltip = ({ content, children, iconSize = 11, side = 'top', width = 'w-56' }) => {
  const [show, setShow] = useState(false);
  const timer = useRef(null);

  // Slight delay on hover-out so users can move the mouse to the tooltip
  const open  = () => { clearTimeout(timer.current); setShow(true); };
  const close = () => { timer.current = setTimeout(() => setShow(false), 100); };

  useEffect(() => () => clearTimeout(timer.current), []);

  const sidePos = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    right:  'left-full top-1/2 -translate-y-1/2 ml-2',
    left:   'right-full top-1/2 -translate-y-1/2 mr-2',
  }[side] || 'bottom-full left-1/2 -translate-x-1/2 mb-2';

  return (
    <span
      className="relative inline-flex items-center gap-1"
      onMouseEnter={open}
      onMouseLeave={close}
    >
      {children}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setShow((s) => !s); }}
        className="inline-flex items-center justify-center text-gray-500 hover:text-accent transition-colors flex-shrink-0"
        aria-label="More info"
      >
        <Info size={iconSize} />
      </button>
      {show && (
        <span
          className={`absolute z-50 ${sidePos} ${width} px-3 py-2 text-xs text-gray-200 bg-gray-900 border border-gray-700 rounded-lg shadow-xl normal-case leading-relaxed pointer-events-auto`}
          onMouseEnter={open}
          onMouseLeave={close}
        >
          {content}
        </span>
      )}
    </span>
  );
};

export default InfoTooltip;
