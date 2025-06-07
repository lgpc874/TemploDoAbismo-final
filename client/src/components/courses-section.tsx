import { useQuery } from "@tanstack/react-query";
import type { Course } from "@shared/schema";

export default function CoursesSection() {
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  if (isLoading) {
    return (
      <section id="cursos" className="py-20 scroll-reveal">
        <div className="container mx-auto px-6">
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-center mb-16 text-shadow-gold">
            ACADEMIA INFERNAL
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-effect p-6 border border-deep-red/30 animate-pulse">
                <div className="h-6 bg-antique-gold/20 rounded mb-3"></div>
                <div className="h-4 bg-antique-gold/20 rounded mb-4"></div>
                <div className="h-5 bg-antique-gold/20 rounded mb-3"></div>
                <div className="h-10 bg-antique-gold/20 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

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
              <div className="text-antique-gold font-bold mb-3">R$ {course.price}</div>
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
