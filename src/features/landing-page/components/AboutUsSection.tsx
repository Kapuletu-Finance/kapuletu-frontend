export const AboutUsSection = () => {
  return (
    <section id="about" className="w-full py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <span className="text-sm font-bold uppercase tracking-wider text-primary">About Us</span>
          <div className="h-1 w-12 bg-primary mt-2"></div>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold mb-8 text-foreground">
          Building Financial Trust For{" "}
          <span className="text-primary">Treasurers & Organizations</span>
        </h2>
        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
          <p>
            KapuLetu is a modern group finance platform designed to help treasurers, committees,
            welfare clubs, associations, and organizations manage contributions with transparency
            and ease.
          </p>
          <p>
            We simplify treasury management by helping financial leaders track contributions,
            monitor expenses, reconcile inbox, and maintain secure records all in one place.
          </p>
          <p>
            Whether you are the treasurer of an association, charity, investment club, or community
            project, KapuLetu helps you stay organized, accountable, and connected.
          </p>
        </div>
      </div>
    </section>
  );
};
