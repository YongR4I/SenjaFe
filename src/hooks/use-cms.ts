"use client";

import * as React from "react";
import { fetchPartners, fetchProjects, unwrapList } from "@/lib/api";
import { projects as fallbackProjects, type Project } from "@/data/projects";
import { technologyPartners as fallbackPartners, type TechnologyPartner } from "@/data/partners";
import { mapPartner, mapProject } from "@/lib/mappers";

/** BE-first list with static fallback — keeps page alive when API offline. */
export function useProjects(category = ""): Project[] {
  const [list, setList] = React.useState<Project[]>(fallbackProjects);

  React.useEffect(() => {
    let cancelled = false;
    fetchProjects(category && category !== "All" ? `&category=${encodeURIComponent(category)}` : "")
      .then((items) => {
        if (!cancelled && items.length > 0) {
          const mapped = items.map((p) => mapProject(p as Record<string, unknown>));
          setList(mapped);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [category]);

  return list;
}

export function usePartners(): TechnologyPartner[] {
  const [list, setList] = React.useState<TechnologyPartner[]>(fallbackPartners);

  React.useEffect(() => {
    let cancelled = false;
    fetchPartners()
      .then((items) => {
        if (!cancelled && items.length > 0) {
          const mapped = items.map((p) => mapPartner(p as Record<string, unknown>));
          setList(mapped);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return list;
}

export { unwrapList };
