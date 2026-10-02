// Composicao minima de exemplo. Copie e substitua pelo seu conteudo.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

export const VideoComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = Math.min(1, frame / 15);
  return (
    <AbsoluteFill style={{backgroundColor: '#101014', justifyContent: 'center'}}>
      <h1 style={{color: '#F9F8F6', fontSize: 72, textAlign: 'center', opacity}}>
        [HEADLINE]
      </h1>
    </AbsoluteFill>
  );
};
