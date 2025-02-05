import Joi from "joi";

// Schema for login (body)
export const loginValidator = Joi.object({
  body: Joi.object({
    login: Joi.string().required(), // Username or email
    password: Joi.string().required(), // Password is required
  }),
});

// Schema for registration (body)
export const registerValidator = Joi.object({
  body: Joi.object({
    login: Joi.string().required(), // Username or email
    password: Joi.string().min(6).required(), // Minimum 6 characters for password
    name: Joi.string().required(), // Name is required
  }),
});

// Schema for requesting password reset (body)
export const requestPasswordResetValidator = Joi.object({
  body: Joi.object({
    login: Joi.string().required(), // Email or phone to request a password reset
  }),
});

// Schema for resetting password (body)
export const resetPasswordValidator = Joi.object({
  body: Joi.object({
    reset_key: Joi.string().required(), // Reset key or OTP for password recovery
    new_password: Joi.string().min(6).required(), // Minimum 6 characters for new password
  }),
});

// Schema for refreshing token (body)
export const refreshTokenValidator = Joi.object({
  body: Joi.object({
    refresh_token: Joi.string().required(), // Refresh token to generate a new access token
  }),
});