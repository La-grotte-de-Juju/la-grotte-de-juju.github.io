declare module 'lottie-react' {
  import * as React from 'react';
  interface LottieProps {
  animationData: unknown;
    loop?: boolean;
    autoplay?: boolean;
    style?: React.CSSProperties;
    className?: string;
  }
  const Lottie: React.FC<LottieProps>;
  export default Lottie;
}
