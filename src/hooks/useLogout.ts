import { useAppDispatch } from "@/hooks";
import { DeleteUser } from "@/store/customer";
import { ClearCart } from "@/store/cart";
import { useRouter } from "next/navigation";

const useLogout = () => {
        const router = useRouter();
  const dispatch = useAppDispatch();
   const LogOut = async ()=>{
                try {
                        const response = await fetch('/api/logout', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                        });
                        if (!response.ok) {
                                 
                                throw new Error('Failed to delete session');
                        }
                        router.push("/")
                } catch (error) {
                        console.error('Error during session deletion:', error);
                }
        }
        
  return () => {
    dispatch(DeleteUser());
    dispatch(ClearCart());
    LogOut()
  };
};

export default useLogout;