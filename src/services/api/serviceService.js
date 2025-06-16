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

export const serviceService = {
  async getAll() {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'customer', 'issue', 'status', 'technician', 'priority'],
        orderBy: [
          {
            FieldName: "CreatedOn",
            SortType: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('service', params);
      
      if (!response || !response.data) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching services:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      await delay(200);
      const apperClient = getApperClient();
      
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'customer', 'issue', 'status', 'technician', 'priority']
      };
      
      const response = await apperClient.getRecordById('service', parseInt(id), params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching service with ID ${id}:`, error);
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
            customer: item.customer || '',
            issue: item.issue || '',
            status: item.status || 'Pending',
            technician: item.technician || 'Not Assigned',
            priority: item.priority || 'Medium'
          }
        ]
      };
      
      const response = await apperClient.createRecord('service', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} service records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Service ticket created successfully!');
          return successfulRecords[0].data;
        }
      }
      
      throw new Error('Failed to create service ticket');
    } catch (error) {
      console.error("Error creating service:", error);
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
            customer: item.customer || '',
            issue: item.issue || '',
            status: item.status || 'Pending',
            technician: item.technician || 'Not Assigned',
            priority: item.priority || 'Medium'
          }
        ]
      };
      
      const response = await apperClient.updateRecord('service', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} service records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Service ticket updated successfully!');
          return successfulUpdates[0].data;
        }
      }
      
      throw new Error('Failed to update service ticket');
    } catch (error) {
      console.error("Error updating service:", error);
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
      
      const response = await apperClient.deleteRecord('service', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} service records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Service ticket deleted successfully!');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting service:", error);
      throw error;
    }
  }
};