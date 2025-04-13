import { defineStore } from 'pinia';
import { productsApi } from '../services/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
}

interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
}

export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await productsApi.getAll();
        this.products = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch products';
        return [];
      } finally {
        this.loading = false;
      }
    },

    async fetchProductById(id: number) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await productsApi.getById(id);
        this.currentProduct = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch product';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async createProduct(product: Omit<Product, 'id'>) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await productsApi.create(product);
        this.products.push(response.data);
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to create product';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async updateProduct(id: number, product: Partial<Product>) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await productsApi.update(id, product);
        
        // Update the product in the products array
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
          this.products[index] = response.data;
        }
        
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to update product';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async deleteProduct(id: number) {
      this.loading = true;
      this.error = null;
      
      try {
        await productsApi.delete(id);
        this.products = this.products.filter(p => p.id !== id);
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to delete product';
        return false;
      } finally {
        this.loading = false;
      }
    }
  },
}); 