"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Socials.module.scss";
import { useState } from "react";

import { socialLinks } from "@/config/menus";

const Socials = () => {
  const [hoveredLinkId, setHoveredLinkId] = useState<string | null>(null);
  return (
    <nav className={styles.socials}>
      {socialLinks.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          target="_blank"
          onMouseEnter={() => setHoveredLinkId(link.id)}
          onMouseLeave={() => setHoveredLinkId(null)}
        >
          <Image
            className={styles.socials__linkImg}
            src={hoveredLinkId === link.id ? link.hoverIcon : link.icon}
            width={24}
            height={24}
            alt={link.name}
          />
        </Link>
      ))}
    </nav>
  );
};

export default Socials;
