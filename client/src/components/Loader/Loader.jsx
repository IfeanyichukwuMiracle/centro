import { MoonLoader } from "react-spinners";

const Loader = ({ isLoading, size, margin }) => {
  return (
    <MoonLoader
      color={`black`}
      loading={isLoading}
      cssOverride={{
        display: "block",
        margin: margin ? `${margin}rem auto` : "10rem auto",
        borderColor: "black",
      }}
      size={size || 50}
    />
  );
};

export default Loader;
