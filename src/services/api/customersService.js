import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const customersService = {
  async getAll() {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'phone', 'email', 'total_spent', 'last_visit'],
        orderBy: [
          {
            FieldName: "Name",
            SortType: "ASC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('customers', params);
      
      if (!response || !response.data) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      await delay(200);
      const apperClient = getApperClient();
      
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'phone', 'email', 'total_spent', 'last_visit']
      };
      
      const response = await apperClient.getRecordById('customers', parseInt(id), params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer with ID ${id}:`, error);
      throw error;
    }
  },

  async create(item) {
    try {
      await delay(400);
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const params = {
        records: [
          {
            Name: item.Name || '',
            Tags: item.Tags || '',
            Owner: item.Owner || null,
            phone: item.phone || '',
            email: item.email || '',
            total_spent: Number(item.total_spent) || 0,
            last_visit: item.last_visit || new Date().toISOString().split('T')[0]
          }
        ]
      };
      
      const response = await apperClient.createRecord('customers', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} customer records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Customer created successfully!');
          return successfulRecords[0].data;
        }
      }
      
      throw new Error('Failed to create customer');
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  },

  async update(id, item) {
    try {
      await delay(400);
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: item.Name || '',
            Tags: item.Tags || '',
            Owner: item.Owner || null,
            phone: item.phone || '',
            email: item.email || '',
            total_spent: Number(item.total_spent) || 0,
            last_visit: item.last_visit || new Date().toISOString().split('T')[0]
          }
        ]
      };
      
      const response = await apperClient.updateRecord('customers', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} customer records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Customer updated successfully!');
          return successfulUpdates[0].data;
        }
      }
      
      throw new Error('Failed to update customer');
    } catch (error) {
      console.error("Error updating customer:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('customers', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} customer records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Customer deleted successfully!');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting customer:", error);
      throw error;
    }
  }
};