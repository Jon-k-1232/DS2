const express = require('express');
const jsonParser = express.json();
const { sanitizeFields } = require('../../utils');
const writeOffsRouter = express.Router();
const writeOffsService = require('./writeOffs-service');
const { restoreDataTypesWriteOffsTableOnCreate, restoreDataTypesWriteOffsTableOnUpdate } = require('./writeOffsObjects');
const { createGrid } = require('../../helperFunctions/helperFunctions');
const { unableToCompleteRequest } = require('../../serverResponses/errors');

// Create a new WriteOff
writeOffsRouter.route('/createWriteOffs/:accountID/:userID').post(jsonParser, async (req, res) => {
  const db = req.app.get('db');
  const { accountID } = req.params;

  try {
    const sanitizedNewWriteOffs = sanitizeFields(req.body.writeOff);

    // Create new object with sanitized fields
    const writeOffTableFields = restoreDataTypesWriteOffsTableOnCreate(sanitizedNewWriteOffs);

    // Post new writeOff
    await writeOffsService.createWriteOff(db, writeOffTableFields);

    sendUpdatedTableWith200Response(db, res, accountID);
  } catch (err) {
    console.log(err);
    res.send({
      message: err.message || 'An error occurred while creating the writeOff.',
      status: 500
    });
  }
});

// Get a single WriteOff
writeOffsRouter.route('/getSingleWriteOff/:writeOffID/:accountID/:userID').get(async (req, res) => {
  const db = req.app.get('db');
  const { writeOffID, accountID } = req.params;

  const activeWriteOffs = await writeOffsService.getSingleWriteOff(db, writeOffID, accountID);

  // Return Object
  const activeWriteOffsData = {
    activeWriteOffs,
    grid: createGrid(activeWriteOffs)
  };

  res.send({
    activeWriteOffsData,
    message: 'Successfully retrieved single writeOff.',
    status: 200
  });
});

// update a writeOff
writeOffsRouter.route('/updateWriteOffs/:accountID/:userID').put(jsonParser, async (req, res) => {
  const db = req.app.get('db');
  try {
    const sanitizedUpdatedWriteOffs = sanitizeFields(req.body.writeOff);

    // Create new object with sanitized fields
    const writeOffTableFields = restoreDataTypesWriteOffsTableOnUpdate(sanitizedUpdatedWriteOffs);
    const { customer_invoice_id, account_id } = writeOffTableFields;

    // If payment is attached to an invoice, do not allow delete
    if (customer_invoice_id) {
      const reason = 'Record is attached to an invoice and cannot be deleted or modified.';
      unableToCompleteRequest(res, reason, 423);
      return;
    }

    // Update writeOff
    await writeOffsService.updateWriteOff(db, writeOffTableFields);

    sendUpdatedTableWith200Response(db, res, account_id);
  } catch (err) {
    console.log(err);
    res.send({
      message: err.message || 'An error occurred while updating the writeOff.',
      status: 500
    });
  }
});

// delete a writeOff
writeOffsRouter.route('/deleteWriteOffs/:accountID/:userID').delete(async (req, res) => {
  const db = req.app.get('db');

  try {
    const sanitizedUpdatedWriteOffs = sanitizeFields(req.body.writeOff);

    // Create new object with sanitized fields
    const writeOffTableFields = restoreDataTypesWriteOffsTableOnUpdate(sanitizedUpdatedWriteOffs);
    const { customer_invoice_id, writeoff_id, account_id } = writeOffTableFields;

    // If write off is attached to an invoice, do not allow delete
    if (customer_invoice_id) {
      const reason = 'Write off is attached to an invoice and cannot be deleted.';
      unableToCompleteRequest(res, reason, 423);
      return;
    }

    // Delete writeOff
    await writeOffsService.deleteWriteOff(db, writeoff_id, account_id);
    sendUpdatedTableWith200Response(db, res, account_id);
  } catch (err) {
    console.log(err);
    res.send({
      message: err.message || 'An error occurred while deleting the Retainer.',
      status: 500
    });
  }
});

module.exports = writeOffsRouter;

const sendUpdatedTableWith200Response = async (db, res, accountID) => {
  // Get all writeOff
  const activeWriteOffs = await writeOffsService.getActiveWriteOffs(db, accountID);

  // Return Object
  const activeWriteOffsData = {
    activeWriteOffs,
    grid: createGrid(activeWriteOffs)
  };

  res.send({
    writeOffsList: { activeWriteOffsData },
    message: 'Successfully deleted writeOff.',
    status: 200
  });
};
