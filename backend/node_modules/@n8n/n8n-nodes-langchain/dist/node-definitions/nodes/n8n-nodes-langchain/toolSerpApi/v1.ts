/**
 * SerpApi (Google Search) Node - Version 1
 * Search in Google using SerpAPI
 */


export interface LcToolSerpApiV1Params {
  options?: {
    /** Defines the country to use for search. Head to &lt;a href="https://serpapi.com/google-countries"&gt;Google countries page&lt;/a&gt; for a full list of supported countries.
     * @default us
     */
    gl?: string | Expression<string> | PlaceholderValue;
    /** Device to use to get the results
     * @default desktop
     */
    device?: 'desktop' | 'mobile' | 'tablet' | Expression<string>;
    /** Whether to force SerpApi to fetch the Google results even if a cached version is already present. Cache expires after 1h. Cached searches are free, and are not counted towards your searches per month.
     * @default false
     */
    no_cache?: boolean | Expression<boolean>;
    /** Defines the domain to use for search. Head to &lt;a href="https://serpapi.com/google-domains"&gt;Google domains page&lt;/a&gt; for a full list of supported domains.
     * @default google.com
     */
    google_domain?: string | Expression<string> | PlaceholderValue;
    /** Defines the language to use. It's a two-letter language code. (e.g., `en` for English, `es` for Spanish, or `fr` for French). Head to &lt;a href="https://serpapi.com/google-languages"&gt;Google languages page&lt;/a&gt; for a full list of supported languages.
     * @default en
     */
    hl?: string | Expression<string> | PlaceholderValue;
  };
}

export interface LcToolSerpApiV1Credentials {
  serpApi: CredentialReference;
}

interface LcToolSerpApiV1NodeBase {
  type: '@n8n/n8n-nodes-langchain.toolSerpApi';
  version: 1;
  credentials?: LcToolSerpApiV1Credentials;
  isTrigger: true;
}

export type LcToolSerpApiV1ParamsNode = LcToolSerpApiV1NodeBase & {
  config: NodeConfig<LcToolSerpApiV1Params>;
};

export type LcToolSerpApiV1Node = LcToolSerpApiV1ParamsNode;