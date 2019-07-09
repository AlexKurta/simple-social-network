export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  city: string;
  phone: Array<string>;
  password: string;
  role: string;
  photo?: string;
  online: boolean;
}
