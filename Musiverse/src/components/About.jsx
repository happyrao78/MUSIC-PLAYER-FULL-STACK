function About() {
  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center -mt-2"
      style={{ backgroundColor: "#01011e" }}
    >
      <div className="relative z-10 bg-white bg-opacity-95 p-12 rounded-lg max-w-3xl mx-4 text-center">
        <h3 className="text-4xl font-bold mb-6 text-[#110640]">
          About Musiverse
        </h3>
        <p className="text-lg leading-relaxed text-[#333366]">
          Welcome to Musiverse, a unique online platform where the world of
          music comes alive. From discovering emerging artists to revisiting
          timeless classics, Musiverse is designed for every music lover. Dive
          into a universe where melodies meet passion, and let your soul
          resonate with the rhythm.
        </p>
      </div>
    </section>
  );
}

export default About;
