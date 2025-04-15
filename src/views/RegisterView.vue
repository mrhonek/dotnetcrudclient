<template>
  <div class="row justify-content-center my-5">
    <div class="col-md-9 col-lg-8 col-xl-7">
      <div class="card shadow">
        <div class="card-body p-5">
          <h2 class="text-center mb-4">Create Account</h2>
          
          <!-- Show API errors from the auth store -->
          <div v-if="authStore.error" class="alert alert-danger" role="alert">
            {{ authStore.error }}
          </div>

          <form @submit.prevent="register" class="register-form">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="firstName" class="form-label">First Name</label>
                <input 
                  id="firstName" 
                  v-model="firstName" 
                  class="form-control"
                  :class="{ 'is-invalid': firstNameError }" 
                  type="text" 
                  placeholder="Enter first name"
                  @blur="validateFirstName" 
                />
                <div class="invalid-feedback" v-if="firstNameError">{{ firstNameError }}</div>
              </div>
              
              <div class="col-md-6 mb-3">
                <label for="lastName" class="form-label">Last Name</label>
                <input 
                  id="lastName" 
                  v-model="lastName" 
                  class="form-control"
                  :class="{ 'is-invalid': lastNameError }" 
                  type="text" 
                  placeholder="Enter last name"
                  @blur="validateLastName" 
                />
                <div class="invalid-feedback" v-if="lastNameError">{{ lastNameError }}</div>
              </div>
            </div>
            
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input 
                id="email" 
                v-model="email" 
                class="form-control"
                :class="{ 'is-invalid': emailError }" 
                type="email" 
                placeholder="Enter email"
                @blur="validateEmail" 
              />
              <div class="invalid-feedback" v-if="emailError">{{ emailError }}</div>
            </div>
            
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input 
                id="password" 
                v-model="password" 
                class="form-control"
                :class="{ 'is-invalid': passwordError }" 
                type="password" 
                placeholder="Create password"
                @input="validatePassword" 
                @blur="validatePassword" 
              />
              
              <div class="password-strength mt-2">
                <div class="strength-meter">
                  <div 
                    class="strength-value" 
                    :class="passwordStrengthClass" 
                    :style="{ width: `${passwordStrength}%` }"
                  ></div>
                </div>
                <span class="strength-text" :class="passwordStrengthClass">
                  {{ passwordStrengthText }}
                </span>
              </div>
              
              <div class="invalid-feedback" v-if="passwordError">{{ passwordError }}</div>
              <small v-if="!passwordError" class="form-text text-muted">
                Password must be at least 8 characters with uppercase, lowercase, number, and special character.
              </small>
            </div>
            
            <div class="mb-4">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <input 
                id="confirmPassword" 
                v-model="confirmPassword" 
                class="form-control"
                :class="{ 'is-invalid': confirmPasswordError }" 
                type="password" 
                placeholder="Confirm password"
                @input="validateConfirmPassword" 
                @blur="validateConfirmPassword" 
              />
              <div class="invalid-feedback" v-if="confirmPasswordError">{{ confirmPasswordError }}</div>
            </div>
            
            <button 
              type="submit" 
              class="btn btn-primary w-100" 
              :disabled="!isFormValid || authStore.isLoading"
            >
              <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              {{ authStore.isLoading ? 'Creating Account...' : 'Create Account' }}
            </button>
          </form>
          
          <div class="mt-3 text-center">
            Already have an account? <router-link to="/login">Sign in</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Form fields
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

// Validation error messages
const firstNameError = ref('');
const lastNameError = ref('');
const emailError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');

// Clear auth errors when component mounts or is revisited
onMounted(() => {
  authStore.clearError();
});

// Validation methods
const validateFirstName = () => {
  if (!firstName.value.trim()) {
    firstNameError.value = 'First name is required';
    return false;
  }
  
  if (firstName.value.trim().length > 50) {
    firstNameError.value = 'First name must be less than 50 characters';
    return false;
  }
  
  firstNameError.value = '';
  return true;
};

const validateLastName = () => {
  if (!lastName.value.trim()) {
    lastNameError.value = 'Last name is required';
    return false;
  }
  
  if (lastName.value.trim().length > 50) {
    lastNameError.value = 'Last name must be less than 50 characters';
    return false;
  }
  
  lastNameError.value = '';
  return true;
};

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValue = email.value.trim().toLowerCase();
  
  if (!emailValue) {
    emailError.value = 'Email is required';
    return false;
  } else if (!emailRegex.test(emailValue)) {
    emailError.value = 'Please enter a valid email address';
    return false;
  } else if (emailValue.length > 100) {
    emailError.value = 'Email must be less than 100 characters';
    return false;
  }
  
  emailError.value = '';
  return true;
};

const validatePassword = () => {
  // Match ASP.NET Core FluentValidation rules
  if (!password.value) {
    passwordError.value = 'Password is required';
    return false;
  } else if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters';
    return false;
  } else if (password.value.length > 100) {
    passwordError.value = 'Password must be less than 100 characters';
    return false;
  } else if (!/[A-Z]/.test(password.value)) {
    passwordError.value = 'Password must contain at least 1 uppercase letter';
    return false;
  } else if (!/[a-z]/.test(password.value)) {
    passwordError.value = 'Password must contain at least 1 lowercase letter'; 
    return false;
  } else if (!/[0-9]/.test(password.value)) {
    passwordError.value = 'Password must contain at least 1 number';
    return false;
  } else if (!/[^a-zA-Z0-9]/.test(password.value)) {
    passwordError.value = 'Password must contain at least 1 special character';
    return false;
  }
  
  passwordError.value = '';
  return true;
};

const validateConfirmPassword = () => {
  if (!confirmPassword.value) {
    confirmPasswordError.value = 'Please confirm your password';
    return false;
  } else if (confirmPassword.value !== password.value) {
    confirmPasswordError.value = 'Passwords do not match';
    return false;
  }
  
  confirmPasswordError.value = '';
  return true;
};

// Password strength
const calculatePasswordStrength = (pw: string): number => {
  if (!pw) return 0;
  
  let score = 0;
  
  // Length check
  if (pw.length >= 8) score += 20;
  if (pw.length >= 12) score += 10;
  
  // Character variety checks
  if (/[A-Z]/.test(pw)) score += 15; // Has uppercase
  if (/[a-z]/.test(pw)) score += 15; // Has lowercase
  if (/[0-9]/.test(pw)) score += 15; // Has numbers
  if (/[^A-Za-z0-9]/.test(pw)) score += 25; // Has special chars
  
  return Math.min(score, 100);
};

const passwordStrength = computed(() => calculatePasswordStrength(password.value));

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value;
  if (strength < 40) return 'weak';
  if (strength < 70) return 'medium';
  return 'strong';
});

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value;
  if (strength < 40) return 'Weak';
  if (strength < 70) return 'Medium';
  return 'Strong';
});

// Form validation
const isFormValid = computed(() => {
  return (
    validateFirstName() &&
    validateLastName() &&
    validateEmail() &&
    validatePassword() &&
    validateConfirmPassword()
  );
});

// Form submission
const register = async () => {
  // Clear any previous errors
  authStore.clearError();
  
  // Validate all fields
  const isFirstNameValid = validateFirstName();
  const isLastNameValid = validateLastName();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isConfirmPasswordValid = validateConfirmPassword();
  
  if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
    return;
  }
  
  try {
    const success = await authStore.register(
      firstName.value.trim(),
      lastName.value.trim(),
      email.value.trim().toLowerCase(),
      password.value
    );
    
    if (success) {
      router.push('/');
    }
  } catch (error) {
    // Error handling is already done in the auth store
    console.error('Registration failed:', error);
    
    // Focus on the first input with an error
    if (firstNameError.value) {
      document.getElementById('firstName')?.focus();
    } else if (lastNameError.value) {
      document.getElementById('lastName')?.focus();
    } else if (emailError.value) {
      document.getElementById('email')?.focus();
    } else if (passwordError.value) {
      document.getElementById('password')?.focus();
    } else if (confirmPasswordError.value) {
      document.getElementById('confirmPassword')?.focus();
    }
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 150px);
  padding: 40px 0;
}

.register-card {
  width: 100%;
  max-width: 600px;
  padding: 2.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1.title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-weight: 600;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

@media (max-width: 576px) {
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .register-card {
    padding: 1.5rem;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: 0.5rem;
}

label {
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

input {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.input-error {
  border-color: #dc3545;
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.error-text {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.password-requirements {
  color: #718096;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.btn-primary {
  background-color: #4361ee;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 0.5rem;
}

.btn-primary:hover:not(:disabled) {
  background-color: #3a56d4;
}

.btn-primary:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #4a5568;
}

.login-link a {
  color: #4361ee;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

.error-alert {
  background-color: #fff5f5;
  border: 1px solid #fed7d7;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  color: #c53030;
  font-size: 0.9rem;
}

/* Password strength styles */
.password-strength {
  margin-top: 0.5rem;
}

.strength-meter {
  height: 5px;
  background-color: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
}

.strength-value {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s, background-color 0.3s;
}

.strength-value.weak {
  background-color: #dc3545;
}

.strength-value.medium {
  background-color: #ffc107;
}

.strength-value.strong {
  background-color: #28a745;
}

.strength-text {
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.25rem;
  display: inline-block;
}

.strength-text.weak {
  color: #dc3545;
}

.strength-text.medium {
  color: #ffc107;
}

.strength-text.strong {
  color: #28a745;
}

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style> 