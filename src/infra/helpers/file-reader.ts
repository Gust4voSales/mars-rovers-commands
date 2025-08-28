import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

class FileReader {
  static readFile(filePath: string): string {
    const finalPath = resolve(process.cwd(), filePath);

    if (!existsSync(finalPath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    try {
      return readFileSync(finalPath, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to read file: ${filePath}. ${error}`);
    }
  }
}

export { FileReader }