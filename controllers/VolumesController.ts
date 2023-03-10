import { NextFunction, Request, Response } from 'express';
import Department from '../models/Department';
import Enterprise from '../models/Enterprise';
import Volumes from '../models/Volumes';
import { Cost } from '../types';

class VolumesController {
	async createVolumes(req: Request, res: Response, next: NextFunction) {
		try {
			const volumes: Cost[] = req.body.volumes;
			const { department, enterprise, type } = req.body;

			const foundedDepartment = await Department.findOne({ name: department });
			if (!foundedDepartment) {
				return res.status(403).json({ message: 'Such department does not exist' });
			}
			const foundedEnterprise = await Enterprise.findOne({ name: enterprise });
			if (!foundedEnterprise) {
				return res.status(403).json({ message: 'Such enterprise does not exist' });
			}

			volumes.forEach(async (elem) => {
				await Volumes.updateOne(
					{ year: elem.year, department: foundedDepartment._id, type },
					{
						volumes: elem.value ?? '0',
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

export default new VolumesController();
