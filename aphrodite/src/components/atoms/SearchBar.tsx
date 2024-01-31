import * as React from 'react';
import { Searchbar } from 'react-native-paper';
import Style from '../../styles/SearchBar.component.style';
import globalStyle from '../../styles/Global.styles';

interface Props {
  searchQuery:string, 
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  onFocus: () => void;
}

const SearchBar: React.FC<Props> = ({searchQuery, setSearchQuery, onFocus}) => {
  return (
    <Searchbar
      placeholder="Search..."
      onChangeText={(query: React.SetStateAction<string>) => setSearchQuery(query)}
      value={searchQuery}
      style={Style.bar}
      iconColor='#C5C5C6'
      placeholderTextColor='#C5C5C6'
      selectionColor={globalStyle.color.color}
      onFocus={onFocus}
    />
  );
};

export default SearchBar;