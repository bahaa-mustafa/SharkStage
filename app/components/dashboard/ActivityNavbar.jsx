"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function ActivityNavbar() {
  const pathname = usePathname();

  const links = [
    { link: "posts", name: "Posts" },
    { link: "comments", name: "Comments" },
  ];
  return (
    <div className="flex border-b  border-b-black/50">
      {links.map((ele, i) => (
        <Link
          key={i}
          href={`/account/activity/${ele.link}`}
          className={`inline-block px-3 py-1 rounded-t-2xl border ${
            pathname == `/account/activity/${ele.link}`
              ? "bg-gradient-to-br from-primary to-secondary"
              : null
          }`}
        >
          {ele.name}
        </Link>
      ))}
    </div>
  );
}

export default ActivityNavbar;
