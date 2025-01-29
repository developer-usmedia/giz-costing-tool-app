import globals from "globals";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import angularEslint from "@angular-eslint/eslint-plugin";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import _import from "eslint-plugin-import";
import jsdoc from "eslint-plugin-jsdoc";
import preferArrow from "eslint-plugin-prefer-arrow";
import tsParser from "@typescript-eslint/parser";
import angularEslintTemplate from "@angular-eslint/eslint-plugin-template";
import parser from "@angular-eslint/template-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import stylisticTs from "@stylistic/eslint-plugin-ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    languageOptions: {
        globals: {
            ...globals.browser,
        },
    },
}, ...fixupConfigRules(compat.extends(
    "eslint:recommended",
    "plugin:@angular-eslint/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
)).map(config => ({
    ...config,
    files: ["**/*.ts"],
})), {
    files: ["**/*.ts"],

    plugins: {
        '@stylistic/ts': stylisticTs,
        "@angular-eslint": fixupPluginRules(angularEslint),
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
        import: fixupPluginRules(_import),
        jsdoc,
        "prefer-arrow": preferArrow,
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "module",

        parserOptions: {
            project: [
                "tsconfig.json",
                "tsconfig.app.json",
                "tsconfig.spec.json",
                "e2e/tsconfig.json",
            ],
        },
    },

    rules: {
        "@angular-eslint/component-selector": ["error", {
            type: "element",
            prefix: "giz",
            style: "kebab-case",
        }],

        "@angular-eslint/directive-selector": ["error", {
            type: "attribute",
            prefix: "giz",
            style: "camelCase",
        }],

        "@angular-eslint/prefer-standalone": "off",

        "@typescript-eslint/naming-convention": ["error", {
            selector: "typeLike",
            format: ["PascalCase"],
        }, {
            selector: "enum",
            format: ["PascalCase", "UPPER_CASE"],
        }, {
            selector: "enumMember",
            format: ["UPPER_CASE"],
        }, {
            selector: "variable",
            format: ["camelCase", "UPPER_CASE"],
            leadingUnderscore: "allow",
        }, {
            selector: "variable",
            types: ["function"],
            format: ["camelCase", "PascalCase", "UPPER_CASE"],
        }, {
            selector: "classProperty",
            modifiers: ["static"],
            format: ["UPPER_CASE"],
        }, {
            selector: "default",
            format: ["camelCase"],
            leadingUnderscore: "allow",
        }],

        "@typescript-eslint/array-type": "warn",
        "@typescript-eslint/consistent-type-assertions": "error",
        "@typescript-eslint/dot-notation": "error",

        "@stylistic/ts/member-delimiter-style": ["error", {
            multiline: {
                delimiter: "semi",
                requireLast: true,
            },

            singleline: {
                delimiter: "semi",
                requireLast: false,
            },
        }],

        "@typescript-eslint/member-ordering": "error",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-inferrable-types": "error",

        "@typescript-eslint/no-misused-promises": ["error", {
            checksVoidReturn: false,
        }],

        "@typescript-eslint/no-unused-vars": ["warn", {
            argsIgnorePattern: "^_",
        }],

        "@typescript-eslint/no-parameter-properties": "off",
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "error",
        "@typescript-eslint/no-unused-expressions": "error",
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": "error",
        "@typescript-eslint/prefer-for-of": "error",
        "@typescript-eslint/prefer-readonly": "warn",
        "@stylistic/ts/quotes": ["error", "single"],
        "@stylistic/ts/semi": "error",

        "@typescript-eslint/triple-slash-reference": ["error", {
            path: "never",
            types: "never",
            lib: "never",
        }],

        "@stylistic/ts/type-annotation-spacing": "error",

        "@typescript-eslint/unbound-method": ["error", {
            ignoreStatic: true,
        }],

        "@typescript-eslint/unified-signatures": "error",

        "comma-dangle": ["warn", {
            arrays: "always-multiline",
            objects: "always-multiline",
            imports: "always-multiline",
            exports: "always-multiline",
            functions: "ignore",
        }],

        "id-blacklist": "off",
        "import/no-unresolved": "off",
        "jsdoc/check-alignment": "error",
        "jsdoc/check-indentation": "error",
        "jsdoc/newline-after-description": "off",
        "jsdoc/no-types": "error",
        complexity: "warn",

        "max-len": ["off", {
            code: 140,
        }],

        "max-lines-per-function": ["warn", {
            max: 60,
            skipComments: true,
        }],

        "no-bitwise": "error",
        "no-caller": "error",
        "no-cond-assign": "error",

        "no-console": ["warn", {
            allow: ["error", "group", "groupEnd", "groupCollapsed", "warn"],
        }],

        "no-empty-function": "off",
        "no-eval": "error",
        "no-fallthrough": "off",
        "no-new-wrappers": "error",
        "no-restricted-imports": ["error", "rxjs/Rx"],
        "no-throw-literal": "error",
        "no-undef-init": "error",
        "no-underscore-dangle": "off",
        "no-unused-vars": "off",
        "no-var": "error",
        "object-shorthand": ["error", "consistent"],
        "one-var": ["error", "never"],

        "prefer-arrow/prefer-arrow-functions": ["warn", {
            disallowPrototype: true,
            singleReturnOnly: false,
            classPropertiesAllowed: false,
            allowStandaloneDeclarations: true,
        }],

        "prefer-const": "error",
        "quote-props": ["error", "as-needed"],
        radix: "error",

        "space-before-function-paren": ["error", {
            anonymous: "never",
            asyncArrow: "always",
            named: "never",
        }],

        "spaced-comment": ["error", "always"],
    },
}, {
    files: ["**/*.html"],

    plugins: {
        "@angular-eslint/template": fixupPluginRules(angularEslintTemplate),
    },

    languageOptions: {
        parser: parser,
    },

    rules: {},
}];