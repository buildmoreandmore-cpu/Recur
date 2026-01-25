// Schema.org structured data helpers for SEO

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate FAQPage schema for rich snippets
 */
export function generateFAQSchema(faqs: FAQItem[]): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
  return JSON.stringify(schema);
}

/**
 * Generate BreadcrumbList schema for navigation rich snippets
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
  return JSON.stringify(schema);
}

/**
 * Generate SoftwareApplication schema with comparison data
 */
export function generateComparisonSchema(
  competitorName: string,
  features: { recur: boolean | string; competitor: boolean | string; feature: string }[]
): string {
  const recurFeatures = features
    .filter(f => f.recur === true || (typeof f.recur === 'string' && !f.recur.toLowerCase().includes('coming')))
    .map(f => f.feature);

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Recur",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "description": `Recur is a booking software alternative to ${competitorName} with revenue forecasting and client rotation tracking.`,
    "url": "https://bookrecur.com",
    "offers": {
      "@type": "Offer",
      "price": "19",
      "priceCurrency": "USD",
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    },
    "featureList": recurFeatures
  };
  return JSON.stringify(schema);
}

/**
 * Generate Service schema for industry landing pages
 */
export function generateServiceSchema(
  industryName: string,
  industrySlug: string,
  features: string[]
): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `Recur for ${industryName}`,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "description": `Booking software for ${industryName.toLowerCase()}s with deposit collection, revenue forecasting, and client rotation tracking.`,
    "url": `https://bookrecur.com/for/${industrySlug}`,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free trial available"
    },
    "featureList": features
  };
  return JSON.stringify(schema);
}

/**
 * Inject schema script into document head
 */
export function injectSchema(schemaId: string, schemaJson: string): void {
  // Remove existing schema with same ID if present
  const existing = document.getElementById(schemaId);
  if (existing) {
    existing.remove();
  }

  // Create and inject new schema script
  const script = document.createElement('script');
  script.id = schemaId;
  script.type = 'application/ld+json';
  script.textContent = schemaJson;
  document.head.appendChild(script);
}

/**
 * Remove schema script from document head
 */
export function removeSchema(schemaId: string): void {
  const existing = document.getElementById(schemaId);
  if (existing) {
    existing.remove();
  }
}
