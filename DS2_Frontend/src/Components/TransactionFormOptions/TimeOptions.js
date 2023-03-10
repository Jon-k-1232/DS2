import { useState } from 'react';
import { Stack, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { sixMinuteIncrementTimeCalculation } from './TimeTrackingIncrements';
import dayjs from 'dayjs';

export default function TimeOptions({ selectedItems, setSelectedItems }) {
  const { selectedTeamMember, isTransactionBillable } = selectedItems;

  const [minutes, setMinutes] = useState('');
  const [startTime, setStartTime] = useState(dayjs().format());
  const [endTime, setEndTime] = useState(dayjs().format());

  const handleTimeCalculation = minuteDuration => {
    if (Object.keys(selectedTeamMember) && minuteDuration) {
      const loggedTime = sixMinuteIncrementTimeCalculation(startTime, endTime, minuteDuration);
      const employeeRate = selectedTeamMember.rate;
      setSelectedItems(otherItems => ({ ...otherItems, quantity: loggedTime, unitCost: employeeRate }));
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 8 }}>
          <TextField
            variant='standard'
            type='number'
            label='Time In Minutes'
            value={minutes}
            onChange={e => {
              // If user insert time on clock, then changes mind, reset time clock options
              setStartTime(dayjs().format());
              setEndTime(dayjs().format());
              setMinutes(e.target.value);
              handleTimeCalculation(e.target.value);
            }}
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 8 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isTransactionBillable}
                onChange={e => setSelectedItems(otherItems => ({ ...otherItems, isTransactionBillable: e.target.checked }))}
              />
            }
            label='Billable'
          />
        </Stack>
      </Stack>
    </>
  );
}
