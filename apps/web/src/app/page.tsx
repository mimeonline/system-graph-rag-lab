import { HomeTemplate } from "@/features/home/templates/HomeTemplate";

/**
 * Home route entry point that delegates rendering to the home feature template.
 */
export default function Home(): React.JSX.Element {
  return <HomeTemplate />;
}
