/**
 * Statistik yang diambil saat build — angka di kartu tidak lagi mati.
 * Semua permintaan dibungkus try/catch: kalau API gagal / kena rate limit,
 * halaman tetap ter-build memakai angka cadangan.
 */
export type Stats = {
  repos: number;
  followers: number;
  models: number;
  spaces: number;
  datasets: number;
};

export const FALLBACK: Stats = {
  repos: 48,
  followers: 10,
  models: 8,
  spaces: 5,
  datasets: 1,
};

const GH = 'https://api.github.com/users/Maftuuh1922';
const HF = 'https://huggingface.co/api';

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { accept: 'application/json', 'user-agent': 'porto-maftuh-build', ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return (await res.json()) as T;
}

export async function fetchStats(): Promise<{ stats: Stats; live: boolean }> {
  try {
    const [gh, models, spaces, datasets] = await Promise.all([
      json<{ public_repos: number; followers: number }>(GH),
      json<unknown[]>(`${HF}/models?author=maftuh-main`),
      json<unknown[]>(`${HF}/spaces?author=maftuh-main`),
      json<unknown[]>(`${HF}/datasets?author=maftuh-main`),
    ]);
    return {
      stats: {
        repos: gh.public_repos ?? FALLBACK.repos,
        followers: gh.followers ?? FALLBACK.followers,
        models: Array.isArray(models) ? models.length : FALLBACK.models,
        spaces: Array.isArray(spaces) ? spaces.length : FALLBACK.spaces,
        datasets: Array.isArray(datasets) ? datasets.length : FALLBACK.datasets,
      },
      live: true,
    };
  } catch (err) {
    console.warn('[stats] memakai angka cadangan:', (err as Error).message);
    return { stats: FALLBACK, live: false };
  }
}
