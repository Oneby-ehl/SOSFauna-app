import LandingPage from "./LandingPage";
import LandingPresentation from "./LandingPresentation.web";

export default function HomeWeb() {
  return <LandingPage renderWeb={(props) => <LandingPresentation {...props} />} />;
}
