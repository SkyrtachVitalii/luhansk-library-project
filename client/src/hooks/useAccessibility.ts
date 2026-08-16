"use client"

import { useState, useEffect } from "react"

const FONT_SIZE_STEP = 10; // 10%
const MIN_FONT_SIZE = 60; // 60%
const MAX_FONT_SIZE = 200; // 200%

export function useAccessibility() {
  const [fontSizePercent, setFontSizePercent] = useState(100);
  const [isGrayscale, setIsGrayscale] = useState(false);

  useEffect(() => {
    // Load from local storage on mount
    const storedFontSize = localStorage.getItem("a11y-font-size");
    if (storedFontSize) {
      setFontSizePercent(parseInt(storedFontSize, 10));
    }
    const storedGrayscale = localStorage.getItem("a11y-grayscale");
    if (storedGrayscale === "true") {
      setIsGrayscale(true);
    }
  }, []);

  useEffect(() => {
    // Apply font size to html
    document.documentElement.style.fontSize = `${fontSizePercent}%`;
    localStorage.setItem("a11y-font-size", fontSizePercent.toString());
  }, [fontSizePercent]);

  useEffect(() => {
    // Apply grayscale to body
    if (isGrayscale) {
      document.body.classList.add("theme-grayscale");
    } else {
      document.body.classList.remove("theme-grayscale");
    }
    localStorage.setItem("a11y-grayscale", isGrayscale.toString());
  }, [isGrayscale]);

  const increaseFontSize = () => {
    setFontSizePercent((prev) => Math.min(prev + FONT_SIZE_STEP, MAX_FONT_SIZE));
  };

  const decreaseFontSize = () => {
    setFontSizePercent((prev) => Math.max(prev - FONT_SIZE_STEP, MIN_FONT_SIZE));
  };

  const toggleGrayscale = () => {
    setIsGrayscale((prev) => !prev);
  };

  const resetAccessibility = () => {
    setFontSizePercent(100);
    setIsGrayscale(false);
  };

  return {
    fontSizePercent,
    isGrayscale,
    increaseFontSize,
    decreaseFontSize,
    toggleGrayscale,
    resetAccessibility,
  };
}
