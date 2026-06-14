import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer>
      <span>
        © {new Date().getFullYear()} {siteConfig.name}
      </span>
    </footer>
  );
}
