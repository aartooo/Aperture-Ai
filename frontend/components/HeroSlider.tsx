// FILE: frontend/components/HeroSlider.tsx
"use client";

import React from "react";
import { Article } from "../lib/types";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export function HeroSlider({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="h-64 md:h-96 lg:h-[500px] rounded-2xl bg-red-100 border-2 border-red-500 flex items-center justify-center">
        <p className="text-red-700 font-bold">NO ARTICLES</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden border border-border shadow-2xl">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
        pagination={{ el: ".swiper-pagination", clickable: true }}
        grabCursor={true}
        className="h-full w-full"
      >
        {articles.map((article, index) => {
          const imgUrl = article.coverImage?.url
            ? `${STRAPI_URL}${article.coverImage.url}`
            : "/placeholder-hero.jpg";

          return (
            <SwiperSlide key={article.id || index}>
              <div className="relative w-full h-full">
                <Image
                  src={imgUrl}
                  alt={article.title || "Article"}
                  fill
                  className="object-cover brightness-90"
                  priority={index === 0}
                  sizes="100vw"
                />
                {/* LIGHTER GRADIENT */}
                <div className="hero-gradient absolute inset-0" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 lg:p-8 text-white z-10">
                  {article.category?.name && (
                    <Link href={`/categories/${article.category.slug}`}>
                      <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-accent mb-2 hover:underline">
                        {article.category.name}
                      </p>
                    </Link>
                  )}
                  <Link href={`/articles/${article.slug}`}>
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight line-clamp-2 md:line-clamp-3 drop-shadow-md hover:text-gray-200 transition">
                      {article.title}
                    </h1>
                  </Link>
                  <p className="mt-2 text-sm md:text-base text-gray-100 line-clamp-2 hidden md:block drop-shadow">
                    {article.excerpt}
                  </p>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="mt-3 md:hidden inline-block px-5 py-2 bg-accent text-white text-sm font-bold rounded-full hover:bg-accent/90 transition active:scale-95"
                  >
                    Read Now
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Arrows - Hidden on mobile */}
      <div className="swiper-button-prev !w-10 !h-10 !bg-black/60 !text-white !rounded-full !flex !items-center !justify-center !z-50 !cursor-pointer hover:!bg-black/80 hidden md:flex" />
      <div className="swiper-button-next !w-10 !h-10 !bg-black/60 !text-white !rounded-full !flex !items-center !justify-center !z-50 !cursor-pointer hover:!bg-black/80 hidden md:flex" />

      {/* Dots */}
      <div className="swiper-pagination !bottom-4 !flex !gap-2 !z-50" />
    </div>
  );
}