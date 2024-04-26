import * as J from "./jobs.js"; 
import * as I from "./industrialist.js";

let customers = {
    id: 1,
    name: "Akhil",
    gender: "M",
    email: "akhil.ms@gmail.com",
    birthDate: "00-08-05",
    phoneNumber: "8888999932",
    ratings: 5,
    address: {
        id: 2,
        latitude: 13.03565,
        longitude: 77.63431,
        houseNo: "106",
        apartment: "pulikeshi apartment",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560043"
    },
    jobs: [
        {
            id: 1,
            code: "22",
            type: "STITCHING",
            numberOfPieces: 20,
            timeReq: "8",
            amount: 4000,
            deliveryTime: "09-04-2024 09:00:00",
            pickupTime: "09-04-2024 20:00:00",
            paymentOn: "PICKUP",
            status: "COMPLETED",
            workManual: "Following steps need to be followed:\n 1. Keep the cloth piece on the bottom border of the saree along the length.\n 2. make the raw stitches along the length just to hold the cloth. 3. Make final fine stitches to attach the cloth permanently. ",
            difficultyLevel: "EASY"
        },
        {
            id: 2,
            code: "23",
            type: "STITCHING",
            numberOfPieces: 10,
            timeReq: "8",
            amount: 5000,
            deliveryTime: "09-04-2024 09:00:00",
            pickupTime: "09-04-2024 20:00:00",
            paymentOn: "PICKUP",
            status: "COMPLETED",
            workManual: "Following steps need to be followed:\n 1. Keep the cloth piece on the bottom border of the saree along the length.\n 2. make the raw stitches along the length just to hold the cloth. 3. Make final fine stitches to attach the cloth permanently. ",
            difficultyLevel: "MEDIUM"
        }
    ]
};

export function mapToCustomer(cust) {
    return {
        id: cust.id,
        name: cust.name,
        gender: cust.gender,
        email: cust.email,
        dateOfBirth: cust.dateOfBirth,
        phoneNumber: cust.phonenumber,
        ratings: cust.ratings,
        address: I.mapToAddress(cust)
    }
};

let customerDB = {
    name: "Akhil",
    gender: "M",
    email: "akhil.ms@gmail.com",
    birthDate: "00-08-05",
    phoneNumber: "8888999932",
    ratings: 5
};

let addressDB = {
    latitude: 13.03565,
    longitude: 77.63431,
    houseNo: "106",
    apartment: "pulikeshi apartment",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560043",
    customerId: 2
}

export function getCustomerDB(customer) {
    return {
        name: customer.name,
        gender: customer.gender,
        email: customer.email,
        dateOfBirth: customer.dateOfBirth,
        phoneNumber: customer.phoneNumber,
        ratings: customer.ratings,
        username: customer.username,
        pass: customer.pass
    }
}

export function getAddressDB(customer, id) {
    return {
        latitude: customer.address.latitude,
        longitude: customer.address.longitude,
        houseNo: customer.address.houseNo,
        apartment: customer.address.apartment,
        city: customer.address.city,
        state: customer.address.state,
        pincode: customer.address.pincode,
        customerId: id.id
    }
}