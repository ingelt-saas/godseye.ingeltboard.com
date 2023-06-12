import { AdminContext } from "../contexts";

const AdminProvider = ({ children }) => {

    const value = {};

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
}

export default AdminProvider;
