import Joi from "joi";

// Schema for GET collaborators (query params)
export const getCollaborators = Joi.object({
  query: Joi.object({
    offset: Joi.number().integer().default(0), // Optional pagination offset
  }),
  params: Joi.object({
    library_id: Joi.string().required(), // Library ID is required in the URL params
  })
});

// Schema for POST collaborators (body and params)
export const addCollaborator = Joi.object({
  body: Joi.object({
    added_id: Joi.string().required(), // The ID of the user being added as a collaborator
  }),
  params: Joi.object({
    library_id: Joi.string().required(), // Library ID is required in the URL params
  })
});

// Schema for DELETE collaborators (body and params)
export const removeCollaborator = Joi.object({
  body: Joi.object({
    removed_id: Joi.string().required(), // The ID of the user being removed as a collaborator
  }),
  params: Joi.object({
    library_id: Joi.string().required(), // Library ID is required in the URL params
  })
});