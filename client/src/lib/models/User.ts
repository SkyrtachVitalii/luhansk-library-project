import mongoose, { Schema, model, models } from "mongoose";

import { IUser } from "@/types";

const UserSchema = new Schema<IUser> (
    {
        firstName:{type: String, required: true},
        lastName: {type: String, required: true},
        patronymic: {type: String},
        email: {type: String, required: true, unique: true},
        phone: {type: String, required: true},
        passwordHash: {type: String, required: true},
        dateOfBirth: {type: Date, required: true},
        gender: {type: String, enum: ["Чоловіча", "Жіноча"], required: true},
        address: {type: String, required: true},
        education: {type: String},
        activitiField: {type: String},
        workplace: {type: String},
        addictionalInfo: {type: String},
        gdprConsent: {type: Boolean, required: true},
        role: {
            type: String,
            enum: ["user", "manager", "admin"],
            default: "user"
        },
    },
    {timestamps: true, collection: "luhansk_library_accounts"}
);

export const User = models.User || model("User", UserSchema);