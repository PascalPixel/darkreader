declare namespace DarkReader {
    /**
     * Enables dark mode for current web page.
     * @param theme Theme options.
     * @param fixes Fixes for the generated theme.
     */
    function enable(theme: Partial<Theme>, fixes?: DynamicThemeFix[]): void;

    /**
     * Disables dark mode for current web page.
     */
    function disable(): void;

    /**
     * Enables dark mode when system color scheme is dark.
     * @param theme Theme options.
     * @param fixes Fixes for the generated theme.
     */
    function auto(theme: Partial<Theme> | false, fixes?: DynamicThemeFix[]): void;

    /**
     * Stops watching for system color scheme.
     * @param isEnabled Boolean `false` value.
     */
    function auto(isEnabled: false): void;
    /**
     * Returns if darkreader is enabled.
     */
    function isEnabled(): boolean;

    /**
     * Sets a function for making CORS requests.
     * @param fetch A fetch function.
     */
    function setFetchMethod(fetch: (url: string) => Promise<Response>): void;

    /**
     * Returns the generated CSS by Dark Reader as a string.
     */
    function exportGeneratedCSS(): Promise<string>;

    /**
     * ConfigManager loads fixes and theme options from storage.
     */
    class ConfigManager {
        private static DARK_SITES_INDEX: SiteListIndex | null;
        public static DYNAMIC_THEME_FIXES_INDEX: SitePropsIndex<DynamicThemeFix> | null;
        public static DYNAMIC_THEME_FIXES_RAW: string | null;
        public static INVERSION_FIXES_INDEX: SitePropsIndex<InversionFix> | null;
        public static INVERSION_FIXES_RAW: string | null;
        public static STATIC_THEMES_INDEX: SitePropsIndex<StaticTheme> | null;
        public static STATIC_THEMES_RAW: string | null;
        public static COLOR_SCHEMES_RAW: ParsedColorSchemeConfig | null;
        public static raw: {
            darkSites: string | null;
            dynamicThemeFixes: string | null;
            inversionFixes: string | null;
            staticThemes: string | null;
            colorSchemes: string | null;
        };
        public static overrides: {
            darkSites: string | null;
            dynamicThemeFixes: string | null;
            inversionFixes: string | null;
            staticThemes: string | null;
        };
        public static load(config?: LocalConfig): Promise<void>;
        public static isURLInDarkList(url: string): boolean;
    }

    /**
     * Theme options.
     */
    interface Theme {
        /**
         * 1 - dark mode, 0 - dimmed mode.
         * Default 1.
         */
        mode: 0 | 1;
        /**
         * Brightness (0 - 100+).
         * Default 100.
         */
        brightness: number;
        /**
         * Contrast (0 - 100+).
         * Default 100.
         */
        contrast: number;
        /**
         * Grayscale (0 - 100).
         * Default 0.
         */
        grayscale: number;
        /**
         * Sepia (0 - 100).
         * Default 0.
         */
        sepia: number;
        /**
         * Specifies if custom font should be used.
         * Default false.
         */
        useFont: boolean;
        /**
         * Font family to use.
         */
        fontFamily: string;
        /**
         * Makes text look bolder (0 - 1px).
         * Default 0.
         */
        textStroke: number;
        /**
         * Background color to use for dark mode.
         * Default #181a1b
         */
        darkSchemeBackgroundColor: string;
        /**
         * Text color to use for dark mode.
         * Default #e8e6e3
         */
        darkSchemeTextColor: string;
        /**
         * Background color to use for light mode.
         * Default #dcdad7
         */
        lightSchemeBackgroundColor: string;
        /**
         * Text color to use for light mode.
         * Default #181a1b
         */
        lightSchemeTextColor: string;
        /**
         * Scrollbar color
         * Default auto
         */
        scrollbarColor: string;
        /**
         * Selection color
         * Default auto
         */
        selectionColor: string;
        /**
         * Specifies if it has to style system controls
         * Default true
         */
        styleSystemControls: boolean;
    }

    /**
     * Contains fixes for the generated theme.
     */
    interface DynamicThemeFix {
        /**
         * URLs of the sites where the theme should be applied.
         */
        url: string[];
        /**
         * List of CSS selectors that should be inverted.
         * Usually icons that are contained in sprites.
         */
        invert: string[];
        /**
         * Additional CSS.
         * ${color} template should be used to apply theme options to a color.
         * Example:
         * ```
         * body {
         *     background-color: ${white} !important;
         *     background-image: none !important;
         * }
         * ```
         */
        css: string;
        /**
         * List of CSS selectors where it's inline style should not be analyzed
         * Mostly used for color pickers
         */
        ignoreInlineStyle: string[];
        /**
         * List of CSS selectors where it's image should not be analyzed
         * Mostly used for wrongly inverted background-images
         */
        ignoreImageAnalysis: string[];
        /**
         * A toggle to disable the proxying of `document.styleSheets`.
         * This is a API-Exclusive option, as it can break legitmate websites,
         * who are using the Dark Reader API.
         */
        disableStyleSheetsProxy: boolean;
        /**
         * A toggle to disable the proxying of `window.CSS`.
         */
        disableCustomElementRegistryProxy: boolean;
    }

    interface SitePropsMut {
        url: Readonly<string[]>;
    }

    type SiteProps = Readonly<SitePropsMut>;

    interface SitePropsIndex<SiteFix extends SiteProps> {
        offsets: Readonly<string>;
        domains: Readonly<{ [domain: string]: Readonly<number[]> }>;
        domainLabels: Readonly<{ [domainLabel: string]: Readonly<number[]> }>;
        nonstandard: Readonly<number[]>;
        cacheSiteFix: { [offsetId: number]: Readonly<SiteFix> };
        cacheDomainIndex: { [domain: string]: Readonly<number[]> };
        cacheCleanupTimer: ReturnType<typeof setTimeout> | null;
    }

    interface SiteListIndex {
        urls: Readonly<string[]>;
        domains: Readonly<{ [domain: string]: number[] }>;
        domainLabels: Readonly<{ [domainLabel: string]: Readonly<number[]> }>;
        nonstandard: Readonly<number[]>;
    }

    interface InversionFix {
        url: string[];
        invert: string[];
        noinvert: string[];
        removebg: string[];
        css: string;
    }

    interface StaticTheme {
        url: string[];
        neutralBg?: string[];
        neutralBgActive?: string[];
        neutralText?: string[];
        neutralTextActive?: string[];
        neutralBorder?: string[];
        redBg?: string[];
        redBgActive?: string[];
        redText?: string[];
        redTextActive?: string[];
        redBorder?: string[];
        greenBg?: string[];
        greenBgActive?: string[];
        greenText?: string[];
        greenTextActive?: string[];
        greenBorder?: string[];
        blueBg?: string[];
        blueBgActive?: string[];
        blueText?: string[];
        blueTextActive?: string[];
        blueBorder?: string[];
        fadeBg?: string[];
        fadeText?: string[];
        transparentBg?: string[];
        noImage?: string[];
        invert?: string[];
        noCommon?: boolean;
    }

    interface ColorSchemeVariant {
        // The background color of the color scheme in hex format.
        backgroundColor: string;
        // The text color of the color scheme in hex format.
        textColor: string;
    }

    interface ParsedColorSchemeConfig {
        // All defined light color schemes.
        light: { [name: string]: ColorSchemeVariant };
        // All defined dark color schemes.
        dark: { [name: string]: ColorSchemeVariant };
    }

    interface LocalConfig {
        local: boolean;
    }
}

declare module 'darkreader' {
    export = DarkReader;
}
