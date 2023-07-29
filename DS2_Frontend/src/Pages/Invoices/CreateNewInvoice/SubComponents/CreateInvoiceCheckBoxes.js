import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function CreateInvoiceCheckBoxes({ selectedItems, setSelectedItems }) {
  const { showWriteOffs, isRoughDraft, isFinalized, isCsvOnly } = selectedItems;

  const handleCheckboxChange = event => {
    const { name, checked } = event.target;

    let updatedSelectedItems = { ...selectedItems, [name]: checked };

    if (name === 'isFinalized' && checked) {
      // If 'Lock And Finalize Selected Invoices' is checked, uncheck 'Create Rough Draft PDFs' and 'Create CSV Only'
      updatedSelectedItems = { ...updatedSelectedItems, isRoughDraft: false, isCsvOnly: false };
    } else if ((name === 'isRoughDraft' || name === 'isCsvOnly') && checked) {
      // If either 'Create Rough Draft PDFs' or 'Create CSV Only' is checked, uncheck 'Lock And Finalize Selected Invoices'
      updatedSelectedItems = { ...updatedSelectedItems, isFinalized: false };
    }

    setSelectedItems(updatedSelectedItems);
  };

  return (
    <>
      <FormGroup row>
        <FormControlLabel
          control={<Checkbox checked={showWriteOffs} onChange={handleCheckboxChange} name='showWriteOffs' />}
          label='Show Write Offs'
        />
        <FormControlLabel
          control={<Checkbox checked={isRoughDraft} onChange={handleCheckboxChange} name='isRoughDraft' />}
          label='Create Rough Draft PDFs'
        />
        <FormControlLabel
          control={<Checkbox checked={isFinalized} onChange={handleCheckboxChange} name='isFinalized' />}
          label='Lock And Finalize Selected Invoices'
        />
        <FormControlLabel
          control={<Checkbox checked={isCsvOnly} onChange={handleCheckboxChange} name='isCsvOnly' />}
          label='Create CSV Only'
        />
      </FormGroup>
    </>
  );
}
