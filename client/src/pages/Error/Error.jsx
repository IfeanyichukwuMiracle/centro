import { useEffect } from "react";
import "./error.css";

const Error = () => {
  useEffect(() => {
    document.title = "Centro | 404 - Not Found";
  }, []);
  return (
    <section className="error-section">
      <p>Route doesn&apos;t exist</p>
      <a href="/">Go home</a>
    </section>
  );
};

export default Error;
