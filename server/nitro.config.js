import { defineNitroConfig } from "nitropack";
import { fileURLToPath } from "url";
import { resolve } from "path";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineNitroConfig({
  alias: {
    "@prisma/client2": resolve(__dirname, "../node_modules/.prisma/client2/index.js"),
  },
  externals: {
    inline: [".prisma/client2"],
  },
});
