export default function CoursesSection() {
  const courses = [
    {
      id: 1,
      title: "Iniciação Luciferiana",
      description: "Fundamentos e primeiros passos no caminho",
      price: "R$ 197"
    },
    {
      id: 2,
      title: "Runas e Símbolos",
      description: "Interpretação e aplicação prática",
      price: "R$ 147"
    },
    {
      id: 3,
      title: "Tarô Infernal",
      description: "Divinação através das cartas obscuras",
      price: "R$ 167"
    },
    {
      id: 4,
      title: "Espelho Negro",
      description: "Scrying e visões através do abismo",
      price: "R$ 247"
    }
  ];

  return (
    <section id="cursos" className="py-20 scroll-reveal">
      <div className="container mx-auto px-6">
        <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-center mb-16 text-shadow-gold">
          ACADEMIA INFERNAL
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="glass-effect p-6 border border-deep-red/30 hover-mystic">
              <h3 className="font-cinzel text-lg font-bold mb-3">{course.title}</h3>
              <p className="font-crimson text-sm text-aged-gray mb-4">{course.description}</p>
              <div className="text-antique-gold font-bold mb-3">{course.price}</div>
              <button className="w-full bg-deep-red text-white py-2 text-sm font-cinzel-regular hover:bg-blood-red transition-all">
                Iniciar Curso
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
