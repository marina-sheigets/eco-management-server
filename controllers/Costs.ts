import { Cost } from './../types/index';
import { NextFunction, Request, Response } from 'express';
import Department from '../models/Department';
import Costs from '../models/Costs';
import Enterprise from '../models/Enterprise';

class CostsController {
	async createCosts(req: Request, res: Response, next: NextFunction) {
		try {
			const costs: Cost[] = req.body.costs;
			const { department, enterprise, type } = req.body;

			const foundedDepartment = await Department.findOne({ name: department });
			if (!foundedDepartment) {
				return res.status(403).json({ message: 'Such department does not exist' });
			}
			const foundedEnterprise = await Enterprise.findOne({ name: enterprise });
			if (!foundedEnterprise) {
				return res.status(403).json({ message: 'Such enterprise does not exist' });
			}

			costs.forEach(async (elem) => {
				await Costs.updateOne(
					{ year: elem.year, department: foundedDepartment._id, type },
					{
						costs: elem.value ?? '0',
						department: foundedDepartment._id,
						year: elem.year,
						enterprise: foundedEnterprise._id,
						type,
					},
					{ upsert: true }
				);
			});
			res.status(200).json({ message: 'Success !' });
		} catch (e) {}
	}
}

export default new CostsController();
