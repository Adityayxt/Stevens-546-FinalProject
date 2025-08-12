document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.querySelector('#registerForm');
  const loginForm = document.querySelector('#loginForm');
  const skillForm = document.querySelector('#skillForm');
  const editSkillForm = document.querySelector('#editSkillForm');
  const commentForm = document.querySelector('#commentForm');
  
  if (registerForm) {
    initializeRegisterValidation(registerForm);
  } else if (loginForm) {
    initializeLoginValidation(loginForm);
  } else if (skillForm) {
    initializeSkillValidation(skillForm);
  } else if (editSkillForm) {
    initializeEditSkillValidation(editSkillForm);
  } else if (commentForm) {
    initializeCommentValidation(commentForm);
  } else {
    // Fallback for other forms
    const genericForm = document.querySelector('form');
    if (genericForm) {
      genericForm.addEventListener('submit', (e) => {
       
        let hasEmptyField = false;
        const inputs = genericForm.querySelectorAll('input, textarea');
        
      
        const existingError = genericForm.querySelector('.form-error');
        if (existingError) {
          existingError.remove();
        }
        
        for (let input of inputs) {
         
          if (input.disabled || input.id === 'contact' || input.name === 'contact') {
            continue;
          }
          
          if (input.value.trim() === '') {
            hasEmptyField = true;
           
            input.classList.add('error-input');
           
            if (!document.querySelector('.error-input:focus')) {
              input.focus();
            }
          } else {
          
            input.classList.remove('error-input');
          }
        }
        
        if (hasEmptyField) {
        
          const errorElement = document.createElement('div');
          errorElement.className = 'form-error';
          errorElement.style.color = 'red';
          errorElement.style.fontSize = '14px';
          errorElement.style.marginBottom = '10px';
          errorElement.textContent = 'Please fill in all required fields.';
          
       
          if (genericForm.firstChild) {
            genericForm.insertBefore(errorElement, genericForm.firstChild);
          } else {
            genericForm.appendChild(errorElement);
          }
          
          e.preventDefault();
          return false;
        }
      });
    }
    return;
  }

  // Common validation functions
  function showError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.style.display = message ? 'block' : 'none';
  }

  function clearError(errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }

  function validateRequired(value, fieldName) {
    if (!value || value.trim() === '') {
      return `${fieldName} is required`;
    }
    return '';
  }

  // Login form validation
  function initializeLoginValidation(form) {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');

    // Real-time validation for login
    usernameInput.addEventListener('blur', () => {
      const error = validateRequired(usernameInput.value, 'Username');
      showError(usernameError, error);
    });

    usernameInput.addEventListener('input', () => {
      if (usernameError.textContent) {
        const error = validateRequired(usernameInput.value, 'Username');
        showError(usernameError, error);
      }
    });

    passwordInput.addEventListener('blur', () => {
      const error = validateRequired(passwordInput.value, 'Password');
      showError(passwordError, error);
    });

    passwordInput.addEventListener('input', () => {
      if (passwordError.textContent) {
        const error = validateRequired(passwordInput.value, 'Password');
        showError(passwordError, error);
      }
    });

    // Form submission validation for login
    form.addEventListener('submit', (e) => {
      const usernameErr = validateRequired(usernameInput.value, 'Username');
      const passwordErr = validateRequired(passwordInput.value, 'Password');

      showError(usernameError, usernameErr);
      showError(passwordError, passwordErr);

      if (usernameErr || passwordErr) {
        e.preventDefault();
        return false;
      }
    });
  }

  // Register form validation
  function initializeRegisterValidation(form) {

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email');
    
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const emailError = document.getElementById('emailError');

    // Validation functions for registration
    function validateUsername(username) {
      if (!username || username.trim() === '') {
        return 'Username is required';
      }
      if (username.length < 3 || username.length > 20) {
        return 'Username must be 3-20 characters';
      }
      if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return 'Username may contain letters or numbers';
      }
      return '';
    }

    function validatePassword(password) {
      if (!password || password.trim() === '') {
        return 'Password is required';
      }
      if (password.length < 4) {
        return 'Password must be at least 4 characters';
      }
      if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
      }
      if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
      }
      if (!/\d/.test(password)) {
        return 'Password must contain at least one number';
      }
      return '';
    }

    function validateEmail(email) {
      if (!email || email.trim() === '') {
        return 'Email is required';
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Please enter a valid email address';
      }
      return '';
    }

    // Real-time validation for registration
    usernameInput.addEventListener('blur', () => {
      const error = validateUsername(usernameInput.value);
      showError(usernameError, error);
    });

    usernameInput.addEventListener('input', () => {
      
      const error = validateUsername(usernameInput.value);
      showError(usernameError, error);
    });

    passwordInput.addEventListener('blur', () => {
      const error = validatePassword(passwordInput.value);
      showError(passwordError, error);
    });

    passwordInput.addEventListener('input', () => {
      
      const error = validatePassword(passwordInput.value);
      showError(passwordError, error);
    });

    emailInput.addEventListener('blur', () => {
      const error = validateEmail(emailInput.value);
      showError(emailError, error);
    });

    emailInput.addEventListener('input', () => {
      
      const error = validateEmail(emailInput.value);
      showError(emailError, error);
    });

    // Form submission validation for registration
    form.addEventListener('submit', (e) => {
      const usernameErr = validateUsername(usernameInput.value);
      const passwordErr = validatePassword(passwordInput.value);
      const emailErr = validateEmail(emailInput.value);

      showError(usernameError, usernameErr);
      showError(passwordError, passwordErr);
      showError(emailError, emailErr);

      if (usernameErr || passwordErr || emailErr) {
        e.preventDefault();
        return false;
      }
    });
   }

   // Skill form validation
   function initializeSkillValidation(form) {
     const titleInput = document.getElementById('title');
     const categorySelect = document.getElementById('category');
     const descriptionTextarea = document.getElementById('description');
     const titleError = document.getElementById('titleError');
     const categoryError = document.getElementById('categoryError');
     const descriptionError = document.getElementById('descriptionError');

     // Validation functions for skill form
     function validateSkillTitle(title) {
       if (!title || title.trim() === '') {
         return 'Skill title is required';
       }
       const trimmed = title.trim();
       if (trimmed.length < 3 || trimmed.length > 100) {
         return 'Skill title must be 3-100 characters';
       }
       // Allow Chinese, English, numbers, spaces, and basic symbols like -, &, .
       const re = /^[\u4e00-\u9fa5a-zA-Z0-9\s\-&\.]+$/;
       if (!re.test(trimmed)) {
         return 'Skill title can only contain letters, numbers, spaces, and basic symbols (-, &, .)';
       }
       // Check if it's only spaces or meaningless characters
       if (/^[\s\-&\.]+$/.test(trimmed)) {
         return 'Skill title cannot contain only spaces or meaningless characters';
       }
       return '';
     }

     function validateSkillCategory(category) {
       const validCategories = [ 'Languages & Translation',
          'Academics & Tutoring',
          'Programming & Technology',
          'Design & Creativity',
          'Music, Performing Arts & Writing',
          'Business, Marketing & Management',
          'Cooking & Culinary Arts',
          'Fitness, Sports & Wellness',
          'Lifestyle, Travel & Outdoor Activities',
          'Finance & Investment',
          'Other'];
       if (!category || category === '' || category === 'Please select a category') {
         return 'Please select a skill category';
       }
       if (!validCategories.includes(category)) {
         return 'Please select a valid skill category';
       }
       return '';
     }

     function validateSkillDescription(description) {
       if (!description || description.trim() === '') {
         return 'Skill description is required';
       }
       const trimmed = description.trim();
       if (trimmed.length < 1 || trimmed.length > 1000) {
         return 'Skill description must be 1-1000 characters';
       }
       // Check if it's only spaces
       if (/^\s+$/.test(description)) {
         return 'Skill description cannot contain only spaces';
       }
       return '';
     }

     // Real-time validation for skill form
     titleInput.addEventListener('blur', () => {
       const error = validateSkillTitle(titleInput.value);
       showError(titleError, error);
     });

     titleInput.addEventListener('input', () => {
       if (titleError.textContent) {
         const error = validateSkillTitle(titleInput.value);
         showError(titleError, error);
       }
     });

     categorySelect.addEventListener('change', () => {
       const error = validateSkillCategory(categorySelect.value);
       showError(categoryError, error);
     });

     descriptionTextarea.addEventListener('blur', () => {
       const error = validateSkillDescription(descriptionTextarea.value);
       showError(descriptionError, error);
     });

     descriptionTextarea.addEventListener('input', () => {
       if (descriptionError.textContent) {
         const error = validateSkillDescription(descriptionTextarea.value);
         showError(descriptionError, error);
       }
     });

     // Form submission validation for skill form
     form.addEventListener('submit', (e) => {
       const titleErr = validateSkillTitle(titleInput.value);
       const categoryErr = validateSkillCategory(categorySelect.value);
       const descriptionErr = validateSkillDescription(descriptionTextarea.value);

       showError(titleError, titleErr);
       showError(categoryError, categoryErr);
       showError(descriptionError, descriptionErr);

       if (titleErr || categoryErr || descriptionErr) {
         e.preventDefault();
         return false;
       }
     });
   }

   // Comment form validation
   function initializeCommentValidation(form) {
     const commentInput = document.getElementById('commentInput');
     const commentInputError = document.getElementById('commentInputError');

     // Validation function for comment content
     function validateCommentContent(content) {
       if (!content || content.trim() === '') {
         return 'Comment content is required';
       }
       
       const trimmed = content.trim();
       
       if (trimmed.length > 500) {
         return 'Comment content cannot exceed 500 characters';
       }
       
       // Check for HTML tags, JS scripts, and malicious characters
       const hasHtmlTags = /<[^>]*>/g.test(content);
       const hasScript = /script|javascript|onclick|onload|onerror/gi.test(content);
       const hasMaliciousChars = /[<>"'&]/g.test(content);
       
       if (hasHtmlTags || hasScript || hasMaliciousChars) {
         return 'Comment content contains invalid characters (HTML tags, scripts, or special characters are not allowed)';
       }
       
       return '';
     }

     // Real-time validation for comment input
     commentInput.addEventListener('blur', () => {
       const error = validateCommentContent(commentInput.value);
       showError(commentInputError, error);
     });

     commentInput.addEventListener('input', () => {
       // Clear error when user starts typing
       if (commentInputError.textContent) {
         clearError(commentInputError);
       }
       
       // Show character count for long comments
       const length = commentInput.value.trim().length;
       if (length > 400) {
         showError(commentInputError, `${length}/500 characters`);
       }
     });

     // Form submission validation
     form.addEventListener('submit', (e) => {
       const contentError = validateCommentContent(commentInput.value);
       
       showError(commentInputError, contentError);
       
       if (contentError) {
         e.preventDefault();
         commentInput.focus();
         return false;
       }
     });
   }

   // Edit skill form validation
   function initializeEditSkillValidation(form) {
     const titleInput = document.getElementById('title');
     const categorySelect = document.getElementById('category');
     const descriptionTextarea = document.getElementById('description');
     const titleError = document.getElementById('titleError');
     const categoryError = document.getElementById('categoryError');
     const descriptionError = document.getElementById('descriptionError');

     // Validation functions for edit skill form (reuse the same functions)
     function validateSkillTitle(title) {
       if (!title || title.trim() === '') {
         return 'Skill title is required';
       }
       const trimmed = title.trim();
       if (trimmed.length < 3 || trimmed.length > 100) {
         return 'Skill title must be 3-100 characters';
       }
       // Allow Chinese, English, numbers, spaces, and basic symbols like -, &, .
       const re = /^[\u4e00-\u9fa5a-zA-Z0-9\s\-&\.]+$/;
       if (!re.test(trimmed)) {
         return 'Skill title can only contain letters, numbers, spaces, and basic symbols (-, &, .)';
       }
       // Check if it's only spaces or meaningless characters
       if (/^[\s\-&\.]+$/.test(trimmed)) {
         return 'Skill title cannot contain only spaces or meaningless characters';
       }
       return '';
     }

     function validateSkillCategory(category) {
       const validCategories =[ 'Languages & Translation',
          'Academics & Tutoring',
          'Programming & Technology',
          'Design & Creativity',
          'Music, Performing Arts & Writing',
          'Business, Marketing & Management',
          'Cooking & Culinary Arts',
          'Fitness, Sports & Wellness',
          'Lifestyle, Travel & Outdoor Activities',
          'Finance & Investment',
          'Other'];
       if (!category || category === '' || category === 'Please select a category') {
         return 'Please select a skill category';
       }
       if (!validCategories.includes(category)) {
         return 'Please select a valid skill category';
       }
       return '';
     }

     function validateSkillDescription(description) {
       if (!description || description.trim() === '') {
         return 'Skill description is required';
       }
       const trimmed = description.trim();
       if (trimmed.length < 1 || trimmed.length > 1000) {
         return 'Skill description must be 1-1000 characters';
       }
       // Check if it's only spaces
       if (/^\s+$/.test(description)) {
         return 'Skill description cannot contain only spaces';
       }
       return '';
     }

     // Real-time validation for edit skill form
     if (titleInput && titleError) {
       titleInput.addEventListener('blur', () => {
         const error = validateSkillTitle(titleInput.value);
         showError(titleError, error);
       });

       titleInput.addEventListener('input', () => {
         if (titleError.textContent) {
           const error = validateSkillTitle(titleInput.value);
           showError(titleError, error);
         }
       });
     }

     if (categorySelect && categoryError) {
       categorySelect.addEventListener('change', () => {
         const error = validateSkillCategory(categorySelect.value);
         showError(categoryError, error);
       });
     }

     if (descriptionTextarea && descriptionError) {
       descriptionTextarea.addEventListener('blur', () => {
         const error = validateSkillDescription(descriptionTextarea.value);
         showError(descriptionError, error);
       });

       descriptionTextarea.addEventListener('input', () => {
         if (descriptionError.textContent) {
           const error = validateSkillDescription(descriptionTextarea.value);
           showError(descriptionError, error);
         }
       });
     }

     // Form submission validation for edit skill form
     form.addEventListener('submit', (e) => {
       const titleErr = titleInput ? validateSkillTitle(titleInput.value) : '';
       const categoryErr = categorySelect ? validateSkillCategory(categorySelect.value) : '';
       const descriptionErr = descriptionTextarea ? validateSkillDescription(descriptionTextarea.value) : '';

       if (titleError) showError(titleError, titleErr);
       if (categoryError) showError(categoryError, categoryErr);
       if (descriptionError) showError(descriptionError, descriptionErr);

       if (titleErr || categoryErr || descriptionErr) {
         e.preventDefault();
         return false;
       }
     });
   }
   
   
   function initializeProfileEditValidation(form) {
     const usernameInput = document.getElementById('username');
     const emailInput = document.getElementById('email');
     const contactInput = document.getElementById('contact');
     const usernameError = document.getElementById('usernameError');
     const emailError = document.getElementById('emailError');
     const contactError = document.getElementById('contactError');
     const generalError = document.getElementById('generalError');
   
     
     function clearAllErrors() {
       clearError(usernameError);
       clearError(emailError);
       clearError(contactError);
       clearError(generalError);
     }
   
    
     async function checkEmailAvailability(email) {
       try {
         const response = await fetch('/profile/check-email', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json'
           },
           body: JSON.stringify({ email })
         });
   
         if (!response.ok) {
           throw new Error('Network response was not ok');
         }
   
         const data = await response.json();
         return !data.exists; 
       } catch (error) {
         console.error('Error checking email availability:', error);
         return null; 
       }
     }
   
     
     emailInput.addEventListener('blur', async () => {
       clearError(emailError);
       const email = emailInput.value.trim();
       if (!email) {
         showError(emailError, 'Email is required');
         return;
       }
   
       
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       if (!emailRegex.test(email)) {
         showError(emailError, 'Please enter a valid email address');
         return;
       }
   
       
       try {
         const isAvailable = await checkEmailAvailability(email);
         if (isAvailable === false) {
           showError(emailError, 'Email is already taken');
         } else if (isAvailable === null) {
           showError(emailError, 'Failed to check email availability. Please try again.');
         }
       } catch (error) {
         console.error('Error during email validation:', error);
         showError(emailError, 'Failed to check email availability. Please try again.');
       }
     });
   
    
     emailInput.addEventListener('input', () => {
       if (emailError.textContent) {
         clearError(emailError);
       }
     });
   
     
     form.addEventListener('submit', async (e) => {
       clearAllErrors();
       let isValid = true;
   
      
       const username = usernameInput.value.trim();
       if (!username) {
         showError(usernameError, 'Username is required');
         isValid = false;
       } else if (username.length < 3 || username.length > 20 || !/^[a-zA-Z0-9]+$/.test(username)) {
         showError(usernameError, 'Username must be 3-20 characters and contain letters or numbers');
         isValid = false;
       }
   
      
      if (emailInput && emailError) {
         const email = emailInput.value.trim();
         if (!email) {
           showError(emailError, 'Email is required');
           isValid = false;
         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
           showError(emailError, 'Please enter a valid email address');
           isValid = false;
         } else {
           
           const isAvailable = await checkEmailAvailability(email);
           if (isAvailable === false) {
             showError(emailError, 'Email is already taken');
             isValid = false;
           } else if (isAvailable === null) {
             showError(emailError, 'Failed to check email availability. Please try again.');
             isValid = false;
           }
         }
       }

      
       if (!isValid) {
         e.preventDefault();
         
         const firstError = form.querySelector('.error-message:not(:empty)');
         if (firstError) {
           const inputId = firstError.id.replace('Error', '');
           const input = document.getElementById(inputId);
           if (input) input.focus();
         }
       }
     });
   }
   
   
   const profileEditForm = document.querySelector('form[action="/profile/edit"]');
   if (registerForm) {
     initializeRegisterValidation(registerForm);
   } else if (loginForm) {
     initializeLoginValidation(loginForm);
   } else if (skillForm) {
     initializeSkillValidation(skillForm);
   } else if (editSkillForm) {
     initializeEditSkillValidation(editSkillForm);
   } else if (commentForm) {
     initializeCommentValidation(commentForm);
   } else if (profileEditForm) {
     initializeProfileEditValidation(profileEditForm);
   } else {
     // Fallback for other forms
     const genericForm = document.querySelector('form');
     if (genericForm) {
       genericForm.addEventListener('submit', (e) => {
         
         let errorElement = genericForm.querySelector('.form-error');
         if (!errorElement) {
           errorElement = document.createElement('div');
           errorElement.className = 'form-error';
           errorElement.style.color = 'red';
           errorElement.style.marginTop = '10px';
           genericForm.prepend(errorElement);
         }
         errorElement.textContent = '';

         const inputs = genericForm.querySelectorAll('input, textarea');
         let hasError = false;

         for (let input of inputs) {
         
           if (input.id === 'contact' || input.name === 'contact' || input.disabled) {
             continue;
           }

           if (input.value.trim() === '') {
            
             const label = genericForm.querySelector(`label[for="${input.id}"]`) || 
                           genericForm.querySelector(`label[for="${input.name}"]`);
             const fieldName = label ? label.textContent : input.placeholder || 'This field';
              
             errorElement.textContent = `${fieldName} is required`;
             hasError = true;
             input.focus();
             break;
           }
         }

         if (hasError) {
           e.preventDefault();
           return false;
         }
       });
     }
     return;
   }
});