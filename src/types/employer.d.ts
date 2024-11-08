declare type Employer = {
  id: string;
  address?: Address;
  company_name: string;
  fantasy_name: string;
  cnpj: string;
}

declare type EmployerForm = Omit<Employer, 'id' | 'address'>;