/**
 * Companies shown in the "trusted by" marquee. Placeholder list — replace the
 * names with real clients/employers, and (later) add a `logo` field pointing
 * to an SVG/image in `public/` or an icon component.
 */
export type TrustedCompany = {
  name: string;
  /** Company website — opened in a new tab from the marquee. */
  url: string;
};

export const trustedCompanies: TrustedCompany[] = [
  { name: "TCP Innovation", url: "https://www.les-mysteres-du-web.fr/" },
  { name: "Plume SAS", url: "https://www.plume.fr/" },
];
