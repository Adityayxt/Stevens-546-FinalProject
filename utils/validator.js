/**
 * Simple validation function: check if empty
 */
function isEmpty(value) {
  return !value || value.trim() === '';
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validate username format
 * 3-20 characters, only letters or numbers
 */
function isValidUsername(username) {
  if (!username || typeof username !== 'string') return false;
  const re = /^[a-zA-Z0-9]{3,20}$/;
  return re.test(username);
}

/**
 * Validate password strength
 * At least 4 characters, must contain uppercase, lowercase, and number
 */
function isStrongPassword(password) {
  if (!password || typeof password !== 'string' || password.length < 4) {
    return false;
  }
  
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return hasUppercase && hasLowercase && hasNumber;
}

/**
 * Validate registration data
 */
function validateRegistration(data) {
  const errors = [];
  
  // Username validation
  if (isEmpty(data.username)) {
    errors.push('Username is required');
  } else if (data.username.length < 3 || data.username.length > 20) {
    errors.push('Username must be 3-20 characters');
  } else if (!/^[a-zA-Z0-9]+$/.test(data.username)) {
    errors.push('Username can only contain letters or numbers');
  }
  
  // Password validation
  if (isEmpty(data.password)) {
    errors.push('Password is required');
  } else if (!isStrongPassword(data.password)) {
    errors.push('Password must be at least 4 characters and contain uppercase letter, lowercase letter, and number');
  }
  
  // Email validation
  if (isEmpty(data.email)) {
    errors.push('Email is required');
  } else if (!isValidEmail(data.email)) {
    errors.push('Please enter a valid email address');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate login data
 */
function validateLogin(data) {
  const errors = [];
  
  // Username validation
  if (isEmpty(data.username)) {
    errors.push('Username is required');
  }
  
  // Password validation
  if (isEmpty(data.password)) {
    errors.push('Password is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate skill title
 * 3-100 characters, allows Chinese, English, numbers, spaces, and basic symbols
 */
function isValidSkillTitle(title) {
  if (!title || typeof title !== 'string') return false;
  const trimmed = title.trim();
  if (trimmed.length < 3 || trimmed.length > 100) return false;
  // Allow Chinese, English, numbers, spaces, and basic symbols like -, &, .
  const re = /^[\u4e00-\u9fa5a-zA-Z0-9\s\-\&\.]+$/;
  if (!re.test(trimmed)) return false;
  // Check if it's only spaces or meaningless characters
  if (/^[\s\-\&\.]+$/.test(trimmed)) return false;
  return trimmed !== '';
}

/**
 * Validate skill category
 * Must be a valid category from predefined list
 */
function isValidSkillCategory(category) {
  const validCategories = [
    'Languages & Translation',
    'Academics & Tutoring',
    'Programming & Technology',
    'Design & Creativity',
    'Music, Performing Arts & Writing',
    'Business, Marketing & Management',
    'Cooking & Culinary Arts',
    'Fitness, Sports & Wellness',
    'Lifestyle, Travel & Outdoor Activities',
    'Finance & Investment',
    'Other'
  ];
  if (!category || category === '' || category === 'Please select a category') {
    return false;
  }
  return validCategories.includes(category);
}

/**
 * Validate skill description
 * 1-1000 characters, cannot be only spaces
 */
function isValidSkillDescription(description) {
  if (!description || typeof description !== 'string') return false;
  const trimmed = description.trim();
  if (trimmed.length < 1 || trimmed.length > 1000) return false;
  // Check if it's only spaces
  if (/^\s+$/.test(description)) return false;
  return trimmed !== '';
}


function compressWhitespace(str) {
  if (!str || typeof str !== 'string') return str;
 
  return str
    .trim()
    .replace(/[ \t\f\v]+/g, ' ')  
    .replace(/(\r\n|\r|\n)+/g, ' ')  
    .replace(/^\s+|\s+$/g, '');  
}

/**
 * Validate skill data for publishing
 */
function validateSkill(data) {
  const errors = [];
 
  const cleanedData = { ...data };

  // Title validation
  if (isEmpty(data.title)) {
    errors.push('Skill title is required');
  } else {
   
    cleanedData.title = compressWhitespace(data.title);
    const trimmed = cleanedData.title;
    if (trimmed.length < 3 || trimmed.length > 100) {
      errors.push('Skill title must be 3-100 characters');
    } else if (!/^[\u4e00-\u9fa5a-zA-Z0-9\s\-\&\.]+$/.test(trimmed)) {
      errors.push('Skill title can only contain letters, numbers, spaces, and basic symbols (-, &, .)');
    } else if (/^[\s\-\&\.]+$/.test(trimmed)) {
      errors.push('Skill title cannot contain only spaces or meaningless characters');
    }
  }

  // Category validation
  if (isEmpty(data.category) || data.category === 'Please select a category') {
    errors.push('Please select a skill category');
  } else if (!isValidSkillCategory(data.category)) {
    errors.push('Please select a valid skill category');
  }

  // Description validation
  if (isEmpty(data.description)) {
    errors.push('Skill description is required');
  } else {
   
    cleanedData.description = compressWhitespace(data.description);
    const trimmed = cleanedData.description;
    if (trimmed.length < 1 || trimmed.length > 1000) {
      errors.push('Skill description must be 1-1000 characters');
    } else if (/^\s+$/.test(trimmed)) {
      errors.push('Skill description cannot contain only spaces');
    }
  }

 
  return {
    isValid: errors.length === 0,
    errors,
    cleanedData
  };
}

/**
 * Validate comment content
 * 1-500 characters, cannot be only spaces, no HTML/JS/malicious content
 */
function isValidComment(content) {
  if (!content || typeof content !== 'string') return false;
  const trimmed = content.trim();
  
  // Check length
  if (trimmed.length < 1 || trimmed.length > 500) return false;
  
  // Check for HTML tags, JS scripts, and malicious characters
  const hasHtmlTags = /<[^>]*>/g.test(content);
  const hasScript = /script|javascript|onclick|onload|onerror/gi.test(content);
  const hasMaliciousChars = /[<>"'&]/g.test(content);
  
  if (hasHtmlTags || hasScript || hasMaliciousChars) return false;
  
  return trimmed !== '';
}

/**
 * Validate comment data
 */
function validateComment(data) {
  const errors = [];
  
  // Content validation
  if (isEmpty(data.content)) {
    errors.push('Comment content is required');
  } else if (!isValidComment(data.content)) {
    const trimmed = data.content ? data.content.trim() : '';
    if (trimmed.length < 1) {
      errors.push('Comment content cannot be empty or only spaces');
    } else if (trimmed.length > 500) {
      errors.push('Comment content cannot exceed 500 characters');
    } else {
      errors.push('Comment content contains invalid characters (HTML tags, scripts, or special characters are not allowed)');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}



export {
  isEmpty,
  isValidEmail,
  isValidUsername,
  isStrongPassword,
  validateRegistration,
  validateLogin,
  isValidSkillTitle,
  isValidSkillCategory,
  isValidSkillDescription,
  validateSkill,
  isValidComment,
  validateComment,
  compressWhitespace
};