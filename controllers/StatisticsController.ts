import { MONTHS, YEARS } from './../constants/index';
import { NextFunction, Request, Response } from 'express';
import Department from '../models/Department';
import Enterprise from '../models/Enterprise';
import Costs from '../models/Costs';
import Volumes from '../models/Volumes';

type Result = {
	year: number;
	values: { [month: string]: number };
};

type Cost = {
	year: number;
	month: string;
	enterprise: string;
	department: string;
	costs: number;
	resource: string;
	days: number;
};

type Volume = {
	year: number;
	month: string;
	enterprise: string;
	department: string;
	volumes: number;
	resource: string;
};
class StatisticsController {
	async getFullInfo(req: Request, res: Response, next: NextFunction) {
		let { id, resource, type } = req.params;
		resource = resource[0].toUpperCase() + resource.slice(1);
		const foundedEnterprise = await Enterprise.findById(id);
		if (!foundedEnterprise) {
			return res.status(403).json({ message: 'Such enterprise does not exist' });
		}
		let results = [];
		let statistics: Result[] = [];
		YEARS.map((year) => {
			statistics.push({ year, values: {} });
		});

		MONTHS.map((month) => {
			statistics.forEach((item) => {
				item.values[month] = 0;
			});
		});
		if (type === 'Costs') {
			results = await Costs.find({ enterprise: foundedEnterprise.id, resource });

			results.forEach((response: any) => {
				statistics.forEach((value: Result) => {
					if (response.year == value.year) {
						value.values[response.month] += response.costs ?? 0;
					}
				});
			});
		} else {
			results = await Volumes.find({ enterprise: foundedEnterprise.id, resource });

			results.forEach((response: any) => {
				statistics.forEach((value: Result) => {
					if (response.year == value.year) {
						value.values[response.month] += response.volumes ?? 0;
					}
				});
			});
		}

		return res.json({ statistics });
	}

	async getDepartmentInfo(req: Request, res: Response, next: NextFunction) {
		let { enterprise: enterpriseId, resource, type, department: departmentId } = req.params;
		resource = resource[0].toUpperCase() + resource.slice(1);
		const foundedEnterprise = await Enterprise.findById(enterpriseId);
		if (!foundedEnterprise) {
			return res.status(403).json({ message: 'Such enterprise does not exist' });
		}

		const foundedDepartment = await Department.findById(departmentId);
		if (!foundedDepartment) {
			return res.status(403).json({ message: 'Such department does not exist' });
		}

		let results = [];
		let statistics: Result[] = [];

		YEARS.map((year) => {
			statistics.push({ year, values: {} });
		});

		MONTHS.map((month) => {
			statistics.forEach((item) => {
				item.values[month] = 0;
			});
		});

		if (type === 'Costs') {
			results = await Costs.find({
				enterprise: foundedEnterprise.id,
				resource,
				department: foundedDepartment._id,
			});
			results.forEach((response: any) => {
				statistics.forEach((value: Result) => {
					if (response.year == value.year) {
						value.values[response.month] += response.costs ?? 0;
					}
				});
			});
		} else {
			results = await Volumes.find({
				enterprise: foundedEnterprise.id,
				resource,
				department: foundedDepartment._id,
			});

			results.forEach((response: any) => {
				statistics.forEach((value: Result) => {
					if (response.year == value.year) {
						value.values[response.month] += response.volumes ?? 0;
					}
				});
			});
		}

		return res.json({ statistics });
	}

	async getMonthlyConsumptionInfo(req: Request, res: Response, next: NextFunction) {
		const { department, month, resource } = req.params;

		const foundedDepartment = await Department.findById(department);
		if (!foundedDepartment) {
			return res.status(403).json({ message: 'Such department does not exist' });
		}

		let results = await Costs.find({ month, department: foundedDepartment._id, resource }).sort(
			'year'
		);
		results = results.filter((item: any) => item.days);

		let statistics: {
			month: string;
			values: { year: number; days: number; costs: number; average: number }[];
		} = {
			month: '',
			values: [],
		};

		if (!results.length) {
			return res.json({ statistics: {} });
		}
		results.map((item: any) => {
			statistics.month = item.month;
			statistics.values.push({
				year: item.year,
				days: item.days,
				costs: item.costs,
				average: +(item.costs / item.days).toFixed(2),
			});
		});

		return res.json({ statistics });
	}
}

export default new StatisticsController();
