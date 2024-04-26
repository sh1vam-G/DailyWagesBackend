export let jobs = {
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
        workManual: "Following steps need to be followed:\n 1. Keep the cloth piece on the bottom border of the saree along the length.\n 2. make the raw stitches along the length just to hold the cloth. 3. Make final fine stitches to attach the cloth permanently. ",
        difficultyLevel: "EASY",
        employer: {
            name: "Shivam",
            gender: "M",
            phoneNumber: "9813179017",
            email: "shivam2671997@gmail.com",
            birthDate: "97-07-26",
            organisation: "Daily Wager",
            ratings: 5,
            description: "iOS developer",
        }
    };

export function mapToJobs(job) {
    return {
        id: job.jobid,
        code: job.code,
        type: job.type,
        numberOfPieces: job.numberofpieces,
        timeReq: job.timereq,
        amount: job.amount,
        deliveryTime: job.deliverytime,
        pickupTime: job.pickuptime,
        paymentOn: job.paymenton,
        status: job.status,
        workManual: job.workmanual,
        difficultyLevel: job.difficultylevel
    }
}

export function mapToEmployer(job) {
    return {
        name: job.personname,
        gender: job.gender,
        phoneNumber: job.phonenumber,
        email: job.email,
        birthDate: job.dateofbirth,
        organisation: job.orgname,
        ratings: job.ratings,
        description: job.description,
    }
}