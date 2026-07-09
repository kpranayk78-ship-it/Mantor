import DashboardCard from "../components/dashboard/Dashboardcard";

import {
    FaDatabase,
    FaCheckCircle,
    FaSpinner,
    FaHeartbeat,
} from "react-icons/fa";

export default function Dashboard() {

    const stats = {
        totalDocuments: 24,
        indexedDocuments: 19,
        processing: 3,
        systemHealth: "Healthy",
    };

    return (

        <div className="space-y-8">

            <div>

                <h1 className="text-2xl font-bold text-industrial-100">
                    Dashboard
                </h1>

                <p className="text-industrial-400">
                    Industrial Knowledge Platform
                </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                <DashboardCard
                    title="Total Documents"
                    value={stats.totalDocuments}
                    icon={<FaDatabase />}
                    color="blue"
                />

                <DashboardCard
                    title="Indexed Documents"
                    value={stats.indexedDocuments}
                    icon={<FaCheckCircle />}
                    color="green"
                />

                <DashboardCard
                    title="Processing"
                    value={stats.processing}
                    icon={<FaSpinner />}
                    color="yellow"
                />

                <DashboardCard
                    title="System Health"
                    value={stats.systemHealth}
                    icon={<FaHeartbeat />}
                    color="green"
                />

            </div>

        </div>

    );

}