import React from 'react';

const testimonials = [
  {
    quote: "I stopped losing $500/month to no-shows the first month I started collecting deposits.",
    author: "Jessica M.",
    role: "Hair Stylist, Atlanta"
  },
  {
    quote: "Finally, I know what I'll make before the month starts. Game changer for budgeting.",
    author: "Marcus T.",
    role: "Personal Trainer, Chicago"
  },
  {
    quote: "My clients actually appreciate the deposits—it shows I value my time.",
    author: "Sarah K.",
    role: "Lash Artist, Miami"
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-12 sm:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="scroll-reveal text-2xl sm:text-3xl lg:text-4xl font-serif text-center text-maroon mb-8 sm:mb-16">
          Real results from real professionals
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`scroll-reveal delay-${index + 1} bg-cream p-6 sm:p-8 rounded-2xl sm:rounded-[28px] border border-slate-100 relative`}
            >
              {/* Quote mark */}
              <div className="absolute -top-3 left-6 text-5xl text-maroon/20 font-serif">"</div>

              <blockquote className="text-base sm:text-lg text-maroon/80 leading-relaxed mb-6 pt-4">
                {testimonial.quote}
              </blockquote>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-maroon/10 rounded-full flex items-center justify-center">
                  <span className="text-maroon font-bold text-sm sm:text-base">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-maroon text-sm sm:text-base">{testimonial.author}</div>
                  <div className="text-xs sm:text-sm text-maroon/60">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
