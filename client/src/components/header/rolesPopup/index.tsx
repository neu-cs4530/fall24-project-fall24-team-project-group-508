/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
} from '@mui/material';
import { Account } from '../../../types';
import { getAccounts, updateUserTypes } from '../../../services/accountService';

/**
 * OwnerPopup props
 */
interface OwnerPopupProps {
  onClose: () => void;
}

/**
 * Popup for managing user accounts with search functionality.
 *
 * @param {function} onClose - Callback to close the popup.
 */
const OwnerPopup: React.FC<OwnerPopupProps> = ({ onClose }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editedAccounts, setEditedAccounts] = useState<{ [key: string]: string }>({});

  // Fetch all accounts when the component mounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await getAccounts();
        setAccounts(data);
        setFilteredAccounts(data); // Initialize the filtered list
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  // Update the filtered accounts when the search query changes
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    setFilteredAccounts(
      accounts.filter(account => account.username.toLowerCase().includes(lowercasedQuery)),
    );
  }, [searchQuery, accounts]);

  // Handle changes to user types
  const handleUserTypeChange = (accountId: string, newType: string) => {
    setEditedAccounts(prev => ({
      ...prev,
      [accountId]: newType,
    }));
  };

  // Save the changes and update the database
  const handleSaveChanges = async () => {
    try {
      // Loop through the edited accounts and update each one
      const updatePromises = [];
      // eslint-disable-next-line guard-for-in
      for (const accountId in editedAccounts) {
        const newUserType = editedAccounts[accountId];
        // Call the updateUserTypes API to update the user type on the backend
        updatePromises.push(updateUserTypes(accountId, newUserType));
      }
      await Promise.all(updatePromises);

      // fetch the updated accounts to reflect changes immediately
      const data = await getAccounts();
      setAccounts(data);
      setFilteredAccounts(data);
      setEditedAccounts({});
      onClose();
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Manage User Accounts</DialogTitle>
      <DialogContent>
        {/* Search Field */}
        <TextField
          label='Search Users'
          variant='outlined'
          fullWidth
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          sx={{ marginBottom: '16px' }}
        />
        {/* User List */}
        <List>
          {filteredAccounts.map(account => (
            <ListItem key={account._id}>
              <ListItemText
                primary={account.username}
                secondary={`Type: ${account._id ? editedAccounts[account._id] || account.userType : account.userType}`}
              />
              <TextField
                select
                value={
                  account._id ? editedAccounts[account._id] || account.userType : account.userType
                }
                onChange={e => account._id && handleUserTypeChange(account._id, e.target.value)}
                SelectProps={{
                  native: true,
                }}
                variant='outlined'
                size='small'
                sx={{ width: '120px' }}>
                <option value='owner'>Owner</option>
                <option value='moderator'>Moderator</option>
                <option value='user'>User</option>
              </TextField>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='secondary'>
          Cancel
        </Button>
        <Button onClick={handleSaveChanges} color='primary'>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OwnerPopup;
