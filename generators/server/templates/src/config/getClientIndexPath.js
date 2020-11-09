import { fileURLToPath } from "url";
import path, { dirname } from "path";
import config from "../config.js";

const getClientIndexPath = () => {
  const currentPath = dirname(fileURLToPath(import.meta.url));
  let indexPath = path.join(currentPath, "../../public/dist/index.html");
  if (config.nodeEnv !== "production") {
    indexPath = path.join(currentPath, "../../../client/public/index.html");
  }

  return indexPath;
};

export default getClientIndexPath;
