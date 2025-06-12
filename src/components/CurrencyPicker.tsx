import { Box, Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
import { useState } from 'react';

interface CurrencyPickerProps {
  usersCurrencies: string[];
  currentCurrency: string;
  setCurrency: (currency: string) => void;
}

const CurrencyPicker = ({ usersCurrencies, currentCurrency, setCurrency }: CurrencyPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCurrencyChange = (currency: string) => {
    setCurrency(currency);
    setIsOpen(false);
  };

  return (
    <Menu isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <MenuButton
        as={Button}
        onClick={() => setIsOpen(!isOpen)}
        size="sm"
        variant="outline"
        style={{
          padding: '8px 16px',
          backgroundColor: 'white',
          border: '1px solid #E2E8F0',
          borderRadius: '6px',
          fontSize: '14px',
          cursor: 'pointer',
        }}
      >
        {currentCurrency || 'Select Currency'}
      </MenuButton>
      <MenuList>
        {usersCurrencies?.map(currency => (
          <MenuItem
            key={currency}
            onClick={() => handleCurrencyChange(currency)}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
            }}
          >
            {currency}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default CurrencyPicker;
