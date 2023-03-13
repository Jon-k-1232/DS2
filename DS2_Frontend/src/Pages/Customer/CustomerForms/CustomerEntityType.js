import { RadioGroup, FormControl, FormControlLabel, Radio } from '@mui/material';

export default function CustomerEntityType({ selectedItems, setSelectedItems }) {
  const { customerEntityType } = selectedItems;

  return (
    <>
      <FormControl>
        <RadioGroup
          style={{ display: 'flex', flexDirection: 'row' }}
          value={customerEntityType}
          onChange={e => setSelectedItems(otherItems => ({ ...otherItems, customerEntityType: e.target.value }))}
        >
          <FormControlLabel value='individual' control={<Radio size='small' />} label='Individual' />
          <FormControlLabel value='business' control={<Radio size='small' />} label='Business' />
        </RadioGroup>
      </FormControl>
    </>
  );
}
