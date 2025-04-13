<template>
  <div class="dashboard-container">
    <h1 class="mb-4">Dashboard</h1>
    
    <!-- Tabs navigation -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <a class="nav-link" :class="{ active: activeTab === 'products' }" href="#" @click.prevent="setActiveTab('products')">
          Products
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: activeTab === 'categories' }" href="#" @click.prevent="setActiveTab('categories')">
          Categories
        </a>
      </li>
    </ul>
    
    <!-- Products Tab -->
    <div v-if="activeTab === 'products'">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Products</h2>
        <button class="btn btn-primary" @click="showAddProductModal = true">Add Product</button>
      </div>
      
      <div v-if="productsStore.loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      
      <div v-else-if="productsStore.error" class="alert alert-danger">
        {{ productsStore.error }}
      </div>
      
      <div v-else-if="productsStore.products.length === 0" class="alert alert-info">
        No products found. Add your first product!
      </div>
      
      <div v-else class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in productsStore.products" :key="product.id">
              <td>{{ product.id }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.description }}</td>
              <td>${{ product.price.toFixed(2) }}</td>
              <td>{{ getCategoryName(product.categoryId) }}</td>
              <td>
                <button class="btn btn-sm btn-outline-primary me-1" @click="editProduct(product)">
                  Edit
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="deleteProduct(product.id)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Categories Tab -->
    <div v-if="activeTab === 'categories'">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Categories</h2>
        <button class="btn btn-primary" @click="showAddCategoryModal = true">Add Category</button>
      </div>
      
      <div v-if="categoriesStore.loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      
      <div v-else-if="categoriesStore.error" class="alert alert-danger">
        {{ categoriesStore.error }}
      </div>
      
      <div v-else-if="categoriesStore.categories.length === 0" class="alert alert-info">
        No categories found. Add your first category!
      </div>
      
      <div v-else class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categoriesStore.categories" :key="category.id">
              <td>{{ category.id }}</td>
              <td>{{ category.name }}</td>
              <td>{{ category.description }}</td>
              <td>
                <button class="btn btn-sm btn-outline-primary me-1" @click="editCategory(category)">
                  Edit
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="deleteCategory(category.id)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Product Modal -->
    <div class="modal fade" :class="{ show: showAddProductModal || showEditProductModal }" tabindex="-1" 
         v-if="showAddProductModal || showEditProductModal" style="display: block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ showEditProductModal ? 'Edit Product' : 'Add Product' }}</h5>
            <button type="button" class="btn-close" @click="closeProductModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="showEditProductModal ? updateProductSubmit() : addProductSubmit()">
              <div class="mb-3">
                <label for="productName" class="form-label">Name</label>
                <input type="text" class="form-control" id="productName" v-model="productForm.name" required>
              </div>
              <div class="mb-3">
                <label for="productDescription" class="form-label">Description</label>
                <textarea class="form-control" id="productDescription" v-model="productForm.description" required></textarea>
              </div>
              <div class="mb-3">
                <label for="productPrice" class="form-label">Price</label>
                <input type="number" class="form-control" id="productPrice" v-model="productForm.price" required min="0" step="0.01">
              </div>
              <div class="mb-3">
                <label for="productCategory" class="form-label">Category</label>
                <select class="form-select" id="productCategory" v-model="productForm.categoryId" required>
                  <option value="" disabled>Select a category</option>
                  <option v-for="category in categoriesStore.categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeProductModal">Cancel</button>
                <button type="submit" class="btn btn-primary" :disabled="productsStore.loading">
                  <span v-if="productsStore.loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  {{ showEditProductModal ? 'Update' : 'Add' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Category Modal -->
    <div class="modal fade" :class="{ show: showAddCategoryModal || showEditCategoryModal }" tabindex="-1" 
         v-if="showAddCategoryModal || showEditCategoryModal" style="display: block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ showEditCategoryModal ? 'Edit Category' : 'Add Category' }}</h5>
            <button type="button" class="btn-close" @click="closeCategoryModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="showEditCategoryModal ? updateCategorySubmit() : addCategorySubmit()">
              <div class="mb-3">
                <label for="categoryName" class="form-label">Name</label>
                <input type="text" class="form-control" id="categoryName" v-model="categoryForm.name" required>
              </div>
              <div class="mb-3">
                <label for="categoryDescription" class="form-label">Description</label>
                <textarea class="form-control" id="categoryDescription" v-model="categoryForm.description" required></textarea>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeCategoryModal">Cancel</button>
                <button type="submit" class="btn btn-primary" :disabled="categoriesStore.loading">
                  <span v-if="categoriesStore.loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  {{ showEditCategoryModal ? 'Update' : 'Add' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal backdrop -->
    <div class="modal-backdrop fade show" 
         v-if="showAddProductModal || showEditProductModal || showAddCategoryModal || showEditCategoryModal"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useProductsStore } from '../stores/products';
import { useCategoriesStore } from '../stores/categories';

export default defineComponent({
  name: 'DashboardView',
  setup() {
    const productsStore = useProductsStore();
    const categoriesStore = useCategoriesStore();
    const activeTab = ref('products');
    
    // Product form
    const showAddProductModal = ref(false);
    const showEditProductModal = ref(false);
    const productForm = ref({
      id: 0,
      name: '',
      description: '',
      price: 0,
      categoryId: ''
    });
    
    // Category form
    const showAddCategoryModal = ref(false);
    const showEditCategoryModal = ref(false);
    const categoryForm = ref({
      id: 0,
      name: '',
      description: ''
    });
    
    // Load data on mount
    onMounted(async () => {
      await categoriesStore.fetchCategories();
      await productsStore.fetchProducts();
    });
    
    // Methods
    const setActiveTab = (tab: string) => {
      activeTab.value = tab;
    };
    
    const getCategoryName = (categoryId: number) => {
      const category = categoriesStore.categories.find(c => c.id === categoryId);
      return category ? category.name : 'Unknown';
    };
    
    // Product methods
    const closeProductModal = () => {
      showAddProductModal.value = false;
      showEditProductModal.value = false;
      resetProductForm();
    };
    
    const resetProductForm = () => {
      productForm.value = {
        id: 0,
        name: '',
        description: '',
        price: 0,
        categoryId: ''
      };
    };
    
    const editProduct = (product: any) => {
      productForm.value = { ...product };
      showEditProductModal.value = true;
    };
    
    const addProductSubmit = async () => {
      const success = await productsStore.createProduct({
        name: productForm.value.name,
        description: productForm.value.description,
        price: parseFloat(productForm.value.price as any),
        categoryId: parseInt(productForm.value.categoryId as any)
      });
      
      if (success) {
        closeProductModal();
      }
    };
    
    const updateProductSubmit = async () => {
      const success = await productsStore.updateProduct(productForm.value.id, {
        name: productForm.value.name,
        description: productForm.value.description,
        price: parseFloat(productForm.value.price as any),
        categoryId: parseInt(productForm.value.categoryId as any)
      });
      
      if (success) {
        closeProductModal();
      }
    };
    
    const deleteProduct = async (id: number) => {
      if (confirm('Are you sure you want to delete this product?')) {
        await productsStore.deleteProduct(id);
      }
    };
    
    // Category methods
    const closeCategoryModal = () => {
      showAddCategoryModal.value = false;
      showEditCategoryModal.value = false;
      resetCategoryForm();
    };
    
    const resetCategoryForm = () => {
      categoryForm.value = {
        id: 0,
        name: '',
        description: ''
      };
    };
    
    const editCategory = (category: any) => {
      categoryForm.value = { ...category };
      showEditCategoryModal.value = true;
    };
    
    const addCategorySubmit = async () => {
      const success = await categoriesStore.createCategory({
        name: categoryForm.value.name,
        description: categoryForm.value.description
      });
      
      if (success) {
        closeCategoryModal();
      }
    };
    
    const updateCategorySubmit = async () => {
      const success = await categoriesStore.updateCategory(categoryForm.value.id, {
        name: categoryForm.value.name,
        description: categoryForm.value.description
      });
      
      if (success) {
        closeCategoryModal();
      }
    };
    
    const deleteCategory = async (id: number) => {
      if (confirm('Are you sure you want to delete this category?')) {
        await categoriesStore.deleteCategory(id);
      }
    };
    
    return {
      activeTab,
      productsStore,
      categoriesStore,
      setActiveTab,
      getCategoryName,
      
      // Product
      showAddProductModal,
      showEditProductModal,
      productForm,
      closeProductModal,
      editProduct,
      addProductSubmit,
      updateProductSubmit,
      deleteProduct,
      
      // Category
      showAddCategoryModal,
      showEditCategoryModal,
      categoryForm,
      closeCategoryModal,
      editCategory,
      addCategorySubmit,
      updateCategorySubmit,
      deleteCategory
    };
  }
});
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style> 