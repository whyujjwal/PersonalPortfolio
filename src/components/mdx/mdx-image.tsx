import Image from "next/image";

export function MdxImage({
  src,
  alt = "",
  title,
  width = 800,
  height = 450,
}: {
  src?: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
}) {
  if (!src) return null;
  return (
    <figure className="mdx-figure">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="mdx-img"
        sizes="(max-width: 720px) 100vw, 720px"
      />
      {title && <figcaption className="mdx-caption">{title}</figcaption>}
    </figure>
  );
}
