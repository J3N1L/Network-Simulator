/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enable dark mode support with the "class" strategy
  darkMode: ["class"],

  // Define the paths to all template files
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',  // Page components
    './components/**/*.{js,jsx,ts,tsx}',  // UI components
    './app/**/*.{js,jsx,ts,tsx}',  // Application structure
    './src/**/*.{js,jsx,ts,tsx}',  // Source files
  ],

  // Optionally add a prefix to avoid conflicts with other CSS libraries
  prefix: "",

  theme: {
    // Configure the container utility
    container: {
      center: true, // Center the container
      padding: "2rem", // Add padding to the container
      screens: {
        "2xl": "1400px", // Set a custom max width for the "2xl" breakpoint
      },
    },

    // Extend Tailwind's default theme
    extend: {
      // Add custom color palettes
      colors: {
        primary: {
          DEFAULT: "#4f46e5", // Base color
          light: "#6366f1", // Lighter shade
          dark: "#4338ca", // Darker shade
        },
        secondary: {
          DEFAULT: "#10b981", // Base color
          light: "#34d399", // Lighter shade
          dark: "#059669", // Darker shade
        },
        accent: {
          DEFAULT: "#f59e0b", // Base color
          light: "#fbbf24", // Lighter shade
          dark: "#d97706", // Darker shade
        },
      },

      // Add custom animations
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },

      // Add custom spacing, borders, and other utilities if needed
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      zIndex: {
        60: "60",
      },
    },
  },

  // Add plugins for additional utilities
  plugins: [
    require("tailwindcss-animate"), // Adds support for animation utilities
    require("@tailwindcss/forms"), // Adds better default styles for forms
    require("@tailwindcss/typography"), // Adds prose styling for rich text
    require("@tailwindcss/aspect-ratio"), // Adds utilities for aspect ratios
  ],
};
