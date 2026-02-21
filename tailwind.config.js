module.exports = {
  content: ["/app.vue"],
  plugins: [require("@formkit/themes/tailwindcss")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary), <alpha-value>)",
        secondary: "rgb(var(--color-secondary), <alpha-value>)",
        success: "rgb(var(--color-success), <alpha-value>)",
        info: "rgb(var(--color-info), <alpha-value>)",
        warning: "rgb(var(--color-warning), <alpha-value>)",
        danger: "rgb(var(--color-danger), <alpha-value>)",
        // Monochrome grayscale palette
        mono: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
          950: "#09090b",
        },
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        xs: ["0.6875rem", { lineHeight: "1rem" }],
        sm: ["0.75rem", { lineHeight: "1.125rem" }],
        base: ["0.8125rem", { lineHeight: "1.25rem" }],
        lg: ["0.875rem", { lineHeight: "1.375rem" }],
        xl: ["1rem", { lineHeight: "1.5rem" }],
      },
      spacing: {
        0.5: "0.125rem",
        1.5: "0.375rem",
        2.5: "0.625rem",
        3.5: "0.875rem",
      },
      borderRadius: {
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
      },
    },
  },
};
