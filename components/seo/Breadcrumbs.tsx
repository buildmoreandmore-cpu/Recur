import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumb navigation component for SEO and UX
 * Renders visual breadcrumbs with proper accessibility
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
      <ol className="flex items-center gap-2 flex-wrap" itemScope itemType="https://schema.org/BreadcrumbList">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={index}
              className="flex items-center gap-2"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index > 0 && (
                <svg
                  className="w-4 h-4 text-maroon/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <title>Separator</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              )}

              {isLast ? (
                <span
                  className="text-maroon font-medium"
                  itemProp="name"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : item.onClick ? (
                <button
                  onClick={item.onClick}
                  className="text-maroon/60 hover:text-maroon transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </button>
              ) : item.href ? (
                <a
                  href={item.href}
                  className="text-maroon/60 hover:text-maroon transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </a>
              ) : (
                <span className="text-maroon/60" itemProp="name">
                  {item.label}
                </span>
              )}

              <meta itemProp="position" content={String(index + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
