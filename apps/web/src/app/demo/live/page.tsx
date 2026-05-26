import { permanentRedirect } from "next/navigation";

export default function LiveDemoRedirectPage(): never {
  permanentRedirect("/de/demo/live");
}
