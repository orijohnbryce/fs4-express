export default class CustomerModel {
  id?: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  createdAt?: string;

  constructor(
    id: number | undefined,
    firstName: string,
    lastName: string,
    email?: string,
    phone?: string,
    createdAt?: string
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.createdAt = createdAt;
  }
}