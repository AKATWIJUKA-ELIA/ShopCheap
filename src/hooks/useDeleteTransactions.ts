import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel"; // Import the Id type

const useDeleteTransactions = () => {
  const deleteTransactions = useMutation(api.transactions.DeleteTransactions);

  const handleDelete = async (id: string|undefined) => {
    try {
      const result = await deleteTransactions({ id: id as Id<"transactions"> });
      return result;
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      throw error;
    }
  };

  return handleDelete;
};

export default useDeleteTransactions;