/**
 * Companies shown in the "trusted by" marquee. Add a `logo` field here when
 * logos become available (SVG in `public/` or an icon component).
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
