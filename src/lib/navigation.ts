export function getCommuneFromPath(pathname: string): string | null {
  if (pathname === "/") {
    return null;
  }

  return decodeURIComponent(pathname.replace("/", ""));
}

export function goToCommune(commune: string): void {
  window.location.href = `/${encodeURIComponent(commune)}`;
}

export function goToHome(): void {
  window.location.href = "/";
}

