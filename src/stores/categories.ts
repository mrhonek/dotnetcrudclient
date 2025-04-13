import { defineStore } from 'pinia';
import { categoriesApi } from '../services/api';

interface Category {
  id: number;
  name: string;
  description: string;
}

interface CategoriesState {
  categories: Category[];
  currentCategory: Category | null;
  loading: boolean;
  error: string | null;
}

export const useCategoriesStore = defineStore('categories', {
  state: (): CategoriesState => ({
    categories: [],
    currentCategory: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchCategories() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await categoriesApi.getAll();
        this.categories = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch categories';
        return [];
      } finally {
        this.loading = false;
      }
    },

    async fetchCategoryById(id: number) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await categoriesApi.getById(id);
        this.currentCategory = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch category';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async createCategory(category: Omit<Category, 'id'>) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await categoriesApi.create(category);
        this.categories.push(response.data);
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to create category';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async updateCategory(id: number, category: Partial<Category>) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await categoriesApi.update(id, category);
        
        // Update the category in the categories array
        const index = this.categories.findIndex(c => c.id === id);
        if (index !== -1) {
          this.categories[index] = response.data;
        }
        
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to update category';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async deleteCategory(id: number) {
      this.loading = true;
      this.error = null;
      
      try {
        await categoriesApi.delete(id);
        this.categories = this.categories.filter(c => c.id !== id);
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to delete category';
        return false;
      } finally {
        this.loading = false;
      }
    }
  },
}); 