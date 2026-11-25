import React from "react";
import { Composition } from "remotion";
import "@fontsource/inter/900.css";
import { Main } from "./Main";
import { NvidiaV4 } from "./videos/NvidiaV4";
import { TdnV1 } from "./videos/TdnV1";
import { TdnV2 } from "./videos/TdnV2";
import { TdnV3 } from "./videos/TdnV3";
import { TdnV5 } from "./videos/TdnV5";
import { TdnV6 } from "./videos/TdnV6";
import { TdnV7 } from "./videos/TdnV7";
import { TdnV9 } from "./videos/TdnV9";
// DURATION: set durationInFrames = ceil(voiceover_seconds * 30). Use --props or edit per video.
export const Root: React.FC = () => <>
  <Composition id="Main" component={Main} width={720} height={1280} fps={30} durationInFrames={60} />
  <Composition id="NvidiaV4" component={NvidiaV4} width={720} height={1280} fps={30} durationInFrames={661} />
  <Composition id="TdnV1" component={TdnV1} width={720} height={1280} fps={30} durationInFrames={693} />
  <Composition id="TdnV2" component={TdnV2} width={720} height={1280} fps={30} durationInFrames={766} />
  <Composition id="TdnV3" component={TdnV3} width={720} height={1280} fps={30} durationInFrames={662} />
  <Composition id="TdnV5" component={TdnV5} width={720} height={1280} fps={30} durationInFrames={918} />
  <Composition id="TdnV6" component={TdnV6} width={720} height={1280} fps={30} durationInFrames={945} />
  <Composition id="TdnV7" component={TdnV7} width={720} height={1280} fps={30} durationInFrames={1895} />
  <Composition id="TdnV9" component={TdnV9} width={720} height={1280} fps={30} durationInFrames={1965} />
</>;
