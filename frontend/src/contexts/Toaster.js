import { Toaster } from "react-hot-toast";

export default function ToasterComponent() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 8000,
        style: {
          background: "#1f2937", // Dark gray
          color: "#f3f4f6", // Light gray text
          border: "1px solid #374151", // Border
          borderRadius: "12px",
          fontFamily: "var(--font-sans)",
        },
        success: {
          style: {
            background: "#065f46", // Dark green
            color: "#d1fae5", // Light green text
            border: "1px solid #047857",
          },
        },
        error: {
          style: {
            background: "#7f1d1d", // Dark red
            color: "#fecaca", // Light red text
            border: "1px solid #991b1b",
          },
        },
      }}
    />
  );
}
