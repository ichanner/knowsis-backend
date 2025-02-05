import Joi from "joi";

// Schema for creating an invite (body)
export const createInvite = Joi.object({
  body: Joi.object({
    library_id: Joi.string().required(), // Library ID to create the invite for
  }),
});

// Schema for fetching invites (query parameters)
export const getInvites = Joi.object({
  params: Joi.object({
    library_id: Joi.string().required(), // Library ID to fetch invites for
  }),
  query: Joi.object({
    offset: Joi.number().integer().min(0).optional(), // Offset for pagination
  }),
});

// Schema for invalidating all invites (params)
export const invalidateAllInvites = Joi.object({
  params: Joi.object({
    library_id: Joi.string().required(), // Library ID for invalidating invites
  }),
});

// Schema for invalidating a specific invite (params)
export const invalidateInvite = Joi.object({
  params: Joi.object({
    library_id: Joi.string().required(), // Library ID to invalidate the invite for
    invite_code: Joi.string().required(), // Specific invite code to invalidate
  }),
});