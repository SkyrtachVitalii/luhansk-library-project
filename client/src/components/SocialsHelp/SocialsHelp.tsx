'use client';

import Link from "next/link";
import Image from "next/image";
import styles from "./SocialsHelp.module.scss";
import { useState } from "react";

import { socialHelpLinks } from "@/config/menus";

const SocialsHelp = () => {
    const [hoveredLinkId, setHoveredLinkId] = useState<string | null>(null);
  return (
    <>
    <div className={styles.socialsHelp__heading}>Онлайн-підтримка:</div>
    <nav className={styles.socialsHelp}>
      {socialHelpLinks.map((link) => (
        <Link key={link.id} href={link.href} target="_blank"
        onMouseEnter={() => setHoveredLinkId(link.id)}
        onMouseLeave={() => setHoveredLinkId(null)}
        >
          <Image
            className={styles.socialsHelp__linkImg}
            src={hoveredLinkId === link.id ? link.hoverIcon : link.icon}
            width={24}
            height={24}
            alt={link.name}
          />
        </Link>
      ))}
    </nav>
    </>
  );
};

export default SocialsHelp;