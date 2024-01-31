export default interface OpenContextInterface {
  optionsOpen: boolean[];
  open: (index: number) => void;
  closeAllOptions: () => void;
  anyOpen: () => boolean;
}
