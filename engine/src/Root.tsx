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
import { TdnV8 } from "./videos/TdnV8";
import { TdnV9 } from "./videos/TdnV9";
import { TdnV10 } from "./videos/TdnV10";
import { TdnV11 } from "./videos/TdnV11";
import { TdnV12 } from "./videos/TdnV12";
import { TdnV13 } from "./videos/TdnV13";
import { TdnV14 } from "./videos/TdnV14";
import { BedahV2P1, BedahV2P2, BedahV2P3, BedahV2P4 } from "./videos/BedahV2";
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
  <Composition id="TdnV8" component={TdnV8} width={720} height={1280} fps={30} durationInFrames={1979} />
  <Composition id="TdnV9" component={TdnV9} width={720} height={1280} fps={30} durationInFrames={1867} />
  <Composition id="TdnV10" component={TdnV10} width={720} height={1280} fps={30} durationInFrames={2070} />
  <Composition id="TdnV11" component={TdnV11} width={720} height={1280} fps={30} durationInFrames={2010} />
  <Composition id="TdnV12" component={TdnV12} width={720} height={1280} fps={30} durationInFrames={1957} />
  <Composition id="TdnV13" component={TdnV13} width={720} height={1280} fps={30} durationInFrames={2122} />
  <Composition id="TdnV14" component={TdnV14} width={720} height={1280} fps={30} durationInFrames={1931} />
  <Composition id="BedahV2P1" component={BedahV2P1} width={1280} height={720} fps={30} durationInFrames={4041} />
  <Composition id="BedahV2P2" component={BedahV2P2} width={1280} height={720} fps={30} durationInFrames={4167} />
  <Composition id="BedahV2P3" component={BedahV2P3} width={1280} height={720} fps={30} durationInFrames={3492} />
  <Composition id="BedahV2P4" component={BedahV2P4} width={1280} height={720} fps={30} durationInFrames={4278} />
</>;
