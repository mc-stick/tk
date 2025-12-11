// ImgCustoms.jsx
const ImgCustoms = ({
  src,
  alt = "",
  width = "auto",
  height = "auto",
  objectFit = "contain",
  borderRadius = "0px",
  className = "",
  style = {},
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        width,
        height,
        objectFit,
        borderRadius,
        display: "block",
        ...style,
      }}
    />
  );
};

export default ImgCustoms;
