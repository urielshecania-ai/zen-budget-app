const fs = require("fs");
const path = require("path");

// === CONFIGURATION ===
const SOURCE_FILE = "app fonctionne sans systheme d'authentification.txt";
const DEST_DIR = path.join(__dirname, "src");

// Map regex -> [nouveau fichier, nom d'export, chemin d'import]
const MIGRATION_MAP = {
  "const currencyService\\s*=\\s*{[\\s\\S]*?};": ["services/currencyService.ts", "currencyService", "services/currencyService"],
  "const exportFunctions\\s*=\\s*{[\\s\\S]*?};": ["services/exportService.ts", "exportFunctions", "services/exportService"],
  "const calculateurs\\s*=\\s*{[\\s\\S]*?};": ["utils/calculateurs.ts", "calculateurs", "utils/calculateurs"],
  "const Card: React.FC[\\s\\S]*?\\};": ["components/common/Card.tsx", "Card", "components/common/Card"],
  "const Button: React.FC[\\s\\S]*?\\};": ["components/common/Button.tsx", "Button", "components/common/Button"],
  "const Modal: React.FC[\\s\\S]*?\\};": ["components/common/Modal.tsx", "Modal", "components/common/Modal"],
  "const KPICard: React.FC[\\s\\S]*?\\};": ["components/common/KPICard.tsx", "KPICard", "components/common/KPICard"],
};

// Regex pour interfaces et types
const INTERFACE_REGEX = /interface\s+\w+\s*{[\s\S]*?}/g;
const TYPE_REGEX = /type\s+\w+\s*=\s*[\s\S]*?;/g;
const PAGE_REGEX = /const\s+(\w+Page):\s*React\.FC[\s\S]*?\};/g;

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function migrate() {
  let content = fs.readFileSync(SOURCE_FILE, "utf-8");
  let updatedContent = content;

  // === EXTRACTION DES SERVICES / COMPONENTS / UTILS ===
  for (let pattern in MIGRATION_MAP) {
    const [target, exportName, importPath] = MIGRATION_MAP[pattern];
    const regex = new RegExp(pattern, "m");
    const match = content.match(regex);

    if (match) {
      let codeBlock = match[0];
      if (!codeBlock.trim().startsWith("export")) {
        codeBlock = "export " + codeBlock;
      }

      const targetPath = path.join(DEST_DIR, target);
      ensureDir(targetPath);
      fs.writeFileSync(targetPath, codeBlock + "\n", "utf-8");

      console.log(`[OK] Bloc extrait vers ${targetPath}`);

      const importStatement = `import { ${exportName} } from './${importPath}';`;
      updatedContent = updatedContent.replace(match[0], importStatement);
    }
  }

  // === EXTRACTION DES INTERFACES ET TYPES ===
  const interfaces = content.match(INTERFACE_REGEX) || [];
  const types = content.match(TYPE_REGEX) || [];

  if (interfaces.length || types.length) {
    const typesPath = path.join(DEST_DIR, "types/appData.ts");
    ensureDir(typesPath);

    let typeFileContent = "";
    interfaces.forEach(iface => {
      typeFileContent += "export " + iface.trim() + "\n\n";
      updatedContent = updatedContent.replace(iface, "// déplacé dans types/appData.ts");
    });
    types.forEach(t => {
      typeFileContent += "export " + t.trim() + "\n\n";
      updatedContent = updatedContent.replace(t, "// déplacé dans types/appData.ts");
    });

    fs.writeFileSync(typesPath, typeFileContent, "utf-8");
    console.log(`[OK] ${interfaces.length} interfaces et ${types.length} types exportés vers ${typesPath}`);

    updatedContent = `import * as Types from './types/appData';\n\n` + updatedContent;
  }

  // === EXTRACTION DES PAGES ===
  let pageMatch;
  while ((pageMatch = PAGE_REGEX.exec(content)) !== null) {
    const pageName = pageMatch[1];
    const regex = new RegExp(`const ${pageName}:\\s*React\\.FC[\\s\\S]*?\\};`);
    const match = content.match(regex);
    if (match) {
      let codeBlock = match[0];
      if (!codeBlock.trim().startsWith("export")) {
        codeBlock = "export " + codeBlock;
      }

      const targetPath = path.join(DEST_DIR, "pages", `${pageName}.tsx`);
      ensureDir(targetPath);
      fs.writeFileSync(targetPath, codeBlock + "\n", "utf-8");

      console.log(`[OK] Page ${pageName} extraite vers ${targetPath}`);

      const importStatement = `import { ${pageName} } from './pages/${pageName}';`;
      updatedContent = updatedContent.replace(match[0], importStatement);
    }
  }

  // === SAUVEGARDE DU NOUVEAU APP.TSX ===
  const appFile = path.join(DEST_DIR, "App.tsx");
  ensureDir(appFile);
  fs.writeFileSync(appFile, updatedContent, "utf-8");

  console.log(`\n✅ Migration terminée. Nouveau fichier principal : ${appFile}`);
}

migrate();
