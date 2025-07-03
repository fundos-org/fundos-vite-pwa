import { eRoutes } from "@/RoutesEnum";
import { useNavigate } from "react-router-dom";

function DrawDown() {
    const navigate = useNavigate();
    return (
        <>
            <div>Drawn Down Notice is under development. </div>
            <button
                onClick={() => navigate(eRoutes.DASHBOARD_HOME)}
                className="bg-green-400 text-gray-900 font-semibold px-8 py-4 w-full transition-all duration-300 hover:bg-green-500 focus:outline-none"
            >
                Back to Dashboard
            </button>
        </>
    )
}

export default DrawDown