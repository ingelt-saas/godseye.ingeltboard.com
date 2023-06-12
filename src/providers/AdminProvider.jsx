import { useEffect, useState } from "react";
import { AdminContext } from "../contexts";
import Cookies from "js-cookie";
import authApi from "../api/auth";

const AdminProvider = ({ children }) => {

    const [loading, setLoading] = useState(true);
    const [inGelt, setInGelt] = useState(null);

    useEffect(() => {
        if (Cookies.get('ingelt_token')) {
            (async () => {
                try {
                    const res = await authApi.verifyInGelt();
                    setInGelt(res.data);
                    setLoading(false);
                } catch (err) {
                    setInGelt(null);
                    setLoading(false);
                }
            })();
        } else {
            setInGelt(null);
            setLoading(false);
        }
    }, []);

    const value = { inGelt, loading };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
}

export default AdminProvider;
