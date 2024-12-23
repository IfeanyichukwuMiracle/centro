import { Link } from "react-router-dom";
import "./hero.css";

const Hero = () => {
  return (
    <>
      <section className="hero">
        <section className="hero-text">
          <div className="hero-content">
            <p
              className="preheading"
              style={{ color: "white", fontWeight: "300" }}
            >
              CLEAR SOUNDS
            </p>
            <p className="hero-heading">Audio Gears You Can Trust</p>
            <Link to={`/category/all_products`}>
              <button type="button" id="hero-btn">
                Shop now!
              </button>
            </Link>
          </div>
        </section>
      </section>
    </>
  );
};

export default Hero;
