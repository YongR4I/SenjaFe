/**
 * Senja FE API client — talks to Senja-BE (`/api/v1`).
 * All helpers fall back to static mock data when BE is offline,
 * so the landing page never breaks in dev.
 */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

type Paginated<T> = {
  data: T[];
  meta?: { total?: number };
};

/** Unwrap Laravel paginate `{data}` or plain array. */
export function unwrapList<T>(json: unknown): T[] {
  if (Array.isArray(json)) return json as T[];
  if (json && typeof json === "object" && Array.isArray((json as Paginated<T>).data)) {
    return (json as Paginated<T>).data;
  }
  return [];
}

export function unwrapItem<T>(json: unknown): T | null {
  if (json && typeof json === "object" && "data" in json) {
    return (json as { data: T }).data;
  }
  return (json as T) ?? null;
}

async function getJSON(path: string): Promise<unknown | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchProjects(params = ""): Promise<unknown[]> {
  const json = await getJSON(`/projects?per_page=50${params}`);
  return unwrapList(json);
}

export async function fetchProject(slug: string): Promise<unknown | null> {
  return unwrapItem(await getJSON(`/projects/${slug}`));
}

export async function fetchPartners(params = ""): Promise<unknown[]> {
  const json = await getJSON(`/partners?per_page=50${params}`);
  return unwrapList(json);
}

export async function fetchPartner(slug: string): Promise<unknown | null> {
  return unwrapItem(await getJSON(`/partners/${slug}`));
}

export async function fetchHero(): Promise<unknown | null> {
  return unwrapItem(await getJSON(`/hero`));
}

export async function fetchAbout(): Promise<unknown | null> {
  return unwrapItem(await getJSON(`/about`));
}

export type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  /** snake_case for BE; camelCase accepted via BE normalizer */
  project_type?: string;
  timeline?: string;
  message: string;
};

/** POST contact inquiry straight to BE (no more CMS passthrough). */
export async function submitContact(payload: ContactPayload): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/contact-inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}
