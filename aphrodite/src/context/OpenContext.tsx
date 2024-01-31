import * as React from 'react';
import OpenContextInterface from '../interfaces/OpenContext.interface';

const OpenContext = React.createContext<OpenContextInterface>({
  optionsOpen: [] as boolean[],
  open: (index: number) => {},
  closeAllOptions: () => {},
  anyOpen: () => false,
});

export default OpenContext;
