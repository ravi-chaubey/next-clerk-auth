import Link from "next/link";
import Logout from "@/components/logout";
export default function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/dashboard">Dashboard</Link></li>
          <li><Logout /></li>
        </ul>
      </nav>
    </header>
  );
}
