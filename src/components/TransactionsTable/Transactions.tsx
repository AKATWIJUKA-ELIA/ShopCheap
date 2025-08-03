import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
      } from "@/components/ui/table"
      import { Checkbox } from "@/components/ui/checkbox";
import { Oval } from "react-loader-spinner";
import { Button } from "@/components/ui/button";
import DeleteModal from "@/components/DeleteModal/page";
import { useEffect, useState } from "react";
import DeleteAllModal from "@/components/DeleteAll/page";
import { Transaction } from "@/lib/utils";
import { Id } from "../../../convex/_generated/dataModel";

interface DataTableProps {
  transactions: Transaction[];
}
const DataTable: React.FC<DataTableProps> = ({ transactions }) => {

        const [isdelete, setisdelete] = useState(false);
        const [isdeleteall, setisdeleteall] = useState(false);
        const [productId, setproductId] = useState("");
        const [checked, setchecked] = useState<Id<"transactions">[]>([]);
        const [allchecked, setallchecked] = useState(false);


        const HandleCheckboxChange=(ProductId:Id<"transactions">)=>{
                if(!checked.includes(ProductId)){
                        setchecked([...checked,ProductId])
                }else{
                        setchecked(checked.filter(id=>id!==ProductId))
                }
        }

        const allIds = transactions.map(transaction => transaction._id);
        const allSelected = allIds.every(id => checked.includes(id as Id<"transactions">));
        useEffect(()=>{
                        if (allSelected) {
                        setallchecked(true);
                }else{
                        setallchecked(false);
                }
        },[checked, allSelected]);

        const HandleSelectAll = () => {
                if (!allSelected) {
                        setchecked(allIds as Id<"transactions">[]);
                        setallchecked(true);
                } else if (allSelected) {
                        setchecked([]);
                }

}

        const HandleDelete=(ProductId:string)=>{
                setproductId(ProductId)
                setisdelete(true)
        }

        const HandelDeleteAll=(checked:string[])=>{
                console.log(checked)
                setisdeleteall(true)
        }


        return (
                <>
                <div className="w-full  overflow-x-auto   rounded-lg border px-2 ">
                        <div className="flex items-center justify-between p-4 bg-gray-100  dark:bg-gray-800 rounded-t-lg">
                                <div className="text-lg font-semibold">All Products</div>
                                <Button 
                                className="bg-red-400 hover:bg-red-700 transition-transform duration-500" 
                                onClick={() => HandelDeleteAll(checked)}
                                disabled={checked.length === 0}>
                                        Delete Selected
                                </Button>
                        </div>
                {transactions?( 
                        <Table className="min-w-[800px]">
                  
                  <TableHeader>
                    <TableRow>
                            <TableHead className="w-[50px]"><Checkbox
                                onCheckedChange={HandleSelectAll}
                                checked={allchecked}
                                aria-label="Select all products"
                            /></TableHead>
                      <TableHead className="w-[100px]">User Id</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead className="text-right">Mode of Pay</TableHead>
                      <TableHead className="text-right">Refference</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                      <TableHead className="text-right">Type</TableHead>
                      <TableHead className="text-right">Date Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                        
                      <TableRow key={transaction._id}>
                        <TableCell className="font-medium"><Checkbox
                                onCheckedChange={() => HandleCheckboxChange(transaction._id as  Id<"transactions">)}
                                checked={checked.includes(transaction._id as Id<"transactions">)}
                                aria-label="Select transaction"
                         /></TableCell>
                         <TableCell className="font-medium">{transaction.user_id}</TableCell>
                        <TableCell className="font-medium">{transaction.amount}</TableCell>
                        <TableCell className="font-medium">{transaction.currency}</TableCell>
                        <TableCell>{transaction.payment_method}</TableCell>
                        <TableCell className="text-right">{transaction.reference}</TableCell>
                   
                        <TableCell className="text-right">{transaction.status}</TableCell>
                        <TableCell className="text-right">
                          {transaction.type}
                        </TableCell>
                        <TableCell className="text-right">
                          <time dateTime={new Date(transaction._creationTime).toISOString()}>
                            {new Date(transaction._creationTime).toLocaleDateString()}
                          </time>
                        </TableCell>
                        <TableCell className=" justify-center  flex gap-1">
                        <Button className="flex bg-red-400  hover:bg-red-700 transition-transform duration-500 " onClick={()=>{HandleDelete(transaction._id as Id<"transactions">)}}  >Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>):(
                        <Oval
                        visible={true}
                                    height="80"
                                    width="80"
                                    color="#0000FF"
                                    secondaryColor="#ddd"
                                    ariaLabel="oval-loading"
                                    wrapperClass=""
                        />
                )}
              </div>
                <DeleteModal isdelete={isdelete} onClose={() => setisdelete(false)} productId={productId} />
                        <DeleteAllModal isdeleteall={isdeleteall} onClose={() => setisdeleteall(false)} productIds={checked} />
                </>
              
        )
      }
      export default DataTable;