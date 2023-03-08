import { Box, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { useEffect, useState } from 'react';

/**
 * Using prior menu items to compare against incoming menu Item to check for change.
 * The issue is when a pagination is on value equal to 3, but then changes to a smaller menu Option array.
 * By checking to see if the arrays change, the value can be reset to 0, therefore avoiding the error.
 */
export default function MenuHeader({ menuOptions, onClickNavigation }) {
  const [value, setValue] = useState('0');
  const [priorMenuOptions, setPriorMenuOptions] = useState([]);

  useEffect(() => {
    setValue('0');
    setPriorMenuOptions(menuOptions);
    // eslint-disable-next-line
  }, [menuOptions.length]);

  return menuOptions.length ? (
    <>
      {/* Using prior menu items to compare against incoming menu Item to check for change.  */}
      <TabContext value={priorMenuOptions === menuOptions ? value : '0'}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            onChange={(e, val) => {
              onClickNavigation({ route: e.target.attributes.route.value, value: e.target.name });
              setValue(val);
            }}
          >
            {menuOptions.map((option, i) => (
              <Tab key={i} value={`${i}`} label={option.display} name={option.value} route={option.route} />
            ))}
          </TabList>
        </Box>
      </TabContext>
    </>
  ) : (
    ''
  );
}
