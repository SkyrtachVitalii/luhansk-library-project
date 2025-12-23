"use client";

import React, { useMemo } from "react";
import parse, { DOMNode, Element } from "html-react-parser";
import { IPost } from "@/types";
import OldCarousel from "../OldCarousel/OldCarousel";
import styles from "./SingleOldPost.module.scss";
import { fixLegacyContent } from "@/utils/fixLegacyContent";

interface SingleOldPostProps {
  post: IPost;
}

// 1. Підготовка контенту (без змін)
const prepareContent = (html: string) => {
  if (!html) return "";
  let clean = html;

  clean = clean.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
  clean = clean.replace(/<div id="disqus_recommendations"[\s\S]*?<\/div>/gim, "");
  clean = clean.replace(/<div id="disqus_thread"[\s\S]*?<\/div>/gim, "");
  clean = clean.replace(/<noscript>[\s\S]*?<\/noscript>/gim, "");

  clean = fixLegacyContent(clean);

  return clean;
};

// 2. Пошук картинок (без змін)
const extractImagesFromNode = (node: DOMNode): string[] => {
  const images: string[] = [];

  const traverse = (currentNode: DOMNode) => {
    if (currentNode instanceof Element) {
      if (currentNode.name === "img" && currentNode.attribs && currentNode.attribs.src) {
        images.push(currentNode.attribs.src);
      }
      if (currentNode.children && currentNode.children.length > 0) {
        currentNode.children.forEach((child) => {
          traverse(child as unknown as DOMNode);
        });
      }
    }
  };

  traverse(node);
  return images;
};

// 3. Компонент
const SingleOldPost: React.FC<SingleOldPostProps> = ({ post }) => {
  
  const sanitizedContent = useMemo(() => {
    return prepareContent(post.content);
  }, [post.content]);

  const parseOptions = {
    replace: (domNode: DOMNode) => {
      if (!(domNode instanceof Element)) return;

      let images: string[] = [];
      let shouldReplace = false;

      // --- ЛОГІКА ВИЗНАЧЕННЯ СЛАЙДЕРА ---
      
      // 1. Збираємо весь прямий текст вузла, щоб знайти маркери "carousel|"
      // Це працюватиме і для <p>, і для <div>
      const directText = domNode.children
        .filter((child) => child.type === "text")
        .map((child) => (child as { data: string }).data)
        .join("");

      // ВАРІАНТ А: Пайп-слайдер (carousel|...|carousel)
      // Дозволяємо і <p>, і <div> (це виправить вашу проблему)
      if ((domNode.name === "p" || domNode.name === "div") && directText.includes("carousel|")) {
        shouldReplace = true;
      }

      // ВАРІАНТ Б: Bootstrap слайдер (class="carousel ...")
      // Перевіряємо тільки для div
      if (domNode.name === "div" && domNode.attribs?.class?.includes("carousel")) {
        shouldReplace = true;
      }

      // --- ЗАМІНА ---
      if (shouldReplace) {
        images = extractImagesFromNode(domNode);

        if (images.length > 0) {
          return <OldCarousel images={images} />;
        }
        return null; 
      }
      
      // Звичайні картинки не чіпаємо, парсер їх відрендерить сам
    },
  };

  return (
    <article className={styles.container}>
      <header>
        <h1 className={styles.title}>{post.title}</h1>
        </header>
      <div className={styles.content}>
        {parse(sanitizedContent, parseOptions)}
      </div>
    </article>
  );
};

export default SingleOldPost;