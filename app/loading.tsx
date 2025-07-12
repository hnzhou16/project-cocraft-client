import {typography, ui} from "@/utils/classnames";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className={ui.busy}></div>
        <p className={typography.h3}>Loading...</p>
        <p className={typography.p1}>Please wait while we load your content.</p>
      </div>
    </div>
  );
}
