export interface UUID {
  make(): string;
  isValid(id: string): boolean;
}
