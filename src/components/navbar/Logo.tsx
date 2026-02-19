import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <div className="h-8">
      <Link href="/">
        <Image
          src="/logo.webp"
          alt="TUNREPLAY Logo"
          width={100}
          height={30}
          className="h-full w-auto"
          quality={100}
          priority
        />
      </Link>
    </div>
  );
} 