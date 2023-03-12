import { NextFunction, Request, Response } from 'express';
import Costs from '../models/Costs';
import Department from '../models/Department';
import Enterprise from '../models/Enterprise';
import Volumes from '../models/Volumes';
import { Cost } from '../types';

class DaysController {
	async createWorkingDays(req: Request, res: Response, next: NextFunction) {
		try {
			const { department, enterprise, year, days } = req.body;

			const foundedDepartment = await Department.findOne({ name: department });
			if (!foundedDepartment) {
				return res.status(403).json({ message: 'Such department does not exist' });
			}
			const foundedEnterprise = await Enterprise.findOne({ name: enterprise });
			if (!foundedEnterprise) {
				return res.status(403).json({ message: 'Such enterprise does not exist' });
			}

			days.forEach(async (elem: { month: string; value: number }) => {
				await Costs.updateOne(
					{ year, department: foundedDepartment._id, month: elem.month },
					{
						days: elem.value ?? 0,
					},
					{ upsert: true }
				);
			});
			res.status(200).json({ message: 'Success !' });
		} catch (e) {}
	}
}

export default new DaysController();
