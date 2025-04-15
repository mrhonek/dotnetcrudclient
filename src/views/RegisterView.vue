<template>
  <div class="register-wrapper">
    <div class="register-container">
      <h2 class="register-title">Create Account</h2>
      
      <!-- Show API errors from the auth store -->
      <div v-if="authStore.error" class="alert alert-danger" role="alert">
        {{ authStore.error }}
      </div>

      <form @submit.prevent="register" class="register-form">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input 
              id="firstName" 
              v-model="firstName" 
              :class="{ 'is-error': firstNameError }" 
              type="text" 
              placeholder="Enter first name"
              @blur="validateFirstName" 
            />
            <div class="form-error" v-if="firstNameError">{{ firstNameError }}</div>
          </div>
          
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input 
              id="lastName" 
              v-model="lastName" 
              :class="{ 'is-error': lastNameError }" 
              type="text" 
              placeholder="Enter last name"
              @blur="validateLastName" 
            />
            <div class="form-error" v-if="lastNameError">{{ lastNameError }}</div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email" 
            v-model="email" 
            :class="{ 'is-error': emailError }" 
            type="email" 
            placeholder="Enter email"
            @blur="validateEmail" 
          />
          <div class="form-error" v-if="emailError">{{ emailError }}</div>
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password" 
            v-model="password" 
            :class="{ 'is-error': passwordError }" 
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
          
          <div class="form-error" v-if="passwordError">{{ passwordError }}</div>
          <small v-if="!passwordError" class="password-requirements">
            Password must be at least 8 characters with uppercase, lowercase, number, and special character.
          </small>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input 
            id="confirmPassword" 
            v-model="confirmPassword" 
            :class="{ 'is-error': confirmPasswordError }" 
            type="password" 
            placeholder="Confirm password"
            @input="validateConfirmPassword" 
            @blur="validateConfirmPassword" 
          />
          <div class="form-error" v-if="confirmPasswordError">{{ confirmPasswordError }}</div>
        </div>
        
        <button 
          type="submit" 
          class="register-button" 
          :disabled="!isFormValid || authStore.isLoading"
        >
          <span v-if="authStore.isLoading" class="button-spinner"></span>
          {{ authStore.isLoading ? 'Creating Account...' : 'Create Account' }}
        </button>
      
        <div class="login-link">
          Already have an account? <router-link to="/login">Sign in</router-link>
        </div>
      </form>
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
.register-wrapper {
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.register-container {
  width: 100%;
  max-width: 580px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 40px;
}

.register-title {
  color: #333;
  font-size: 28px;
  text-align: center;
  margin-bottom: 30px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.form-group label {
  font-weight: 500;
  color: #333;
  font-size: 16px;
}

.form-group input {
  padding: 14px 16px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #4a8eff;
  box-shadow: 0 0 0 3px rgba(74, 142, 255, 0.1);
}

.form-group input.is-error {
  border-color: #dc3545;
}

.form-error {
  color: #dc3545;
  font-size: 14px;
}

.password-requirements {
  color: #6c757d;
  font-size: 13px;
}

.alert {
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 24px;
}

.register-button {
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 14px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  position: relative;
}

.register-button:hover:not(:disabled) {
  background-color: #0b5ed7;
}

.register-button:active:not(:disabled) {
  transform: translateY(1px);
}

.register-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.button-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.7s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.login-link {
  text-align: center;
  font-size: 15px;
}

.login-link a {
  color: #0d6efd;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

/* Password strength styles */
.password-strength {
  margin-top: 8px;
  margin-bottom: 8px;
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
  font-size: 13px;
  font-weight: 500;
  margin-top: 4px;
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

@media (max-width: 576px) {
  .register-container {
    padding: 30px 20px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 24px;
  }
}
</style> 