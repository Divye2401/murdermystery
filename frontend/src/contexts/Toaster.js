import { Toaster } from "react-hot-toast";

export default function ToasterComponent() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 8000,
        style: {
          background: "var(--cream)", // Dark gray
          color: "black", // Light gray text
          border: "1px solid var(--cream)", // Border
          borderRadius: "12px",
          fontFamily: "var(--font-sans)",
        },
        success: {
          style: {
            background: "var(--cream)", // Dark green
            color: "#d1fae5", // Light green text
            border: "1px solid var(--cream)",
          },
        },
        error: {
          style: {
            background: "var(--cream)", // Dark red
            color: "#fecaca", // Light red text
            border: "1px solid var(--cream)",
          },
        },
      }}
    />
  );
}
