import { ToastContainer, toast } from 'react-toastify';

class Toasts {
    static addRouteSuccess() {
        toast.success('Added Route Successfully', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            });
    }

    static addRouteError() {
        toast.error('Route cannot be added', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            });
    }

    static addVehicleSuccess() {
        toast.success('Added Vehicle Successfully', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            });
    }

    static addVehicleError() {
        toast.error('Vehicle cannot be added', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            });
    }
    
}
export default Toasts;