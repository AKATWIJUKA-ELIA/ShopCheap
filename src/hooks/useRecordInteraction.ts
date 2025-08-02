import { useAppSelector } from "@/hooks";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";


export default function useRecordInteraction() {
        // console.log("useRecordInteraction hook called");
  const recordInteraction = useMutation(api.products.recordInteraction);
  const userId = useAppSelector((state) => state.user.user?.User_id || "");

  const record = async ( productId: string, type: string) => {
        if (!userId || userId.length === 0) {
                return;
        }
    try {
      await recordInteraction({ user_id: userId, product_id: productId, type });
      return { success: true, message: "Interaction recorded successfully" };
    } catch (error) {
      console.error("Error recording interaction:", error);
      return { success: false, message: "Failed to record interaction" };
    }
  };

  return { record };
}