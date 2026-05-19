import { permanentRedirect } from "next/navigation";
import { defaultLocale } from "@/i18n/config";

export default function RootRedirectPage(): never {
  permanentRedirect(`/${defaultLocale}`);
}
