import { flatConfigs } from "@next/eslint-plugin-next";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...flatConfigs.recommended,
  ...flatConfigs["core-web-vitals"],
];
