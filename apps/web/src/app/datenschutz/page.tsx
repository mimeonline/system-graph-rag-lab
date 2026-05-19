import { permanentRedirect } from "next/navigation";

export default function DatenschutzPage(): never {
  permanentRedirect("/de/datenschutz");
}
