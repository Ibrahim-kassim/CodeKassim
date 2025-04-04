import { useQuery } from "@tanstack/react-query";
import { useGenericEditHook } from "../hooks/useGenericEditHook";
import api from "../AppServices/initApi";
import { ENTITIES } from "../models/entities";

interface ApiResponse<T> {
  data: T[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

// Get all contacts
export function useAllContacts() {
  return useQuery({
    queryKey: [ENTITIES.ALL_CONTACTS],
    queryFn: async () => {
      const response = await api.getContacts();
      return response;
    }
  });
}

// Create contact
export function useCreateContact() {
  const query = useGenericEditHook(
    api.createContact.bind(api),
    ENTITIES.ADD_CONTACT
  );
  return query;
}

// Update contact
export function useUpdateContact() {
  const query = useGenericEditHook(
    api.updateContact.bind(api),
    ENTITIES.UPDATE_CONTACT
  );
  return query;
}

// Delete contact
export function useDeleteContact() {
  return useGenericEditHook<{ contactId: string }, { message: string }>(
    async (payload) => api.deleteContact(payload.contactId),
    ENTITIES.DELETE_CONTACT,
    {
      successMessage: 'Contact deleted successfully',
      errorMessage: 'Failed to delete contact'
    }
  );
}

// Read message
export function useReadMessage() {
  return useGenericEditHook<{ contactId: string, messageIndex: number }, { message: string }>(
    async (payload) => api.readMessage(payload.contactId, payload.messageIndex),
    ENTITIES.READ_MESSAGE,
    {
      successMessage: 'Message marked as read',
      errorMessage: 'Failed to mark message as read'
    }
  );
}

// Delete message
export function useDeleteMessage() {
  return useGenericEditHook<{ contactId: string, messageIndex: number }, { message: string }>(
    async (payload) => api.deleteMessage(payload.contactId, payload.messageIndex),
    ENTITIES.DELETE_MESSAGE,
    {
      successMessage: 'Message deleted successfully',
      errorMessage: 'Failed to delete message'
    }
  );
}
