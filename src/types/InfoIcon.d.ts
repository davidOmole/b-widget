declare module '../components/InfoIcon' {
  import { ReactNode } from 'react';

  interface InfoIconProps {
    color?: string;
  }

  const InfoIcon: React.FC<InfoIconProps>;
  export default InfoIcon;
}
