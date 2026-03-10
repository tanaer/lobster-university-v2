import { getCourses, getFeaturedCourses } from "@/lib/services/course";
import { Hero } from "@/components/home/hero";
import { CourseGrid } from "@/components/course/course-grid";

export default async function Home() {
  const [featuredCourses, allCourses] = await Promise.all([
    getFeaturedCourses(),
    getCourses(9),
  ]);

  return (
    <>
      <Hero />
      <CourseGrid
        courses={featuredCourses}
        title="推荐课程"
        subtitle="按评分排序的高分课程"
      />
      <CourseGrid
        courses={allCourses}
        title="全部课程"
        subtitle="最新发布课程"
      />
    </>
  );
}
