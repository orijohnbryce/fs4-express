export default class CustomerModel {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    createdAt: Date;    

    constructor(
        id: number | undefined,
        firstName: string,
        lastName: string,
        email: string,
        createdAt: Date,
        phone?: string
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.createdAt = createdAt;
        this.phone = phone;
    }     
}