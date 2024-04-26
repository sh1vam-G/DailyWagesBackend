let employer = {
    name: "Shivam",
    gender: "M",
    phoneNumber: "9813179017",
    email: "shivam2671997@gmail.com",
    birthDate: "97-07-26",
    organisation: "Daily Wager",
    ratings: 5,
    description: "iOS developer",
    address: {
        id: 1,
        latitude: 13.03364,
        longitude:  77.6373,
        houseNo: "22",
        apartment: "DMart",
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
            status: "UNASSIGNED",
            workManual: "Following steps need to be followed:\n1. Keep the cloth piece on the bottom border of the saree along the length.\n2. make the raw stitches along the length just to hold the cloth.\n3. Make final fine stitches to attach the cloth permanently. ",
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
            status: "UNASSIGNED",
            workManual: "Following steps need to be followed:\n 1. Keep the cloth piece on the bottom border of the saree along the length.\n 2. make the raw stitches along the length just to hold the cloth. 3. Make final fine stitches to attach the cloth permanently. ",
            difficultyLevel: "MEDIUM"
        }
    ]
}

export function mapToEmployerUsing(indus) {
    employer.name = indus.name;
    employer.gender = indus.gender;
    employer.phoneNumber = indus.phonenumber;
    employer.email = indus.email;
    employer.birthDate = indus.birthdate;
    employer.ratings = indus.ratings;
    employer.description = indus.description;
    employer.organisation = indus.orgname;
    employer.address = mapToAddress(indus);
    employer.jobs = indus.jobs.map((job) => mapToJobs(job));
}

export function mapToAddress(add) {
    return {
        id: add.addid,
        latitude: add.latitude,
        longitude:  add.longitude,
        houseNo: add.houseno,
        apartment: add.apartment,
        city: add.city,
        state: add.state,
        pincode: add.pincode
    }
}

