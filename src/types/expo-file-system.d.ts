declare module "expo-file-system" {
  export const cacheDirectory: string;
  export const documentDirectory: string;

  export function writeAsStringAsync(
    fileUri: string,
    contents: string,
    options?: {
      encoding?: "base64" | "utf8" | null;
    }
  ): Promise<void>;

  export function readAsStringAsync(
    fileUri: string,
    options?: {
      encoding?: "base64" | "utf8" | null;
    }
  ): Promise<string>;
}
