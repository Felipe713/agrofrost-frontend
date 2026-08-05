export function getRequiredElement<T extends HTMLElement>(id: string, expectedType: new (...args: never[]) => T): T {
  const element = document.getElementById(id);
  if (element === null || !(element instanceof expectedType)) {
    throw new Error(`Required element #${id} is missing or has an unexpected type.`);
  }
  return element;
}
