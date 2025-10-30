"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomerModel {
    constructor(id, firstName, lastName, email, createdAt, phone) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.createdAt = createdAt;
        this.phone = phone;
    }
}
exports.default = CustomerModel;
