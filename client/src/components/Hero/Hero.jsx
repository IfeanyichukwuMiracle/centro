import { Link } from "react-router-dom";
import "./hero.css";

const Hero = () => {
  return (
    <>
      <section className="hero">
        {/* <img src={heroImg} style={{ display: "block" }} alt="centro_mic" /> */}
        <section className="hero-text">
          <div className="hero-content">
            <p className="preheading">Clear Sounds</p>
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
