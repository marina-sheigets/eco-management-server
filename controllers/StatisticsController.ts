import { MONTHS, RESOURCES, YEARS } from './../constants/index';
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
						value.values[response.month] += Number(response.costs).toFixed(2) ?? 0;
					}
				});
			});
		} else {
			results = await Volumes.find({ enterprise: foundedEnterprise.id, resource });

			results.forEach((response: any) => {
				statistics.forEach((value: Result) => {
					if (response.year == value.year) {
						value.values[response.month] += Number(response.volumes).toFixed(2) ?? 0;
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
						value.values[response.month] += Number(response.costs).toFixed(2) ?? 0;
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
						value.values[response.month] += Number(response.volumes).toFixed(2) ?? 0;
					}
				});
			});
		}

		return res.json({ statistics });
	}

	async getDepartmentInfoForYear(req: Request, res: Response, next: NextFunction) {
		let { enterprise: enterpriseId, year, department: departmentId } = req.params;

		const foundedEnterprise = await Enterprise.findById(enterpriseId);
		if (!foundedEnterprise) {
			return res.status(403).json({ message: 'Such enterprise does not exist' });
		}

		const foundedDepartment = await Department.findById(departmentId);
		if (!foundedDepartment) {
			return res.status(403).json({ message: 'Such department does not exist' });
		}

		let statistics: {
			[fuel: string]: {
				volumes?: { [month: string]: number };
				costs?: { [month: string]: number };
			};
		} = {};
		let results: any = await Costs.find({
			enterprise: foundedEnterprise._id,
			department: foundedDepartment._id,
			year,
		});

		RESOURCES.map((resource: string) => {
			statistics[resource] = { costs: {}, volumes: {} };
		});
		RESOURCES.map((resource: string) => {
			MONTHS.map((month: string) => {
				statistics[resource] = {
					costs: { ...statistics[resource]['costs'], [month]: 0 },
					volumes: { ...statistics[resource]['volumes'], [month]: 0 },
				};
			});
		});
		const volumes = await Volumes.find({
			enterprise: foundedEnterprise._id,
			department: foundedDepartment._id,
			year,
		});
		results.map((item: Cost) => {
			statistics[item.resource]['costs'] = {
				...statistics[item.resource]['costs'],
				[item.month]: item.costs ?? 0,
			};
		});

		volumes.map((item: Volume) => {
			statistics[item.resource]['volumes'] = {
				...statistics[item.resource]['volumes'],
				[item.month]: item.volumes ?? 0,
			};
		});
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

	getCurrentDepartmentData = (department: any, month: string, resource: string) => {
		return Costs.find({
			department: department._id,
			month,
			resource,
			days: { $gt: 0 },
		});
	};
	async getAnnualConsumptionInfo(req: Request, res: Response, next: NextFunction) {
		const { enterprise, month, resource } = req.params;

		const foundedEnterprise = await Enterprise.findById(enterprise);
		if (!foundedEnterprise) {
			return res.status(403).json({ message: 'Such enterprise does not exist' });
		}

		const departments = await Department.find({ enterprise: foundedEnterprise._id });
		console.log(departments);
		if (!departments.length) {
			res.json({ statistics: {} });
		}

		const departmentsData: { [department: string]: any } = {};
		departments.forEach(async (department) => {
			const currentDepartmentData = this.getCurrentDepartmentData(
				department,
				month,
				resource
			);
			// await Costs.find({
			// 	department: department._id,
			// 	month,
			// 	resource,
			// 	days: { $gt: 0 },
			// });
			console.log(currentDepartmentData);
			//departmentsData[department.name] = '1';
			departmentsData[department.name] = currentDepartmentData;
		});
		return res.json({ departmentsData });
		//departments.map((department) => {});
		// let results = await Costs.find({
		// 	month,
		// 	enterprise: foundedEnterprise._id,
		// 	resource,
		// }).sort('year');

		// results = results.filter((item: any) => item.days);

		// let statistics: {
		// 	month: string;
		// 	values: { year: number; days: number; costs: number; average: number }[];
		// } = {
		// 	month: '',
		// 	values: [],
		// };

		// if (!results.length) {
		// 	return res.json({ statistics: {} });
		// }

		// return res.json({ results });
	}
}

export default new StatisticsController();
