import Joi from "joi";

export const getDocuments = Joi.object({
  query: Joi.object({
    keyword: Joi.string().max(50).allow(null, '').default(null),
    offset: Joi.number().integer().default(0),
    filter: Joi.string().valid('in_progress', 'not_started', 'completed').default('in_progress'),
    sort_by: Joi.string().valid('creation_date', 'title', 'author').default('creation_date'),
    sort_order: Joi.string().valid('DESC', 'ASC').default('ASC'),
  }),
  params: Joi.object({
    library_id: Joi.string().required(),
  }),
});

export const createDocument = Joi.object({
  params: Joi.object({
    library_id: Joi.string().required(),
  }),
});

export const updateDocument = Joi.object({
  body: Joi.object({
    title: Joi.string().max(50).min(1).allow(null).default(null),
    author: Joi.string().max(50).min(1).allow(null).default(null),
    description: Joi.string().max(100).min(1).allow(null).default(null),
  }),
  params: Joi.object({
    document_id: Joi.string().required(),
    library_id: Joi.string().required(),
  }),
});

export const deleteDocument = Joi.object({
  params: Joi.object({
    library_id: Joi.string().required(),
    document_id: Joi.string().required(),
  }),
});