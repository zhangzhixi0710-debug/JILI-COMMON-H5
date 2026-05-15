const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const postcss = require("postcss");
const scss = require("postcss-scss");

const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "src");
const utilitiesPath = path.join(srcDir, "styles", "tailwind", "projectUtilities.js");
const styleBlockReg = /(<style\b[^>]*>)([\s\S]*?)(<\/style>)/g;

const skipFiles = new Set([
    path.join(srcDir, "assets", "styles", "variables.scss"),
    path.join(srcDir, "assets", "styles", "responsive.scss"),
]);

function walk(dir, result = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            walk(fullPath, result);
            continue;
        }

        if ((/\.(scss|css)$/.test(entry.name) && !skipFiles.has(fullPath)) || /\.vue$/.test(entry.name)) {
            result.push(fullPath);
        }
    }

    return result;
}

function normalizeDeclarations(declarations) {
    return declarations
        .map(decl => {
            const important = decl.important ? " !important" : "";
            return `${decl.prop.trim()}: ${decl.value.trim()}${important}`;
        })
        .join(";");
}

function createUtilityName(signature) {
    const hash = crypto.createHash("md5").update(signature).digest("hex").slice(0, 10);
    return `tw-u-${hash}`;
}

function shouldSkipDecl(decl) {
    return decl.prop.startsWith("$") || decl.raws.before?.includes("//");
}

function canConvertRule(rule) {
    let current = rule.parent;

    while (current) {
        if (current.type === "atrule" && ["mixin", "function", "keyframes"].includes(current.name)) {
            return false;
        }
        current = current.parent;
    }

    return true;
}

function convertStyleContent(source, filePath, utilities) {
    const root = scss.parse(source, { from: filePath });
    let changed = false;

    root.walkRules(rule => {
        if (!canConvertRule(rule)) return;

        const declarations = rule.nodes?.filter(node => node.type === "decl" && !shouldSkipDecl(node)) || [];
        if (!declarations.length) return;

        const signature = normalizeDeclarations(declarations);
        const utilityName = createUtilityName(signature);
        const selector = `.${utilityName}`;

        if (!utilities[selector]) {
            utilities[selector] = declarations.reduce((acc, decl) => {
                acc[decl.prop] = `${decl.value}${decl.important ? " !important" : ""}`;
                return acc;
            }, {});
        }

        const applyRule = postcss.atRule({ name: "apply", params: utilityName });
        const firstDecl = declarations[0];
        rule.insertBefore(firstDecl, applyRule);
        declarations.forEach(decl => decl.remove());
        changed = true;
    });

    return {
        changed,
        css: changed ? root.toResult({ syntax: scss }).css : source,
    };
}

function convertVueFile(filePath, utilities) {
    const source = fs.readFileSync(filePath, "utf8");
    let changed = false;
    const nextSource = source.replace(styleBlockReg, (fullMatch, openTag, styleContent, closeTag) => {
        if (!styleContent.trim()) return fullMatch;

        const result = convertStyleContent(styleContent, filePath, utilities);
        if (!result.changed) return fullMatch;

        changed = true;
        return `${openTag}${result.css}${closeTag}`;
    });

    if (changed) fs.writeFileSync(filePath, nextSource, "utf8");

    return changed;
}

function convertFile(filePath, utilities) {
    if (/\.vue$/.test(filePath)) {
        return convertVueFile(filePath, utilities);
    }

    const source = fs.readFileSync(filePath, "utf8");
    const result = convertStyleContent(source, filePath, utilities);

    if (result.changed) {
        fs.writeFileSync(filePath, result.css, "utf8");
    }

    return result.changed;
}

function sortObjectKeys(value) {
    return Object.keys(value)
        .sort()
        .reduce((acc, key) => {
            acc[key] = value[key];
            return acc;
        }, {});
}

function main() {
    const utilities = fs.existsSync(utilitiesPath) ? require(utilitiesPath) : {};
    const files = walk(srcDir);
    const changedFiles = files.filter(filePath => convertFile(filePath, utilities));
    const sortedUtilities = sortObjectKeys(utilities);
    const content = `module.exports = ${JSON.stringify(sortedUtilities, null, 4)};\n`;

    fs.writeFileSync(utilitiesPath, content, "utf8");

    console.log(`Converted ${changedFiles.length} style files.`);
    console.log(`Generated ${Object.keys(sortedUtilities).length} Tailwind utilities.`);
}

main();
