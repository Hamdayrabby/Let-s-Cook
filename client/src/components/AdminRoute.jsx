import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminRoute() {
    const { currentUser } = useSelector((state) => state.user);

    // Check if user is logged in
    if (!currentUser) {
        return <Navigate to="/admin/login" />;
    }

    // Check if user has admin role
    if (currentUser.data?.data?.user?.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return <Outlet />;
}

export default AdminRoute;
