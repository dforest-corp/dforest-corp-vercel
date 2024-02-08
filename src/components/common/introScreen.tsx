/** @package */
import { headers } from "next/headers";

async function isRobot() {
  const userAgent = headers().get("user-agent");
  if (!userAgent) return false;
  return userAgent.match(/bot|crawl|slurp|spider/i);
}

export async function IntroScreen() {
  if (await isRobot()) return null;
  return (
    <div className="animate-slide-up delay-2000 fixed left-0  top-0 h-full w-full bg-dforest-green">
      <div className="animate-fade-out delay-1500 absolute left-0 top-0 flex h-full w-full items-center justify-center bg-white">
        <p className="animate-up-fade text-4xl font-black delay-1000 lg:text-6xl text-dforest-green">
          D-FOREST
        </p>
      </div>
    </div>
  );
}
