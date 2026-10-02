// Boilerplate minimo: registra a raiz do Remotion.
// Uso: copie para src/Root.tsx e ajuste o import da composicao.
import React from 'react';
import {registerRoot} from 'remotion';
import {Composition} from 'remotion';

import {VideoComposition} from './VideoComposition';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Video"
      component={VideoComposition}
      durationInFrames={675}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};

registerRoot(RemotionRoot);
