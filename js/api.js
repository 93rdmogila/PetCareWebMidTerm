async function fetchJson(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchBreedImage(apiPath) {
  const data = await fetchJson(`https://dog.ceo/api/breed/${apiPath}/images/random`);
  if (!data || data.status !== 'success' || !data.message) return null;
  return data.message;
}

async function fetchCatFact() {
  const data = await fetchJson('https://catfact.ninja/fact');
  if (!data || typeof data.fact !== 'string' || !data.fact.trim()) return null;
  return data.fact;
}