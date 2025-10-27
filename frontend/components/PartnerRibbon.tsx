// FILE: frontend/components/PartnerRibbon.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "../lib/api";
import { Partner, StrapiApiResponse } from "../lib/types";
import { PartnerCard } from "./PartnerCard";

async function getPartners(): Promise<Partner[]> {
  const query = { populate: "*" };
  try {
    const res = await fetchApi<StrapiApiResponse<Partner>>("partners", query);
    return res.data || [];
  } catch (error) {
    console.error("Error fetching partners:", error);
    return [];
  }
}

export function PartnerRibbon() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPartners().then((data) => {
      if (data.length > 0) {
        setPartners([...data, ...data]); // Duplicate for infinite scroll
      }
      setLoading(false);
    });
  }, []);

  if (loading || partners.length === 0) {
    return (
      <section className="py-12 bg-background-secondary/50">
        <div className="container mx-auto max-w-7xl text-center">
          <p className="text-sm text-text-secondary">Loading partners...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-background-secondary/50 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <h2 className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-text-secondary">
          Trusted by Industry Leaders
        </h2>
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll">
            {partners.map((partner, index) => (
              <PartnerCard key={`${partner.id}-${index}`} partner={partner} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}