import { Box, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';

export default function MenuHeader({ menuOptions, handleOnClick }) {
  return (
    <>
      <TabContext value={'1'}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onClick={e => handleOnClick({ route: e.target.attributes.route.value, value: e.target.name })}>
            {menuOptions.map((option, i) => (
              <Tab key={i} value={`${i}`} label={option.display} name={option.value} route={option.route} />
            ))}
          </TabList>
        </Box>
      </TabContext>
    </>
  );
}
