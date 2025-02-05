import Joi from "joi";

export const getLibraries = Joi.object({
  query: Joi.object({
    keyword: Joi.string().max(50).allow(null, '').default(null),
    offset: Joi.number().integer().default(0)
  })
});

export const updateLibrary = Joi.object({
  body: Joi.object({
    name: Joi.string().max(50).min(1).allow(null).default(null),
    description: Joi.string().max(100).min(1).allow(null).default(null),
  }),
  params: Joi.object({
    library_id: Joi.string().required(),
  })
});

export const deleteLibrary = Joi.object({
  params: Joi.object({
    library_id: Joi.string().required(),
  })
});