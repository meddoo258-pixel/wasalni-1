import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useOpenGraph } from "./useOpenGraph";

describe("useOpenGraph Hook", () => {
  beforeEach(() => {
    // Clear all meta tags before each test
    document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]').forEach(tag => tag.remove());
    document.querySelectorAll('link[rel="canonical"]').forEach(tag => tag.remove());
  });

  afterEach(() => {
    // Clean up after each test
    document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]').forEach(tag => tag.remove());
    document.querySelectorAll('link[rel="canonical"]').forEach(tag => tag.remove());
  });

  it("should set document title", () => {
    useOpenGraph({
      title: "Test Page",
      description: "Test Description",
    });

    expect(document.title).toBe("Test Page");
  });

  it("should add Open Graph meta tags", () => {
    useOpenGraph({
      title: "Test Page",
      description: "Test Description",
      url: "https://example.com/test",
      image: "https://example.com/image.jpg",
      type: "website",
      siteName: "Test Site",
      locale: "ar_SA",
    });

    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogType = document.querySelector('meta[property="og:type"]');
    const ogSite = document.querySelector('meta[property="og:site_name"]');
    const ogLocale = document.querySelector('meta[property="og:locale"]');

    expect(ogTitle?.getAttribute("content")).toBe("Test Page");
    expect(ogDesc?.getAttribute("content")).toBe("Test Description");
    expect(ogUrl?.getAttribute("content")).toBe("https://example.com/test");
    expect(ogImage?.getAttribute("content")).toBe("https://example.com/image.jpg");
    expect(ogType?.getAttribute("content")).toBe("website");
    expect(ogSite?.getAttribute("content")).toBe("Test Site");
    expect(ogLocale?.getAttribute("content")).toBe("ar_SA");
  });

  it("should add Twitter Card meta tags", () => {
    useOpenGraph({
      title: "Test Page",
      description: "Test Description",
      image: "https://example.com/image.jpg",
      twitterHandle: "@testhandle",
    });

    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    const twitterCreator = document.querySelector('meta[name="twitter:creator"]');

    expect(twitterCard?.getAttribute("content")).toBe("summary_large_image");
    expect(twitterTitle?.getAttribute("content")).toBe("Test Page");
    expect(twitterDesc?.getAttribute("content")).toBe("Test Description");
    expect(twitterImage?.getAttribute("content")).toBe("https://example.com/image.jpg");
    expect(twitterCreator?.getAttribute("content")).toBe("@testhandle");
  });

  it("should add canonical link", () => {
    useOpenGraph({
      title: "Test Page",
      description: "Test Description",
      url: "https://example.com/test",
    });

    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe("https://example.com/test");
  });

  it("should add image dimensions meta tags", () => {
    useOpenGraph({
      title: "Test Page",
      description: "Test Description",
      image: "https://example.com/image.jpg",
    });

    const imageWidth = document.querySelector('meta[property="og:image:width"]');
    const imageHeight = document.querySelector('meta[property="og:image:height"]');
    const imageType = document.querySelector('meta[property="og:image:type"]');

    expect(imageWidth?.getAttribute("content")).toBe("1200");
    expect(imageHeight?.getAttribute("content")).toBe("630");
    expect(imageType?.getAttribute("content")).toBe("image/jpeg");
  });

  it("should use default values when not provided", () => {
    useOpenGraph({
      title: "Test Page",
      description: "Test Description",
    });

    const ogType = document.querySelector('meta[property="og:type"]');
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    const ogSite = document.querySelector('meta[property="og:site_name"]');

    expect(ogType?.getAttribute("content")).toBe("website");
    expect(ogLocale?.getAttribute("content")).toBe("ar_SA");
    expect(ogSite?.getAttribute("content")).toBe("وصلني - Wasalni");
  });

  it("should remove previous Open Graph tags when updating", () => {
    // First call
    useOpenGraph({
      title: "First Page",
      description: "First Description",
    });

    let ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle?.getAttribute("content")).toBe("First Page");

    // Second call
    useOpenGraph({
      title: "Second Page",
      description: "Second Description",
    });

    ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle?.getAttribute("content")).toBe("Second Page");

    // Should only have one og:title tag
    const allOgTitles = document.querySelectorAll('meta[property="og:title"]');
    expect(allOgTitles.length).toBe(1);
  });
});
