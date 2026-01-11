// src/components/NavButton.jsx
/**
 * NavButton - Simple button component for navigation
 * Works with state-based routing in App.jsx
 */

export default function NavButton({ to, onClick, children, className = '', ...props }) {
  return (
    <button
      onClick={() => {
        if (onClick) onClick(to);
      }}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}
