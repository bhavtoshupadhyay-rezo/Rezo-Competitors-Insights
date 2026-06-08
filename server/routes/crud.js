// Generic CRUD route factory. One call per entity.
//
// makeCrudRouter('competitor', schema) mounts:
//   GET    /              → list all (optional ?limit=, ?offset=, ?orderBy=)
//   GET    /:id           → fetch one
//   POST   /              → create (validated)
//   PUT    /:id           → upsert (validated; URL :id overrides body's PK)
//   DELETE /:id           → remove
//
// Validation uses Ajv against the entity's JSON Schema. 4xx errors carry a
// `details` array so clients see exactly which field failed.

import { Router } from 'express';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { listAll, getById, upsert, remove, ENTITIES } from '../db/db.js';

const ajv = new Ajv2020({ allErrors: true, useDefaults: true, removeAdditional: 'failing' });
addFormats(ajv);

export function makeCrudRouter(entityKey, schema) {
  const router = Router();
  const entity = ENTITIES[entityKey];
  if (!entity) throw new Error(`Unknown entity: ${entityKey}`);
  const validate = ajv.compile(schema);
  const pkJs = entity.pkJs;

  router.get('/', (req, res) => {
    try {
      const items = listAll(entityKey, {
        limit:   req.query.limit,
        offset:  req.query.offset,
        orderBy: req.query.orderBy,
      });
      res.json({ success: true, count: items.length, items });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.get('/:id', (req, res) => {
    try {
      const item = getById(entityKey, req.params.id);
      if (!item) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, item });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.post('/', (req, res) => {
    const body = req.body || {};
    if (!validate(body)) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: validate.errors });
    }
    try {
      const existing = getById(entityKey, body[pkJs]);
      if (existing) return res.status(409).json({ success: false, error: `${entityKey} ${body[pkJs]} already exists — use PUT to update` });
      const item = upsert(entityKey, body);
      res.status(201).json({ success: true, item });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.put('/:id', (req, res) => {
    const body = { ...(req.body || {}), [pkJs]: req.params.id };
    if (!validate(body)) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: validate.errors });
    }
    try {
      const item = upsert(entityKey, body);
      res.json({ success: true, item });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.delete('/:id', (req, res) => {
    try {
      const ok = remove(entityKey, req.params.id);
      if (!ok) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
}
