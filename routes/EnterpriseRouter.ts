import e, { Router } from 'express';
import DepartmentController from '../controllers/DepartmentController';
import CostsController from '../controllers/Costs';
import EnterpriseController from '../controllers/EnterpriseController';
import VolumesController from '../controllers/VolumesController';

const router = Router();

router.post('/create/enterprise', EnterpriseController.create);
router.get('/get/enterprises', EnterpriseController.getList);

router.post('/create/department', DepartmentController.create);
router.get('/departments/:id', DepartmentController.getDepartments);

router.post('/create/costs', CostsController.createCosts);
router.post('/create/volumes', VolumesController.createVolumes);

export default router;
