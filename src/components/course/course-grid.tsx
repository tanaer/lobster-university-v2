"use client";

import { motion } from "framer-motion";
import { CourseCard } from "./course-card";

interface Course {
  id: string;
  title: string;
  description: string;
  coverImage: string | null;
  category: string;
  level: string;
  duration: number | null;
  studentCount: number;
  rating: number;
}

interface CourseGridProps {
  courses: Course[];
  title?: string;
  subtitle?: string;
}

export function CourseGrid({ courses, title, subtitle }: CourseGridProps) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {title && (
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
