import e, { Router } from 'express';
import DepartmentController from '../controllers/DepartmentController';
import CostsController from '../controllers/Costs';
import EnterpriseController from '../controllers/EnterpriseController';
import VolumesController from '../controllers/VolumesController';
import StatisticsController from '../controllers/StatisticsController';
import DaysController from '../controllers/DaysController';

const router = Router();

router.post('/create/enterprise', EnterpriseController.create);
router.get('/get/enterprises', EnterpriseController.getList);

router.post('/create/department', DepartmentController.create);
router.get('/departments/:id', DepartmentController.getDepartments);

router.post('/create/costs', CostsController.createCosts);
router.post('/create/volumes', CostsController.createCosts);
router.post('/create/days', DaysController.createWorkingDays);

router.get('/get/full/statistics/:id/:type/:resource', StatisticsController.getFullInfo);
router.get(
	'/get/department/statistics/:enterprise/:department/:type/:resource',
	StatisticsController.getDepartmentInfo
);
router.get(
	'/get/consumption/statistics/:department/:resource/:month',
	StatisticsController.getMonthlyConsumptionInfo
);

export default router;
