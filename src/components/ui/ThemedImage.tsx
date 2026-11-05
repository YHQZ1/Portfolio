interface ThemedImageProps {
  light: string;
  dark?: string;
  alt: string;
  className?: string;
}

const layer = "absolute inset-0 h-full w-full object-contain";

export default function ThemedImage({
  light,
  dark,
  alt,
  className = "",
}: ThemedImageProps) {
  if (!dark || dark === light) {
    return (
      <img
        src={light}
        alt={alt}
        className={`${className} object-contain`}
        draggable={false}
      />
    );
  }

  return (
    <span className={`relative inline-block shrink-0 ${className}`}>
      <img
        src={light}
        alt={alt}
        className={`${layer} dark:opacity-0`}
        draggable={false}
      />
      <img
        src={dark}
        alt=""
        aria-hidden="true"
        className={`${layer} opacity-0 dark:opacity-100`}
        draggable={false}
      />
    </span>
  );
}
