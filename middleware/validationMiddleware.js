import { xssClean } from '../utils/xssFilter.js';

export const sanitizeInput = (req, res, next) => {
  req.body = xssClean(req.body);
  next();
};
