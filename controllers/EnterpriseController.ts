import { NextFunction, Request, Response } from 'express';
import Enterprise from '../models/Enterprise';

class EnterpriseController {
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const { name } = req.body;
			const existingEnterprise = await Enterprise.findOne({ name });
			if (existingEnterprise) {
				return res.status(403).json({ message: 'Such enterprise exists' });
			}
			const newEnterprise = await Enterprise.create({ name });
			res.status(200).json({ newEnterprise });
		} catch (e) {
			console.log(e);
			next(e);
		}
	}

	async getList(req: Request, res: Response, next: NextFunction) {
		try {
			const enterprises = await Enterprise.find();
			res.status(200).json({ enterprises });
		} catch (e) {
			console.log(e);
			next(e);
		}
	}
}

export default new EnterpriseController();
