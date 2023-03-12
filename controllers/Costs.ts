import { Cost } from './../types/index';
import { NextFunction, Request, Response } from 'express';
import Department from '../models/Department';
import Costs from '../models/Costs';
import Enterprise from '../models/Enterprise';
import Volumes from '../models/Volumes';

class CostsController {
	async createCosts(req: Request, res: Response, next: NextFunction) {
		try {
			const { department, enterprise, type, resource, costs, year } = req.body;

			const foundedDepartment = await Department.findOne({ name: department });
			if (!foundedDepartment) {
				return res.status(403).json({ message: 'Such department does not exist' });
			}
			const foundedEnterprise = await Enterprise.findOne({ name: enterprise });
			if (!foundedEnterprise) {
				return res.status(403).json({ message: 'Such enterprise does not exist' });
			}

			if (type === 'Costs') {
				costs.forEach(async (elem: { id: number; month: string; value: string }) => {
					await Costs.updateOne(
						{
							year: year,
							month: elem.month,
							department: foundedDepartment._id,
							resource,
						},
						{
							costs: elem.value ?? '0',
							department: foundedDepartment._id,
							year: year,
							month: elem.month,
							enterprise: foundedEnterprise._id,
							resource,
						},
						{ upsert: true }
					);
				});
			} else {
				costs.forEach(async (elem: { id: number; month: string; value: string }) => {
					await Volumes.updateOne(
						{
							year: year,
							month: elem.month,
							department: foundedDepartment._id,
							resource,
						},
						{
							volumes: elem.value ?? '0',
							department: foundedDepartment._id,
							year: year,
							month: elem.month,
							enterprise: foundedEnterprise._id,
							resource,
						},
						{ upsert: true }
					);
				});
			}

			res.status(200).json({ message: 'Success !' });
		} catch (e) {}
	}
}

export default new CostsController();
