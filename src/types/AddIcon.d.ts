declare module '../components/AddIcon' {
  import { ReactNode } from 'react';

  interface AddIconProps {
    boxSize?: string;
  }

  const AddIcon: React.FC<AddIconProps>;
  export default AddIcon;
}
