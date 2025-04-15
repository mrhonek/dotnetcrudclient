<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="title">Create Account</h1>
      
      <!-- Show API errors from the auth store -->
      <div v-if="authStore.error" class="error-alert">
        {{ authStore.error }}
      </div>

      <form @submit.prevent="register" class="register-form">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input 
              id="firstName" 
              v-model="firstName" 
              :class="{ 'input-error': firstNameError }" 
              type="text" 
              placeholder="Enter first name"
              @blur="validateFirstName" 
            />
            <span v-if="firstNameError" class="error-text">{{ firstNameError }}</span>
          </div>
          
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input 
              id="lastName" 
              v-model="lastName" 
              :class="{ 'input-error': lastNameError }" 
              type="text" 
              placeholder="Enter last name"
              @blur="validateLastName" 
            />
            <span v-if="lastNameError" class="error-text">{{ lastNameError }}</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email" 
            v-model="email" 
            :class="{ 'input-error': emailError }" 
            type="email" 
            placeholder="Enter email"
            @blur="validateEmail" 
          />
          <span v-if="emailError" class="error-text">{{ emailError }}</span>
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password" 
            v-model="password" 
            :class="{ 'input-error': passwordError }" 
            type="password" 
            placeholder="Create password"
            @input="validatePassword" 
            @blur="validatePassword" 
          />
          
          <div class="password-strength">
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
          
          <span v-if="passwordError" class="error-text">{{ passwordError }}</span>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input 
            id="confirmPassword" 
            v-model="confirmPassword" 
            :class="{ 'input-error': confirmPasswordError }" 
            type="password" 
            placeholder="Confirm password"
            @input="validateConfirmPassword" 
            @blur="validateConfirmPassword" 
          />
          <span v-if="confirmPasswordError" class="error-text">{{ confirmPasswordError }}</span>
        </div>
        
        <button 
          type="submit" 
          class="btn-primary" 
          :disabled="!isFormValid || authStore.isLoading"
        >
          <span v-if="authStore.isLoading" class="spinner"></span>
          {{ authStore.isLoading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>
      
      <div class="login-link">
        Already have an account? <router-link to="/login">Sign in</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
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

// Validation methods
const validateFirstName = () => {
  if (!firstName.value.trim()) {
    firstNameError.value = 'First name is required';
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
  lastNameError.value = '';
  return true;
};

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    emailError.value = 'Email is required';
    return false;
  } else if (!emailRegex.test(email.value.trim())) {
    emailError.value = 'Please enter a valid email address';
    return false;
  }
  emailError.value = '';
  return true;
};

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = 'Password is required';
    return false;
  } else if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters';
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
    !firstNameError.value && firstName.value.trim() !== '' &&
    !lastNameError.value && lastName.value.trim() !== '' &&
    !emailError.value && email.value.trim() !== '' &&
    !passwordError.value && password.value !== '' &&
    !confirmPasswordError.value && confirmPassword.value !== '' &&
    password.value === confirmPassword.value
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
    // Pass first name and last name directly to auth store
    const success = await authStore.register(
      firstName.value.trim(),
      lastName.value.trim(),
      email.value.trim(),
      password.value
    );
    
    if (success) {
      router.push('/');
    }
  } catch (error) {
    // Error is handled by the auth store
    console.error('Registration failed:', error);
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 1rem;
}

.register-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
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
}

.form-group {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: 0.5rem;
}

label {
  font-size: 0.9rem;
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

.password-strength {
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
}

.strength-meter {
  height: 0.4rem;
  background-color: #edf2f7;
  border-radius: 2px;
  overflow: hidden;
}

.strength-value {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s, background-color 0.3s;
}

.strength-value.weak {
  background-color: #f56565;
}

.strength-value.medium {
  background-color: #ed8936;
}

.strength-value.strong {
  background-color: #48bb78;
}

.strength-text {
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.25rem;
  display: inline-block;
}

.strength-text.weak {
  color: #e53e3e;
}

.strength-text.medium {
  color: #dd6b20;
}

.strength-text.strong {
  color: #38a169;
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