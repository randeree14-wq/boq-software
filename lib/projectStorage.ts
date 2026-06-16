const STORAGE_KEY = "boq-software-project";

export function saveProjectData(data: unknown) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadProjectData<T>(): T | null {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return null;

  return JSON.parse(saved) as T;
}

export function clearProjectData() {
  localStorage.removeItem(STORAGE_KEY);
}