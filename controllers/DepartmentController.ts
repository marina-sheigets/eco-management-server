import { NextFunction, Request, Response } from 'express';
import Department from '../models/Department';
import Enterprise from '../models/Enterprise';

class DepartmentController {
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const { enterpriseName, departmentName } = req.body;
			const foundedEnterprise = await Enterprise.findOne({ name: enterpriseName });
			if (!foundedEnterprise) {
				return res.status(403).json({ message: 'Such enterprise does not exist' });
			}
			const existingDepartment = await Department.findOne({ name: departmentName });
			if (existingDepartment) {
				return res.status(403).json({ message: 'Such department exists' });
			}
			const newDepartment = await Department.create({
				name: departmentName,
				enterprise: foundedEnterprise._id,
			});

			res.status(200).json({ newDepartment });
		} catch (e) {
			console.log(e);
			next();
		}
	}
	async getDepartments(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const foundedEnterprise = await Enterprise.findById(id);
			if (!foundedEnterprise) {
				return res.status(403).json({ message: 'Such enterprise does not exist' });
			}
			const departments = await Department.find({ enterprise: id });
			// if (existingDepartment) {
			// 	return res.status(403).json({ message: 'Such department exists' });
			// }
			// const newDepartment = await Department.create({
			// 	name: departmentName,
			// 	enterprise: foundedEnterprise._id,
			// });

			res.status(200).json({ departments });
		} catch (e) {
			console.log(e);
			next();
		}
	}
}

export default new DepartmentController();
