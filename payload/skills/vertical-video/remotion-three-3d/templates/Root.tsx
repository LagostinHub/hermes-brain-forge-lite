import React from 'react';
import {Composition} from 'remotion';
import {Icons3D} from './Icons3D';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Preview with atmospheric bg — for approval / direct posts */}
    <Composition
      id="Icons3D-Preview"
      component={Icons3D}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{withBg:true}}
    />
    {/* Alpha delivery — transparent background for AE/Premiere composite */}
    <Composition
      id="Icons3D-Alpha"
      component={Icons3D}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{withBg:false}}
    />
  </>
);
