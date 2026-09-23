import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import ProjectDetail from "@/components/ProjectDetail";
import { getProjectBySlug, projects } from "@/data/projects";
import { fetchProject } from "@/lib/api";
import { mapProject } from "@/lib/mappers";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  // Pre-render known slugs; unknown slugs render on demand (BE-first).
  return projects.map((project) => ({ slug: project.slug }));
}

async function getProject(slug: string) {
  try {
    const item = await fetchProject(slug);
    if (item && typeof item === "object") return mapProject(item as Record<string, unknown>);
  } catch {
    // offline → static fallback below
  }
  return getProjectBySlug(slug) ?? null;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) return { title: "Project not found | Senja" };

  return {
    title: `${project.title} | Our Work | Senja`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  const pool = projects.some((item) => item.slug === project.slug) ? projects : [project, ...projects];
  const currentIndex = pool.findIndex((item) => item.slug === project.slug);
  const nextProject = pool[(currentIndex + 1) % pool.length];

  return (
    <>
      <Navigation />
      <main>
        <ProjectDetail project={project} nextProject={nextProject} />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
