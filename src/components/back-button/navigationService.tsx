import { useNavigate } from 'react-router-dom';

export const History = {
  navigate: null as any,
  push: (path: string) => History.navigate(path),
};

export const NavigationSetter = () => {
  History.navigate = useNavigate();

  return null;
};
