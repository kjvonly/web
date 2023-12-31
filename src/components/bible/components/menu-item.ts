export type MenuItem = {
	title: string;
	children: MenuItem[];
	handler: Function;
};
