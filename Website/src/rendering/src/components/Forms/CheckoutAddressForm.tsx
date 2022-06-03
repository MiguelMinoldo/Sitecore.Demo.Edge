import { DBuyerAddress } from '../../models/ordercloud/DBuyerAddress';
import { FormEvent, useState } from 'react';
import Spinner from '../../components/ShopCommon/Spinner';
import AddressForm, { OnAddressChangeEvent } from './AddressForm';

type CheckoutAddressFormProps = {
  address?: DBuyerAddress;
  onSubmit?: (address: DBuyerAddress, saveToAddressBook: boolean) => void;
  isEditing?: boolean;
  onCancelEdit?: () => void;
  loading?: boolean;
  showSaveToAddressBook?: boolean;
  prefix?: string; // needed when more that one form on checkout page
};

const CheckoutAddressForm = (props: CheckoutAddressFormProps): JSX.Element => {
  const [addressName, setAddressName] = useState(props?.address?.AddressName || '');
  const [saveToAddressBook, setSaveToAddressBook] = useState(false);
  const [address, setAddress] = useState(props?.address);
  const [isAddressValid, setIsAddressValid] = useState(false);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (props.onSubmit) {
      const fullAddress = { ...address, AddressName: addressName };
      props.onSubmit(fullAddress, saveToAddressBook);
    }
  };

  const cancelEditButton = props.isEditing && (
    <button className="cancel-edit" onClick={props.onCancelEdit}>
      Cancel
    </button>
  );

  const idPrefix = props.prefix ? `${props.prefix}-` : '';

  const saveToAddressBookInput = props.showSaveToAddressBook && (
    <div className="checkbox-field">
      <input
        type="checkbox"
        id={`${idPrefix}saveToAddressBook`}
        onChange={() => setSaveToAddressBook(!saveToAddressBook)}
        checked={saveToAddressBook}
      />
      <label htmlFor={`${idPrefix}saveToAddressBook`}>Save to address book</label>
    </div>
  );

  const handleAddressFormChange = (changes: OnAddressChangeEvent) => {
    setAddress(changes.address);
    setIsAddressValid(changes.isValid);
  };

  const addressNameLabel = saveToAddressBook ? 'Address Name' : 'Address Name (Optional)';

  return (
    <form onSubmit={handleFormSubmit} className="form">
      <div>
        <label htmlFor={`${idPrefix}addressName`}>{addressNameLabel}</label>
        <input
          type="text"
          placeholder="Address Name"
          id={`${idPrefix}addressName`}
          maxLength={100}
          onChange={(e) => setAddressName(e.target.value)}
          value={addressName}
          required={saveToAddressBook}
        />
      </div>
      <AddressForm
        address={props.address}
        loading={props.loading}
        onChange={handleAddressFormChange}
      />
      {saveToAddressBookInput}
      <div className="button-area">
        <button
          className="btn--main btn--main--round"
          type="submit"
          disabled={!isAddressValid || (!addressName && saveToAddressBook) || props.loading}
        >
          <Spinner loading={props.loading} /> Save Address
        </button>
        {cancelEditButton}
      </div>
    </form>
  );
};

export default CheckoutAddressForm;