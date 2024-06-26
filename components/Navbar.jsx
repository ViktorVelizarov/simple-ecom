
import Link from "next/link";

export default function Navbar() {
    return (
      <nav className="flex justify-between items-center bg-slate-800 px-14 py-3">
        <Link className="text-white font-bold" href={"/"}>
          SneakerHeaven
        </Link>

        <Link className="text-white font-bold" href={"/cart"}>
          Cart
        </Link>
      </nav>
    );
  }
  