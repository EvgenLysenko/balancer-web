module.exports = {
    parser: '@typescript-eslint/parser',  // Specifies the ESLint parser
    "extends": [
        "eslint:recommended",
        //"plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "react-app",
        "prettier"
	],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    rules: {
        "no-empty": "off",
        "no-var": "warn",
        "no-prototype-builtins": "off",
        "prefer-const": "off", // TODO set "warn"
        "@typescript-eslint/no-unused-vars": "off", // bug - spam for imports
        "@typescript-eslint/no-unused-vars-experimental": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-non-null-assertion": "off", // TODO set "warn" or "err"
        "@typescript-eslint/ban-types": "off", // TODO set "warn" or "err"
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off", // Line 5:22:  Argument '###' should be typed with a non-any type  @typescript-eslint/explicit-module-boundary-types
        "@typescript-eslint/no-var-requires": "warn",
        "@typescript-eslint/adjacent-overload-signatures": "off", // TODO set "warn" or "err"
        "@typescript-eslint/no-extra-semi": "warn",
    },
    settings: {
        react: {
            version: 'detect',  // Tells eslint-plugin-react to automatically detect the version of React to use
        },
    },
};