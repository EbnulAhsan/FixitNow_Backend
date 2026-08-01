import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { ServiceRoutes } from "../modules/service/service.route";
import path from "node:path";
import { TechnicianRoutes } from "../modules/technician/technician.route";
import { BookingRoutes } from "../modules/booking/booking.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { ReviewRoutes } from "../modules/review/review.route";
import { AdminRoutes } from "../modules/admin/admin.route";

const router = express.Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: AuthRoutes,
    },
    {
        path: "/categories",
        route: CategoryRoutes,
    },
    {
        path: "/services",
        route: ServiceRoutes
    },
    {
        path: "/technician",
        route: TechnicianRoutes
    },
    {
        path: "/bookings",
        route: BookingRoutes
    },
    {
        path: "/payments",
        route: PaymentRoutes
    },
    {
        path: "/reviews",
        route: ReviewRoutes
    },
    {
        path: "/admin",
        route: AdminRoutes
    }
];

moduleRoutes.forEach((route) =>
    router.use(route.path, route.route)
);

export default router;