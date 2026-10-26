import fs from "fs";
import path from "path";
import yaml from "js-yaml";

interface SwaggerDoc {
  openapi: string;
  info: Record<string, any>;
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
  };
}

// Synchronous on purpose: app.ts sends the returned string as-is
export function generateSwaggerYaml(yamlPath: string): string {
  const swaggerDocument = formatSwaggerDocument(yamlPath);

  return yaml.dump(swaggerDocument);
}

function formatSwaggerDocument(directoryPath: string): SwaggerDoc {
  const mainPath = path.join(directoryPath, "main.yaml");

  return loadAndCombineYamlFiles(mainPath, directoryPath);
}

// Load the main document and merge additional YAML files into it
function loadAndCombineYamlFiles(mainPath: string, directoryPath: string): SwaggerDoc {
  // Load the main document
  const mainDocument: SwaggerDoc = loadYamlFile(mainPath);

  // Read all other yaml files from the directory
  const files = fs.readdirSync(directoryPath).filter(file => file.endsWith(".yaml") && file !== "main.yaml");

  files.forEach(file => {
    const filePath = path.join(directoryPath, file);
    const doc: SwaggerDoc = loadYamlFile(filePath);

    // Merge paths and components.schemas
    mainDocument.paths = { ...mainDocument.paths, ...doc.paths };
    mainDocument.components.schemas = { ...mainDocument.components.schemas, ...(doc.components?.schemas || {}) };
  });

  return mainDocument;
}


function loadYamlFile(filePath: string): any {
  const yamlContent = fs.readFileSync(filePath, "utf8");

  return yaml.load(yamlContent);
}
