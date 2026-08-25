import { Router } from 'express';
import { body } from 'express-validator';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import * as athleteController from '../controllers/athleteController.js';

const router = Router();

router.use(requireAuth);

// Admin and coach can both read (coach results are scoped server-side to their categories)
router.get('/', athleteController.listAthletes);
router.get('/:id', athleteController.getAthlete);

const athleteValidators = [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('date_of_birth').isISO8601().withMessage('A valid date of birth is required'),
  body('gender').isIn(['male', 'female']).withMessage('Gender must be male or female'),
  body('guardian_name').trim().notEmpty().withMessage('Guardian name is required'),
  body('guardian_phone')
    .matches(/^[0-9+ ()-]{6,20}$/)
    .withMessage('A valid guardian phone number is required'),
  body('category_id').isUUID().withMessage('A valid category is required'),
  body('phone_number').optional({ checkFalsy: true }).isString(),
  body('address').optional({ checkFalsy: true }).isString(),
];

router.post('/', requireRole('admin'), athleteValidators, validate, athleteController.createAthlete);
router.put(
  '/:id',
  requireRole('admin'),
  athleteValidators.map((v) => v.optional()),
  validate,
  athleteController.updateAthlete
);
router.delete('/:id', requireRole('admin'), athleteController.deleteAthlete);

export default router;
